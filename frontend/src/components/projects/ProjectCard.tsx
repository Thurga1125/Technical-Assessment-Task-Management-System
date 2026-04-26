import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onOpen, onEdit, onDelete }: ProjectCardProps) {
  const total = project.tasks.length;
  const done = project.tasks.filter(t => t.status === "DONE").length;
  const inProgress = project.tasks.filter(t => t.status === "IN_PROGRESS").length;
  const todo = project.tasks.filter(t => t.status === "TODO").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-[color:rgba(144,213,255,0.2)] rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v1H3V7zm0 4h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{project.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(project.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5 shrink-0">
          <button
            onClick={() => onEdit(project)}
            aria-label="Edit project"
            className="p-1.5 text-gray-400 hover:text-[var(--color-primary)] hover:bg-[color:rgba(144,213,255,0.1)] rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(project.id)}
            aria-label="Delete project"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {project.description ? (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{project.description}</p>
      ) : (
        <p className="text-sm text-gray-300 italic">No description</p>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-gray-500">Progress</span>
          <span className="text-xs font-bold text-gray-700">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-400" : "bg-[var(--color-primary)]"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Task counts */}
      <div className="flex gap-2">
        {[
          { label: "To Do", count: todo, color: "bg-gray-100 text-gray-600" },
          { label: "In Progress", count: inProgress, color: "bg-yellow-100 text-yellow-700" },
          { label: "Done", count: done, color: "bg-green-100 text-green-700" },
        ].map(s => (
          <span key={s.label} className={`flex-1 text-center text-xs font-bold py-1.5 rounded-lg ${s.color}`}>
            {s.count} {s.label}
          </span>
        ))}
      </div>

      {/* Open button */}
      <button
        onClick={() => onOpen(project)}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-[var(--color-primary)] border-2 border-[color:rgba(144,213,255,0.4)] rounded-xl hover:bg-[color:rgba(144,213,255,0.08)] transition-colors"
      >
        Open Project
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
