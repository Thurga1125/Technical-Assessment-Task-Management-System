import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Task, TaskStatus, TaskPriority, Project } from "../types";
import type { TaskFormData } from "../lib/validations";
import type { ProjectFormData } from "../components/projects/ProjectForm";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import Modal from "../components/ui/Modal";

const ALL = "ALL";

const COLUMNS: { status: TaskStatus; label: string; dot: string }[] = [
  { status: "TODO", label: "To Do", dot: "bg-gray-400" },
  { status: "IN_PROGRESS", label: "In Progress", dot: "bg-yellow-400" },
  { status: "DONE", label: "Done", dot: "bg-green-400" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Tasks state (for selected project)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | typeof ALL>(ALL);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | typeof ALL>(ALL);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ── Projects ──────────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get<Project[]>("/projects");
      setProjects(data);
    } catch {
      setError("Failed to load projects. Please refresh.");
    } finally {
      setIsProjectsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  async function handleCreateOrUpdateProject(data: ProjectFormData) {
    if (editingProject) {
      const { data: updated } = await api.put<Project>(`/projects/${editingProject.id}`, data);
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      if (selectedProject?.id === updated.id) setSelectedProject(updated);
    } else {
      const { data: created } = await api.post<Project>("/projects", data);
      setProjects(prev => [created, ...prev]);
    }
    closeProjectModal();
  }

  async function handleDeleteProject(id: string) {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
      setTasks([]);
    }
  }

  function openCreateProject() { setEditingProject(null); setProjectModalOpen(true); }
  function openEditProject(project: Project) { setEditingProject(project); setProjectModalOpen(true); }
  function closeProjectModal() { setProjectModalOpen(false); setEditingProject(null); }

  // ── Tasks ─────────────────────────────────────────────────────────
  const fetchProjectTasks = useCallback(async (projectId: string) => {
    setIsTasksLoading(true);
    setError("");
    try {
      const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`);
      setTasks(data);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setIsTasksLoading(false);
    }
  }, []);

  function handleOpenProject(project: Project) {
    setSelectedProject(project);
    setSearch("");
    setStatusFilter(ALL);
    setPriorityFilter(ALL);
    fetchProjectTasks(project.id);
  }

  async function handleCreateOrUpdateTask(data: TaskFormData) {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      projectId: selectedProject!.id,
    };
    if (editingTask) {
      const { data: updated } = await api.put<Task>(`/tasks/${editingTask.id}`, payload);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      // refresh project task counts
      refreshProjectTaskCount(selectedProject!.id);
    } else {
      const { data: created } = await api.post<Task>("/tasks", payload);
      setTasks(prev => [created, ...prev]);
      refreshProjectTaskCount(selectedProject!.id);
    }
    closeTaskModal();
  }

  async function handleDeleteTask(id: string) {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t.id !== id));
    refreshProjectTaskCount(selectedProject!.id);
  }

  async function refreshProjectTaskCount(projectId: string) {
    try {
      const { data } = await api.get<Project[]>("/projects");
      setProjects(data);
      const updated = data.find(p => p.id === projectId);
      if (updated) setSelectedProject(updated);
    } catch { /* ignore */ }
  }

  function openCreateTask() { setEditingTask(null); setTaskModalOpen(true); }
  function openEditTask(task: Task) { setEditingTask(task); setTaskModalOpen(true); }
  function closeTaskModal() { setTaskModalOpen(false); setEditingTask(null); }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  // ── Derived values ────────────────────────────────────────────────
  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";
  const userName = user?.email?.split("@")[0] ?? "User";

  const filteredTasks = tasks
    .filter(t => {
      if (statusFilter !== ALL && t.status !== statusFilter) return false;
      if (priorityFilter !== ALL && t.priority !== priorityFilter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

  const doneCnt = tasks.filter(t => t.status === "DONE").length;
  const todoCnt = tasks.filter(t => t.status === "TODO").length;
  const inProgCnt = tasks.filter(t => t.status === "IN_PROGRESS").length;

  return (
    <div className="flex min-h-screen bg-[color:rgba(144,213,255,0.08)]">
      {/* ── Sidebar ── */}
      <aside className="w-60 fixed inset-y-0 left-0 bg-white border-r border-gray-100 flex flex-col z-20 shadow-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="leading-none">
              <div className="text-[9px] font-black text-[var(--color-primary)] tracking-[0.2em]">TASK</div>
              <div className="text-[9px] font-black text-gray-900 tracking-[0.2em]">FLOW</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {/* Overview */}
          <button
            onClick={() => { setSelectedProject(null); setTasks([]); setError(""); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              !selectedProject
                ? "bg-[color:rgba(144,213,255,0.18)] text-[var(--color-primary)]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="flex-1 text-left">Overview</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${!selectedProject ? "bg-[color:rgba(144,213,255,0.3)] text-[var(--color-primary)]" : "bg-gray-100 text-gray-500"}`}>
              {projects.length}
            </span>
          </button>

          {/* Projects section */}
          <div className="mt-3 mb-1 px-3">
            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Projects</p>
          </div>

          {isProjectsLoading ? (
            <div className="space-y-2 px-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-xs text-gray-400 px-3 py-2">No projects yet</p>
          ) : (
            projects.map(project => {
              const isActive = selectedProject?.id === project.id;
              return (
                <button
                  key={project.id}
                  onClick={() => handleOpenProject(project)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[color:rgba(144,213,255,0.18)] text-[var(--color-primary)]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v1H3V7zm0 4h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                  </svg>
                  <span className="flex-1 text-left truncate">{project.name}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0 ${isActive ? "bg-[color:rgba(144,213,255,0.3)] text-[var(--color-primary)]" : "bg-gray-100 text-gray-500"}`}>
                    {project.tasks.length}
                  </span>
                </button>
              );
            })
          )}

          {/* New project button */}
          <button
            onClick={openCreateProject}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-400 hover:text-[var(--color-primary)] hover:bg-[color:rgba(144,213,255,0.08)] rounded-xl transition-colors border border-dashed border-gray-200 hover:border-[color:rgba(144,213,255,0.4)]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate capitalize">{userName}</p>
              <p className="text-xs text-green-500 font-medium">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-60 flex-1 px-8 py-8">
        {!selectedProject ? (
          // ── Projects Overview ──────────────────────────────────────
          <>
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black text-gray-900">My Projects</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  {isProjectsLoading ? "Loading..." : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                onClick={openCreateProject}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[color:rgba(63,169,255,0.9)] transition-colors shadow-lg shadow-[color:rgba(144,213,255,0.55)] text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}

            {isProjectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
                    <div className="h-2 bg-gray-100 rounded mb-4" />
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3].map(j => <div key={j} className="flex-1 h-7 bg-gray-100 rounded-lg" />)}
                    </div>
                    <div className="h-9 bg-gray-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-[color:rgba(144,213,255,0.15)] rounded-3xl flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v1H3V7zm0 4h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">No projects yet</h2>
                <p className="text-gray-400 text-sm mb-8 max-w-sm">
                  Create your first project to start organizing tasks and tracking your work.
                </p>
                <button
                  onClick={openCreateProject}
                  className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-6 py-3 rounded-xl hover:bg-[color:rgba(63,169,255,0.9)] transition-colors shadow-lg shadow-[color:rgba(144,213,255,0.55)] text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={handleOpenProject}
                    onEdit={openEditProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // ── Project Task Board ─────────────────────────────────────
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setSelectedProject(null); setTasks([]); setError(""); }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Projects
                </button>
                <span className="text-gray-300">/</span>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{selectedProject.name}</h1>
                  {selectedProject.description && (
                    <p className="text-gray-400 text-sm mt-0.5 max-w-lg truncate">{selectedProject.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={openCreateTask}
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[color:rgba(63,169,255,0.9)] transition-colors shadow-lg shadow-[color:rgba(144,213,255,0.55)] text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total", value: tasks.length, dot: "bg-[var(--color-primary)]" },
                { label: "To Do", value: todoCnt, dot: "bg-gray-400" },
                { label: "In Progress", value: inProgCnt, dot: "bg-yellow-400" },
                { label: "Done", value: doneCnt, dot: "bg-green-400" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
                  <div>
                    <p className="text-xl font-black text-gray-900">{isTasksLoading ? "—" : s.value}</p>
                    <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {([ALL, "TODO", "IN_PROGRESS", "DONE"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                      statusFilter === s
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-[var(--color-primary-soft)]"
                    }`}
                  >
                    {s === ALL ? "All" : s === "TODO" ? "To Do" : s === "IN_PROGRESS" ? "In Progress" : "Done"}
                  </button>
                ))}
              </div>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as "newest" | "oldest")}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-600 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Priority filter */}
            <div className="flex gap-2 mb-6">
              {([ALL, "LOW", "MEDIUM", "HIGH", "URGENT"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    priorityFilter === p
                      ? "bg-gray-800 text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  {p === ALL ? "All Priority" : p}
                </button>
              ))}
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COLUMNS.map(col => {
                const colTasks = filteredTasks.filter(t => t.status === col.status);
                return (
                  <div key={col.status}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <h3 className="font-bold text-gray-700 text-sm">{col.label}</h3>
                      <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {isTasksLoading ? "—" : colTasks.length}
                      </span>
                    </div>
                    <div className="space-y-3 min-h-[200px]">
                      {isTasksLoading ? (
                        [1, 2].map(i => (
                          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="h-2 bg-gray-100 rounded w-full mb-2" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                        ))
                      ) : colTasks.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                          <p className="text-xs text-gray-400 font-medium">No tasks</p>
                        </div>
                      ) : (
                        colTasks.map(task => (
                          <TaskCard key={task.id} task={task} onEdit={openEditTask} onDelete={handleDeleteTask} />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── Modals ── */}
      <Modal open={projectModalOpen} onClose={closeProjectModal} title={editingProject ? "Edit Project" : "New Project"}>
        <ProjectForm defaultValues={editingProject ?? undefined} onSubmit={handleCreateOrUpdateProject} onCancel={closeProjectModal} />
      </Modal>

      <Modal open={taskModalOpen} onClose={closeTaskModal} title={editingTask ? "Edit Task" : "New Task"}>
        <TaskForm defaultValues={editingTask ?? undefined} onSubmit={handleCreateOrUpdateTask} onCancel={closeTaskModal} />
      </Modal>
    </div>
  );
}
