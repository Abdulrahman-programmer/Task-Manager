import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_APP_BASE_URL;

console.log(API);

// ─── Axios instance ───────────────────────────────────────────────────────────
const http = axios.create({ baseURL: API });

const authHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

http.interceptors.request.use(cfg => {
  cfg.headers = { ...cfg.headers, ...authHeader() };
  return cfg;
});

// ─── API calls ────────────────────────────────────────────────────────────────
const apiFetchDashboard = ()         => http.get("/api/tasks");
const apiCreateTask     = (body)     => http.post("/api/tasks", body);
const apiUpdateTask     = (id, body) => http.put(`/api/tasks/${id}`, body);
const apiDeleteTask     = (id)       => http.delete(`/api/tasks/${id}`);

// ─── Helpers ──────────────────────────────────────────────────────────────────
// FIX (minor): guard against undefined/null iso dates
const fmt  = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—";
const init = (n = "?") => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

const USER_PALETTES = [
  { color: "bg-sky-500/20 text-sky-300",         ring: "ring-sky-500/40"       },
  { color: "bg-pink-500/20 text-pink-300",        ring: "ring-pink-500/40"      },
  { color: "bg-emerald-500/20 text-emerald-300",  ring: "ring-emerald-500/40"   },
  { color: "bg-violet-500/20 text-violet-300",    ring: "ring-violet-500/40"    },
  { color: "bg-amber-500/20 text-amber-300",      ring: "ring-amber-500/40"     },
];

function paletteFor(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return USER_PALETTES[h % USER_PALETTES.length];
}

// ─── Badge config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending:      { label: "Pending",     dot: "bg-amber-400",   badge: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30"       },
  "in progress": { label: "In Progress", dot: "bg-blue-400",    badge: "bg-blue-400/10 text-blue-300 ring-1 ring-blue-400/30"          },
  completed:    { label: "Completed",   dot: "bg-emerald-400", badge: "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30" },
};

const PRIORITY_CFG = {
  high:   { label: "High",   badge: "bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/30"    },
  medium: { label: "Medium", badge: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30" },
  low:    { label: "Low",    badge: "bg-zinc-700/60 text-zinc-400 ring-1 ring-zinc-700"       },
};

// ─── Small shared components ──────────────────────────────────────────────────

function Badge({ cls, dot, label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${cls}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />}
      {label}
    </span>
  );
}

function Avatar({ id, name, size = "w-9 h-9 text-sm" }) {
  const p = paletteFor(id);
  return (
    <div className={`${size} rounded-full ${p.color} ring-2 ${p.ring} flex items-center justify-center font-bold flex-shrink-0`}>
      {init(name)}
    </div>
  );
}

function StatChip({ val, label, color }) {
  return (
    <div className="bg-zinc-800/60 border border-zinc-800 rounded-xl p-4 text-center">
      <p className={`text-2xl font-black ${color}`}>{val}</p>
      <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function AddTaskBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-zinc-700 hover:border-indigo-500 text-zinc-600 hover:text-indigo-400 text-[13px] font-semibold transition flex items-center justify-center gap-2">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Add task
    </button>
  );
}

// ─── Task Modal ───────────────────────────────────────────────────────────────

