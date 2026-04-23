import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authenticate";
import { CreateTaskInput, UpdateTaskInput } from "../validations/task.schema";

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId! },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
  res.json(tasks);
}

export async function createTask(
  req: AuthRequest & { body: CreateTaskInput },
  res: Response
): Promise<void> {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.userId!,
    },
  });
  res.status(201).json(task);
}

export async function updateTask(
  req: AuthRequest & { body: UpdateTaskInput },
  res: Response
): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  const { title, description, status, priority, dueDate } = req.body;
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
  });
  res.json(task);
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
}
