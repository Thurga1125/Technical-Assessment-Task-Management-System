import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { apiRateLimiter } from "../middleware/rateLimiter";
import { createTaskSchema, updateTaskSchema } from "../validations/task.schema";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.controller";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

router.use(authenticate);
router.use(apiRateLimiter);

router.get("/", asyncHandler(getTasks));
router.post("/", validate(createTaskSchema), asyncHandler(createTask));
router.put("/:id", validate(updateTaskSchema), asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