function TaskModal({ task, fixedUserId, users, onSave, onClose, saving }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState({
    title:       task?.title       || "",
    description: task?.description || "",
    status:      task?.status      || "pending",
    priority:    task?.priority    || "medium",
    user:
      task?.user?._id ||
      task?.user      ||
      fixedUserId     ||
      users[0]?._id   ||
      "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inp = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition";
  const lbl = "block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl w-[420px] max-w-[94vw] p-7"
           onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-zinc-100">{isEdit ? "Edit Task" : "New Task"}</h2>
          {/* FIX (minor): added aria-label for accessibility */}
          <button onClick={onClose} disabled={saving} aria-label="Close"
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center justify-center text-base transition">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={lbl}>Title</label>
            <input className={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Task title…" />
          </div>
          <div>
            <label className={lbl}>Description</label>
            <textarea className={`${inp} h-20 resize-none`} value={form.description}
              onChange={e => set("description", e.target.value)} placeholder="Optional details…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Status</label>
              <select className={inp} value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Priority</label>
              <select className={inp} value={form.priority} onChange={e => set("priority", e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {!fixedUserId && users.length > 1 && (
            <div>
              <label className={lbl}>Assign To</label>
              <select className={inp} value={form.user} onChange={e => set("user", e.target.value)}>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-7">
          <button onClick={onClose} disabled={saving}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 text-sm transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={() => onSave(form)} disabled={saving || !form.title.trim()}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center gap-2">
            {saving && (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="10"/>
              </svg>
            )}
            {isEdit ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onEdit, onDelete, onToggle }) {
  const s    = STATUS_CFG[task.status]     || STATUS_CFG.pending;
  const p    = PRIORITY_CFG[task.priority] || PRIORITY_CFG.medium;
  const done = task.status === "completed";

  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-800/60 last:border-0 group">
      <button onClick={() => onToggle(task)}
        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition
          ${done ? "bg-emerald-500 border-emerald-500" : "border-zinc-600 hover:border-zinc-400 bg-transparent"}`}>
        {done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-semibold truncate ${done ? "line-through text-zinc-600" : "text-zinc-200"}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-[11px] text-zinc-500 truncate mt-0.5">{task.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2 items-center">
          <Badge cls={s.badge} dot={s.dot} label={s.label} />
          <Badge cls={p.badge} label={p.label} />
          <span className="text-[10px] text-zinc-700">{fmt(task.updatedAt)}</span>
        </div>
      </div>


      {/* <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition flex-shrink-0 pt-0.5"> */}
      <div className="flex gap-1 transition flex-shrink-0 pt-0.5">
        <button onClick={() => onEdit(task)} title="Edit"
          className="w-7 h-7 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 flex items-center justify-center transition">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
            <path d="M11.5 2.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={() => onDelete(task._id)} title="Delete"
          className="w-7 h-7 rounded-md bg-zinc-800 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
            <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── User Card ────────────────────────────────────────────────────────────────

function UserCard({ userId, userName, tasks, onEdit, onDelete, onToggle, onAdd }) {
  const done = tasks.filter(t => t.status === "completed").length;
  const pct  = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col transition">
      <div className="flex items-center gap-3 mb-4">
        <Avatar id={userId} name={userName} size="w-10 h-10 text-sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-zinc-100 truncate">{userName}</p>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest truncate">{userId.slice(-8)}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-xl font-black ${pct === 100 ? "text-emerald-400" : "text-zinc-100"}`}>{pct}%</p>
          <p className="text-[10px] text-zinc-600">{done}/{tasks.length}</p>
        </div>
      </div>

      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
             style={{ width: `${pct}%` }} />
      </div>

      <div className="flex-1">
        {tasks.length === 0
          ? <p className="text-[12px] text-zinc-700 text-center py-6">No tasks yet</p>
          : tasks.map(t => (
              <TaskRow key={t._id} task={t} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
            ))
        }
      </div>

      <AddTaskBtn onClick={() => onAdd(userId)} />
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ tasks, currentUser, onEdit, onDelete, onToggle, onAdd }) {
  // FIX (warn): handle user as plain string ID or populated object
  const byUser = tasks.reduce((acc, t) => {
    const uid   = t.user?._id || t.user || "unknown";
    const uname = (typeof t.user === "object" ? t.user?.name : null)
                  || (uid === currentUser?._id ? currentUser?.name : uid.slice(-8));
    if (!acc[uid]) acc[uid] = { name: uname, tasks: [] };
    acc[uid].tasks.push(t);
    return acc;
  }, {});

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatChip val={tasks.length}                                        label="Total Tasks" color="text-zinc-100"    />
        <StatChip val={tasks.filter(t => t.status === "in progress").length} label="In Progress" color="text-blue-400"    />
        <StatChip val={tasks.filter(t => t.status === "completed").length}  label="Completed"   color="text-emerald-400" />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {Object.entries(byUser).map(([userId, { name, tasks: ut }]) => (
          <UserCard
            key={userId}
            userId={userId} userName={name} tasks={ut}
            onEdit={onEdit} onDelete={onDelete} onToggle={onToggle}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}

// ─── User Dashboard ───────────────────────────────────────────────────────────

function UserDashboard({ tasks, currentUser, onEdit, onDelete, onToggle, onAdd }) {
  const done = tasks.filter(t => t.status === "completed").length;
  const pct  = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const uid  = currentUser?._id || currentUser || "";
  const name = currentUser?.name || "My Tasks";

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-7 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Avatar id={uid} name={name} size="w-14 h-14 text-lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-zinc-100">{name}</h2>
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">{uid.slice(-8)}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-3xl font-black leading-none ${pct === 100 ? "text-emerald-400" : "text-zinc-100"}`}>{pct}%</p>
            <p className="text-[11px] text-zinc-600 mt-1">{done} of {tasks.length} done</p>
          </div>
        </div>

        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-6">
          <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
               style={{ width: `${pct}%` }} />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <StatChip val={tasks.filter(t => t.status === "pending").length}    label="Pending"     color="text-amber-400"   />
          <StatChip val={tasks.filter(t => t.status === "in progress").length} label="In Progress" color="text-blue-400"    />
          <StatChip val={tasks.filter(t => t.status === "completed").length}  label="Completed"   color="text-emerald-400" />
        </div>

        <div className="min-h-[60px]">
          {tasks.length === 0
            ? <p className="text-sm text-zinc-700 text-center py-8">No tasks yet — add one below</p>
            : tasks.map(t => (
                <TaskRow key={t._id} task={t} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
              ))
          }
        </div>

        <AddTaskBtn onClick={() => onAdd(uid)} />
      </div>
    </div>
  );
}

// ─── Loading / Error states ───────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="10"/>
        </svg>
        <p className="text-sm text-zinc-600 font-mono">Loading dashboard…</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-rose-400 font-semibold mb-2">Failed to load</p>
        <p className="text-sm text-zinc-600 mb-4">{message}</p>
        <button onClick={onRetry}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition">
          Retry
        </button>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tasks,       setTasks]       = useState([]);
  const [role,        setRole]        = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [modal,       setModal]       = useState(null);
  const [saving,      setSaving]      = useState(false);

  // ── Fetch dashboard ──────────────────────────────────────────────────────────
const loadDashboard = useCallback(async (showSpinner = true) => {
  if (showSpinner) setLoading(true);
  setError(null);
  try {
    const res = await apiFetchDashboard();
    console.log("API response:", res.data); // remove after confirming

    // handle both { tasks, role, user } and { data: { tasks, role, user } }
    const payload = res.data?.data || res.data;
    const { tasks: t = [], role: r, user } = payload;

    setTasks(t);
    setRole(r?.toLowerCase?.() ?? r); // normalize "Admin" -> "admin"
    if (r?.toLowerCase?.() === "user") setCurrentUser(user || null);
    else setCurrentUser(null); // explicitly clear for admin
    
  } catch (err) {
    setError(err?.response?.data?.message || err.message || "Unknown error");
  } finally {
    if (showSpinner) setLoading(false);
  }
}, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal.task) {
        await apiUpdateTask(modal.task._id, form);
      } else {
        await apiCreateTask(form);
      }
      setModal(null);
      await loadDashboard(false); // refetch without full-page spinner
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await apiDeleteTask(id);
      await loadDashboard(false); // refetch without full-page spinner
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggle = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    // Optimistic update so toggle feels instant
    setTasks(prev => prev.map(t =>
      t._id === task._id
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    ));
    try {
      await apiUpdateTask(task._id, { status: newStatus });
      await loadDashboard(false); // sync server state without spinner
    } catch (err) {
      // Rollback on failure
      setTasks(prev => prev.map(t => t._id === task._id ? task : t));
      alert("Failed to update task status");
    }
  };

  const openAdd  = (fixedUserId) => setModal({ task: null, fixedUserId });
  // FIX (critical): was `user.id` — variable `user` doesn't exist in scope; use currentUser?._id
  const openEdit = (task)        => setModal({ task, fixedUserId: currentUser?._id });

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) return <Spinner />;
  if (error)   return <ErrorScreen message={error} onRetry={loadDashboard} />;

  // FIX (warn): handle user as plain string ID or populated object
  const usersFromTasks = Object.values(
    (tasks || []).reduce((acc, t)  => {
      const uid   = t.user?._id || t.user;
      const uname = (typeof t.user === "object" ? t.user?.name : null)
                    || (uid === currentUser?._id ? currentUser?.name : uid);
      if (uid && !acc[uid]) acc[uid] = { _id: uid, name: uname || uid };
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 16 16">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" opacity=".9"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" opacity=".4"/>
            </svg>
          </div>
          <span className="text-sm font-black tracking-tight">TaskFlow</span>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
          ${role === "admin"
            ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40"
            : "bg-zinc-700/60 text-zinc-400 ring-1 ring-zinc-700"}`}>
          {role === "admin" ? "⬡ Admin" : "◯ User"}
        </span>

        <button onClick={loadDashboard}
          className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 flex items-center justify-center transition"
          title="Refresh">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path d="M13 8A5 5 0 1 1 8 3a5 5 0 0 1 3.5 1.4L13 2v4h-4l1.6-1.6A3 3 0 1 0 11 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </nav>

      {/* ── Page Header ── */}
      <header className="px-6 pt-8 pb-2">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
          {role === "admin" ? "Admin · All Members" : "User · Personal Board"}
        </p>
        <h1 className="text-2xl font-black text-zinc-100">
          {role === "admin" ? "Team Dashboard" : `${currentUser?.name || "My"} Tasks`}
        </h1>
        <p className="text-sm text-zinc-600 mt-1">
          {role === "admin"
            ? `${usersFromTasks.length} members · ${tasks.length} tasks total`
            : `${tasks.length} tasks assigned to you`}
        </p>
      </header>

      {/* ── Main ── */}
      <main className="px-6 py-8">
        {role === "admin"
          ? (
            <AdminDashboard
              tasks={tasks}
              currentUser={currentUser}
              onEdit={openEdit} onDelete={handleDelete}
              onToggle={handleToggle} onAdd={openAdd}
            />
          ) : (
            <UserDashboard
              tasks={tasks}
              currentUser={currentUser}
              onEdit={openEdit} onDelete={handleDelete}
              onToggle={handleToggle} onAdd={openAdd}
            />
          )
        }
      </main>

      {/* ── Modal ── */}
      {modal && (
        <TaskModal
          task={modal.task}
          fixedUserId={modal.fixedUserId}
          users={usersFromTasks}
          onSave={handleSave}
          onClose={() => !saving && setModal(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
