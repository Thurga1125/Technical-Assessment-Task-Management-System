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

const router = Router();

router.use(authenticate);
router.use(apiRateLimiter);

router.get("/", getProjects);
router.post("/", validate(createProjectSchema), createProject);
router.put("/:id", validate(updateProjectSchema), updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/tasks", getProjectTasks);

export default router;
