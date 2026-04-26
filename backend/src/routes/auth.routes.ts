import { Router } from "express";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { registerSchema, loginSchema } from "../validations/auth.schema";
import { register, login, refresh, logout } from "../controllers/auth.controller";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), asyncHandler(register));
router.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", authenticate, asyncHandler(logout));

export default router;
