import type { Task, TaskPriority, TaskStatus } from "../../types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
  URGENT: "bg-red-200 text-red-800",
};

const STATUS_DOT: Record<TaskStatus, string> = {
  TODO: "bg-gray-400",
  IN_PROGRESS: "bg-yellow-400",
  DONE: "bg-green-400",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

function isOverdue(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = task.status !== "DONE" && isOverdue(task.dueDate);

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all duration-200 ${overdue ? "border-red-200" : "border-gray-200"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug break-words flex-1 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex gap-0.5 shrink-0">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{task.description}</p>
      )}

      {/* Priority badge */}
      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg mb-3 uppercase tracking-wide ${PRIORITY_BADGE[task.priority]}`}>
        {task.priority}
      </span>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3 mt-1">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[task.status]}`} />
          <span>{STATUS_LABEL[task.status]}</span>
        </div>

        {task.dueDate && (
          <span className={overdue ? "text-red-500 font-semibold" : ""}>
            {overdue ? "Overdue · " : ""}
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
