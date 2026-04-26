import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authenticate";
import { CreateProjectInput, UpdateProjectInput } from "../validations/project.schema";

const taskSelect = { select: { id: true, status: true } };

export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId! },
    include: { tasks: taskSelect },
    orderBy: { createdAt: "desc" },
  });
  res.json(projects);
}

export async function createProject(
  req: AuthRequest & { body: CreateProjectInput },
  res: Response
): Promise<void> {
  const { name, description } = req.body;
  const project = await prisma.project.create({
    data: { name, description, userId: req.userId! },
    include: { tasks: taskSelect },
  });
  res.status(201).json(project);
}

export async function updateProject(
  req: AuthRequest & { body: UpdateProjectInput },
  res: Response
): Promise<void> {
  const { id } = req.params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  const { name, description } = req.body;
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
    },
    include: { tasks: taskSelect },
  });
  res.json(project);
}

export async function deleteProject(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  await prisma.project.delete({ where: { id } });
  res.status(204).send();
}

export async function getProjectTasks(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  const tasks = await prisma.task.findMany({
    where: { projectId: id, userId: req.userId! },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
  res.json(tasks);
}
