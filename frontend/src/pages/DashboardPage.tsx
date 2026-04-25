import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Task, TaskStatus, TaskPriority } from "../types";
import type { TaskFormData } from "../lib/validations";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/ui/Modal";

const ALL = "ALL";

const COLUMNS: { status: TaskStatus; label: string; dot: string }[] = [
  { status: "TODO", label: "To Do", dot: "bg-gray-400" },
  { status: "IN_PROGRESS", label: "In Progress", dot: "bg-yellow-400" },
  { status: "DONE", label: "Done", dot: "bg-green-400" },
];

function CircularProgress({ pct }: { pct: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="130" height="130" className="-rotate-90">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke={pct === 100 ? "#22C55E" : "#3FA9FF"}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x="65" y="65"
        textAnchor="middle" dominantBaseline="central"
        className="rotate-90 origin-center"
        style={{ transform: "rotate(90deg)", transformOrigin: "65px 65px", fill: "#111827", fontSize: "20px", fontWeight: "800" }}
      >
        {pct}%
      </text>
      <text
        x="65" y="82"
        textAnchor="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: "65px 65px", fill: "#9CA3AF", fontSize: "9px" }}
      >
        Completed
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | typeof ALL>(ALL);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | typeof ALL>(ALL);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    } catch {
      setError("Failed to load tasks. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function handleCreateOrUpdate(data: TaskFormData) {
    const payload = { ...data, dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null };
    if (editingTask) {
      const { data: updated } = await api.put<Task>(`/tasks/${editingTask.id}`, payload);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      const { data: created } = await api.post<Task>("/tasks", payload);
      setTasks(prev => [created, ...prev]);
    }
    closeModal();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function openCreate() { setEditingTask(null); setModalOpen(true); }
  function openEdit(task: Task) { setEditingTask(task); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingTask(null); }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "U";
  const userName = user?.email?.split("@")[0] ?? "User";

  const doneCnt = tasks.filter(t => t.status === "DONE").length;
  const todoCnt = tasks.filter(t => t.status === "TODO").length;
  const inProgCnt = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const pct = tasks.length === 0 ? 0 : Math.round((doneCnt / tasks.length) * 100);

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

  return (
    <div className="flex min-h-screen bg-[color:rgba(144,213,255,0.08)]">
      {/* Sidebar */}
      <aside className="w-56 fixed inset-y-0 left-0 bg-white border-r border-gray-100 flex flex-col z-20 shadow-sm">
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
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            label="Dashboard"
            active
          />
          <NavItem
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            label="Tasks"
            badge={tasks.length}
          />
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

      {/* Main */}
      <main className="ml-56 flex-1 px-8 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Tasks</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage and track all your tasks</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[color:rgba(63,169,255,0.9)] transition-colors shadow-lg shadow-[color:rgba(144,213,255,0.55)] text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-6 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Progress + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Circular Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center shadow-sm">
            <p className="text-sm font-semibold text-gray-500 mb-4">Overall Progress</p>
            {isLoading ? (
              <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse" />
            ) : (
              <CircularProgress pct={pct} />
            )}
            <div className="flex gap-6 mt-4 text-center">
              {[
                { label: "To Do", count: todoCnt, color: "text-gray-500" },
                { label: "In Progress", count: inProgCnt, color: "text-yellow-500" },
                { label: "Done", count: doneCnt, color: "text-green-500" },
              ].map(s => (
                <div key={s.label}>
                  <p className={`text-lg font-black ${s.color}`}>{isLoading ? "—" : s.count}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Total Tasks", value: tasks.length, dot: "bg-[var(--color-primary)]", desc: "All tasks" },
              { label: "To Do", value: todoCnt, dot: "bg-gray-400", desc: "Not started yet" },
              { label: "In Progress", value: inProgCnt, dot: "bg-yellow-400", desc: "Currently active" },
              { label: "Done", value: doneCnt, dot: "bg-green-400", desc: "Completed tasks" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-6 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-sm text-gray-500 font-medium">{s.label}</span>
                </div>
                <p className="text-3xl font-black text-gray-900">
                  {isLoading ? <span className="text-gray-300">—</span> : s.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

          {/* Status filter pills */}
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
                {s === ALL ? "All Tasks" : s === "TODO" ? "To Do" : s === "IN_PROGRESS" ? "In Progress" : "Done"}
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
                  <h3 className="font-bold text-gray-700 text-sm">
                    {col.label}
                  </h3>
                  <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {isLoading ? "—" : colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {isLoading ? (
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
                      <TaskCard key={task.id} task={task} onEdit={openEdit} onDelete={handleDelete} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Modal open={modalOpen} onClose={closeModal} title={editingTask ? "Edit Task" : "New Task"}>
        <TaskForm defaultValues={editingTask ?? undefined} onSubmit={handleCreateOrUpdate} onCancel={closeModal} />
      </Modal>
    </div>
  );
}

function NavItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: number }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${active ? "bg-[color:rgba(144,213,255,0.18)] text-[var(--color-primary)]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? "bg-[color:rgba(144,213,255,0.3)] text-[var(--color-primary)]" : "bg-gray-100 text-gray-500"}`}>
          {badge}
        </span>
      )}
    </div>
  );
}
