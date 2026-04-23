import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { apiRateLimiter } from "../middleware/rateLimiter";
import { createTaskSchema, updateTaskSchema } from "../validations/task.schema";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.controller";

const router = Router();

router.use(authenticate);
router.use(apiRateLimiter);

router.get("/", getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
