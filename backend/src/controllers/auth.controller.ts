import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { RegisterInput, LoginInput } from "../validations/auth.schema";

const IS_PROD = process.env.NODE_ENV === "production";

// SameSite=None is required for cross-origin cookie delivery (frontend and backend
// on different domains). Strict would silently drop the cookie on cross-origin requests.
// SameSite=None requires Secure=true, which is enforced in production.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: (IS_PROD ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export async function register(
  req: Request<object, object, RegisterInput>,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  res.status(201).json({ accessToken, user: { id: user.id, email: user.email } });
}

export async function login(
  req: Request<object, object, LoginInput>,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  res.json({ accessToken, user: { id: user.id, email: user.email } });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const accessToken = signAccessToken(user.id);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie("refreshToken", { path: "/" });
  res.json({ message: "Logged out" });
}
