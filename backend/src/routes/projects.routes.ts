import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { apiRateLimiter } from "../middleware/rateLimiter";
import { createProjectSchema, updateProjectSchema } from "../validations/project.schema";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
} from "../controllers/projects.controller";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

router.use(authenticate);
router.use(apiRateLimiter);

router.get("/", asyncHandler(getProjects));
router.post("/", validate(createProjectSchema), asyncHandler(createProject));
router.put("/:id", validate(updateProjectSchema), asyncHandler(updateProject));
router.delete("/:id", asyncHandler(deleteProject));
router.get("/:id/tasks", asyncHandler(getProjectTasks));

export default router;
