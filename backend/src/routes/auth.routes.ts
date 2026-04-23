import { Router } from "express";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { registerSchema, loginSchema } from "../validations/auth.schema";
import { register, login, refresh, logout } from "../controllers/auth.controller";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);

export default router;
