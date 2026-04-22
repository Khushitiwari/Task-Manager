
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];

const STATUS_STYLES = {
  "pending":     "text-yellow-500/80 border-yellow-800/60 bg-yellow-950/30",
  "in-progress": "text-blue-400/80 border-blue-800/60 bg-blue-950/30",
  "completed":   "text-emerald-400/80 border-emerald-800/60 bg-emerald-950/30",
};

const EMPTY_FORM = { title: "", description: "", status: "pending", dueDate: "" };

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks, addTask, editTask, removeTask } = useTasks();

  // Add form
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [focused,     setFocused]     = useState(null);
  const [adding,      setAdding]      = useState(false);

  // Edit modal
  const [editingTask, setEditingTask] = useState(null); // task object
  const [editForm,    setEditForm]    = useState(EMPTY_FORM);
  const [saving,      setSaving]      = useState(false);

  // Filter
  const [filter,      setFilter]      = useState("");

  // Remove animation
  const [removing,    setRemoving]    = useState(null);

  /* ── handlers ── */
  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    setAdding(true);
    await addTask({
      title:       form.title.trim(),
      description: form.description.trim(),
      status:      form.status,
      dueDate:     form.dueDate || undefined,
    });
    setForm(EMPTY_FORM);
    setAdding(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleAdd(); };

  const openEdit = (task) => {
    setEditingTask(task);
    setEditForm({
      title:       task.title       || "",
      description: task.description || "",
      status:      task.status      || "pending",
      dueDate:     task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  };

  const handleSave = async () => {
    if (!editForm.title.trim()) return;
    setSaving(true);
    await editTask(editingTask._id, {
      title:       editForm.title.trim(),
      description: editForm.description.trim(),
      status:      editForm.status,
      dueDate:     editForm.dueDate || undefined,
    });
    setSaving(false);
    setEditingTask(null);
  };

  const handleRemove = async (id) => {
    setRemoving(id);
    await removeTask(id);
    setRemoving(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTasks = filter
    ? tasks.filter((t) => t.status === filter)
    : tasks;

  /* ── shared input class helper ── */
  const inputCls = (name) =>
    `font-mono-custom w-full rounded-sm border px-4 py-2.5 text-sm tracking-wide
     text-stone-200 placeholder:text-stone-700 outline-none transition-all duration-200
     ${focused === name
       ? "border-yellow-600/50 bg-yellow-950/30 shadow-[0_0_0_3px_rgba(161,98,7,0.08)]"
       : "border-stone-800 bg-white/[0.02] hover:border-stone-700"}`;

  const selectCls =
    `font-mono-custom w-full rounded-sm border border-stone-800 bg-neutral-900
     px-4 py-2.5 text-sm tracking-wide text-stone-300 outline-none
     transition-all duration-200 hover:border-stone-700 cursor-pointer`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&display=swap');

        .font-display     { font-family: 'Cormorant Garamond', serif; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px)  } to { opacity:1; transform:translateY(0) } }
        @keyframes drift   { from { transform:translate(0,0) scale(1) }     to { transform:translate(28px,18px) scale(1.05) } }
        @keyframes shimmer { from { transform:translateX(-100%) }           to { transform:translateX(100%) } }
        @keyframes fadeOut { from { opacity:1; max-height:90px } to { opacity:0; max-height:0; padding:0; margin:0 } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(12px) } to { opacity:1; transform:scale(1) translateY(0) } }

        .animate-fade-up     { animation: fadeUp  0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-fade-in     { animation: fadeIn  0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-drift       { animation: drift   11s ease-in-out infinite alternate; }
        .animate-drift-delay { animation: drift   11s ease-in-out infinite alternate; animation-delay:-4s; }
        .animate-removing    { animation: fadeOut 0.3s ease forwards; }
        .animate-modal-in    { animation: modalIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }

        .btn-shimmer::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:translateX(-100%);
        }
        .btn-shimmer:hover::after { animation: shimmer 0.55s ease forwards; }

        .underline-gold {
          position:absolute; bottom:0; left:0; height:1px;
          background:#b8955a;
          transition:width 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        .task-row:hover .task-actions { opacity:1; }
        .task-actions { opacity:0; transition:opacity 0.2s; }

        select option { background:#1c1c1c; color:#d6d3d1; }
      `}</style>

      <div className="font-mono-custom relative min-h-screen overflow-x-hidden bg-neutral-950">

        {/* Blobs */}
        <div className="animate-drift pointer-events-none fixed -top-40 -right-20 h-96 w-96 rounded-full opacity-10 blur-3xl bg-gradient-to-br from-yellow-600 to-transparent" />
        <div className="animate-drift-delay pointer-events-none fixed -bottom-24 -left-16 h-72 w-72 rounded-full opacity-10 blur-3xl bg-gradient-to-tr from-yellow-800 to-transparent" />

        {/* ── Nav ── */}
        <header className="relative z-10 flex items-center justify-between border-b border-yellow-900/25 bg-neutral-900/50 px-6 py-4 md:px-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-6 rotate-45 border border-yellow-600/70">
              <div className="absolute inset-[4px] bg-yellow-600/80" />
            </div>
            <span className="font-display text-base font-semibold tracking-widest uppercase text-stone-200">Aurum</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden text-xs tracking-widest uppercase text-stone-600 md:block">Dashboard</span>
            <button onClick={handleLogout}
              className="font-mono-custom cursor-pointer border-none bg-transparent p-0 text-xs tracking-widest uppercase text-stone-600 transition-colors duration-150 hover:text-yellow-500/80">
              Sign out
            </button>
          </div>
        </header>

        <main className="relative z-10 mx-auto w-full max-w-2xl px-6 py-12 md:px-0">

          {/* Page header */}
          <div className="animate-fade-up mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs tracking-widest uppercase text-yellow-600/80">Your workspace</span>
              <div className="h-px flex-1 bg-yellow-900/40" />
            </div>
            <h1 className="font-display text-4xl font-light tracking-tight text-stone-100">Tasks</h1>
            <p className="mt-2 text-xs tracking-wide text-stone-600">
              {tasks.length === 0 ? "No tasks yet — add one below." : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} total.`}
            </p>
          </div>

          {/* ── Add task form ── */}
          <div className="animate-fade-up mb-8 rounded-sm border border-stone-800/80 bg-white/[0.02] p-5 [animation-delay:0.06s]">
            <p className="mb-4 text-xs tracking-widest uppercase text-stone-600">New task</p>

            <div className="mb-3 flex gap-2">
              {/* Title */}
              <div className="relative flex-1">
                <input
                  type="text" name="title" placeholder="Task title…"
                  value={form.title} onChange={handleFormChange}
                  onFocus={() => setFocused("title")} onBlur={() => setFocused(null)}
                  onKeyDown={handleKeyDown}
                  className={inputCls("title")}
                />
                <span className="underline-gold" style={{ width: focused === "title" ? "100%" : "0%" }} />
              </div>
              {/* Add button */}
              <button onClick={handleAdd} disabled={!form.title.trim() || adding}
                className="btn-shimmer relative overflow-hidden rounded-sm bg-yellow-600 px-5 py-2.5 text-xs font-medium tracking-widest uppercase text-neutral-950 transition-all duration-200 hover:bg-yellow-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30">
                <span className="relative flex items-center gap-2">
                  {adding && <span className="h-3 w-3 animate-spin rounded-full border border-neutral-900/40 border-t-neutral-900" />}
                  {adding ? "Adding…" : "Add"}
                </span>
              </button>
            </div>

            {/* Description */}
            <div className="relative mb-3">
              <textarea
                name="description" placeholder="Description (optional)…" rows={2}
                value={form.description} onChange={handleFormChange}
                onFocus={() => setFocused("desc")} onBlur={() => setFocused(null)}
                className={`${inputCls("desc")} resize-none`}
              />
              <span className="underline-gold" style={{ width: focused === "desc" ? "100%" : "0%" }} />
            </div>

            <div className="flex gap-3">
              {/* Status */}
              <select name="status" value={form.status} onChange={handleFormChange} className={`${selectCls} flex-1`}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              {/* Due date */}
              <div className="relative flex-1">
                <input
                  type="date" name="dueDate" value={form.dueDate} onChange={handleFormChange}
                  onFocus={() => setFocused("due")} onBlur={() => setFocused(null)}
                  className={`${inputCls("due")} [color-scheme:dark]`}
                />
                <span className="underline-gold" style={{ width: focused === "due" ? "100%" : "0%" }} />
              </div>
            </div>
          </div>

          {/* ── Filter bar ── */}
          <div className="animate-fade-up mb-5 flex items-center gap-2 [animation-delay:0.1s]">
            <span className="text-xs tracking-widest uppercase text-stone-700 mr-1">Filter:</span>
            {["", ...STATUS_OPTIONS].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`font-mono-custom rounded-sm border px-3 py-1.5 text-xs tracking-widest uppercase transition-all duration-150
                  ${filter === s
                    ? "border-yellow-600/50 bg-yellow-950/40 text-yellow-500"
                    : "border-stone-800 bg-transparent text-stone-600 hover:border-stone-700 hover:text-stone-400"}`}>
                {s === "" ? "All" : s}
              </button>
            ))}
          </div>

          {/* ── Task list ── */}
          <div className="flex flex-col gap-2">
            {filteredTasks.length === 0 && (
              <div className="animate-fade-in flex flex-col items-center justify-center rounded-sm border border-dashed border-stone-800 py-16 text-center">
                <div className="relative mb-4 h-10 w-10 rotate-45 border border-yellow-900/50">
                  <div className="absolute inset-[7px] border border-yellow-800/40" />
                </div>
                <p className="font-display text-xl font-light text-stone-600">Nothing here yet</p>
                <p className="mt-1 text-xs tracking-wide text-stone-700">
                  {filter ? `No ${filter} tasks` : "Add your first task above"}
                </p>
              </div>
            )}

            {filteredTasks.map((task, i) => (
              <div key={task._id}
                className={`task-row group rounded-sm border border-stone-800/80 bg-white/[0.02]
                            px-5 py-4 transition-all duration-200
                            hover:border-yellow-900/40 hover:bg-yellow-950/10
                            animate-fade-in
                            ${removing === task._id ? "animate-removing" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}>

                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex items-start gap-4 min-w-0">
                    <span className="mt-0.5 w-5 flex-shrink-0 text-right text-xs text-stone-700 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="mt-1 h-3 w-px flex-shrink-0 bg-stone-800" />
                    <div className="min-w-0">
                      <p className="text-sm tracking-wide text-stone-200 truncate">{task.title}</p>
                      {task.description && (
                        <p className="mt-0.5 text-xs tracking-wide text-stone-600 line-clamp-1">{task.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        {/* Status badge */}
                        <span className={`rounded-sm border px-2 py-0.5 text-[10px] tracking-widest uppercase ${STATUS_STYLES[task.status] || STATUS_STYLES["pending"]}`}>
                          {task.status}
                        </span>
                        {/* Due date */}
                        {task.dueDate && (
                          <span className="text-[10px] tracking-wide text-stone-600">
                            Due {new Date(task.dueDate).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="task-actions flex items-center gap-4 flex-shrink-0">
                    <button onClick={() => openEdit(task)}
                      className="font-mono-custom cursor-pointer border-none bg-transparent p-0 text-xs tracking-widest uppercase text-stone-600 transition-colors duration-150 hover:text-yellow-500/80">
                      Edit
                    </button>
                    <button onClick={() => handleRemove(task._id)}
                      className="font-mono-custom cursor-pointer border-none bg-transparent p-0 text-xs tracking-widest uppercase text-stone-700 transition-colors duration-150 hover:text-red-400/80">
                      Remove
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </main>

        <footer className="relative z-10 mt-16 border-t border-yellow-900/20 px-6 py-5 md:px-10">
          <p className="text-xs tracking-widest uppercase text-stone-800">© 2025 Aurum — All rights reserved</p>
        </footer>

      </div>

      {/* ── Edit modal ── */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingTask(null); }}>
          <div className="animate-modal-in w-full max-w-md rounded-sm border border-stone-800 bg-neutral-900 p-6 shadow-2xl">

            {/* Modal header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs tracking-widest uppercase text-yellow-600/80">Editing task</p>
                <h2 className="font-display text-2xl font-light tracking-tight text-stone-100">Update</h2>
              </div>
              <button onClick={() => setEditingTask(null)}
                className="font-mono-custom cursor-pointer border-none bg-transparent p-0 text-xs tracking-widest uppercase text-stone-600 hover:text-stone-400 transition-colors">
                ✕ Close
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Title */}
              <div className="relative">
                <label className="mb-2 block text-xs tracking-widest uppercase text-stone-600">Title</label>
                <input type="text" name="title" value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  onFocus={() => setFocused("etitle")} onBlur={() => setFocused(null)}
                  className={inputCls("etitle")} />
                <span className="underline-gold" style={{ width: focused === "etitle" ? "100%" : "0%" }} />
              </div>

              {/* Description */}
              <div className="relative">
                <label className="mb-2 block text-xs tracking-widest uppercase text-stone-600">Description</label>
                <textarea rows={3} name="description" value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  onFocus={() => setFocused("edesc")} onBlur={() => setFocused(null)}
                  className={`${inputCls("edesc")} resize-none`} />
                <span className="underline-gold" style={{ width: focused === "edesc" ? "100%" : "0%" }} />
              </div>

              <div className="flex gap-3">
                {/* Status */}
                <div className="flex-1">
                  <label className="mb-2 block text-xs tracking-widest uppercase text-stone-600">Status</label>
                  <select value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className={selectCls}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                {/* Due date */}
                <div className="flex-1">
                  <label className="mb-2 block text-xs tracking-widest uppercase text-stone-600">Due date</label>
                  <div className="relative">
                    <input type="date" value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      onFocus={() => setFocused("edue")} onBlur={() => setFocused(null)}
                      className={`${inputCls("edue")} [color-scheme:dark]`} />
                    <span className="underline-gold" style={{ width: focused === "edue" ? "100%" : "0%" }} />
                  </div>
                </div>
              </div>

              {/* Save */}
              <button onClick={handleSave} disabled={!editForm.title.trim() || saving}
                className="btn-shimmer relative mt-2 overflow-hidden rounded-sm bg-yellow-600 py-3 text-xs font-medium tracking-widest uppercase text-neutral-950 transition-all duration-200 hover:bg-yellow-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40">
                <span className="relative flex items-center justify-center gap-2">
                  {saving && <span className="h-3 w-3 animate-spin rounded-full border border-neutral-900/40 border-t-neutral-900" />}
                  {saving ? "Saving…" : "Save changes"}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
