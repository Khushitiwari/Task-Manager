

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks, addTask, removeTask } = useTasks();

  const [input,   setInput]   = useState("");
  const [focused, setFocused] = useState(false);
  const [removing, setRemoving] = useState(null);

  const handleAdd = async () => {
    const title = input.trim();
    if (!title) return;
    await addTask({ title });
    setInput("");
  };

  const handleRemove = async (id) => {
    setRemoving(id);
    await removeTask(id);
    setRemoving(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&display=swap');

        .font-display     { font-family: 'Cormorant Garamond', serif; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(28px, 18px) scale(1.05); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateX(0); max-height: 80px; }
          to   { opacity: 0; transform: translateX(12px); max-height: 0; padding: 0; margin: 0; }
        }

        .animate-fade-up      { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-fade-in      { animation: fadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-drift        { animation: drift 11s ease-in-out infinite alternate; }
        .animate-drift-delay  { animation: drift 11s ease-in-out infinite alternate; animation-delay: -4s; }
        .animate-removing     { animation: fadeOut 0.3s ease forwards; }

        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-100%);
        }
        .btn-shimmer:hover::after { animation: shimmer 0.55s ease forwards; }

        .underline-gold {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          background: #b8955a;
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        .task-row:hover .task-delete { opacity: 1; }
        .task-delete { opacity: 0; transition: opacity 0.2s; }
      `}</style>

      <div className="font-mono-custom relative min-h-screen overflow-x-hidden bg-neutral-950">

        {/* Ambient blobs */}
        <div className="animate-drift pointer-events-none fixed -top-40 -right-20 h-96 w-96
                        rounded-full opacity-10 blur-3xl
                        bg-gradient-to-br from-yellow-600 to-transparent" />
        <div className="animate-drift-delay pointer-events-none fixed -bottom-24 -left-16 h-72 w-72
                        rounded-full opacity-10 blur-3xl
                        bg-gradient-to-tr from-yellow-800 to-transparent" />

        {/* ── Top nav ── */}
        <header className="relative z-10 flex items-center justify-between
                           border-b border-yellow-900/25 bg-neutral-900/50
                           px-6 py-4 md:px-10 backdrop-blur-sm">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-6 rotate-45 border border-yellow-600/70">
              <div className="absolute inset-[4px] bg-yellow-600/80" />
            </div>
            <span className="font-display text-base font-semibold tracking-widest uppercase text-stone-200">
              Aurum
            </span>
          </div>

          {/* Right nav actions */}
          <div className="flex items-center gap-6">
            <span className="hidden text-xs tracking-widest uppercase text-stone-600 md:block">
              Dashboard
            </span>
            <button
              onClick={() => navigate("/login")}
              className="font-mono-custom cursor-pointer border-none bg-transparent p-0
                         text-xs tracking-widest uppercase text-stone-600
                         transition-colors duration-150 hover:text-yellow-500/80"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="relative z-10 mx-auto w-full max-w-2xl px-6 py-12 md:px-0">

          {/* Page header */}
          <div className="animate-fade-up mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs tracking-widest uppercase text-yellow-600/80">
                Your workspace
              </span>
              <div className="h-px flex-1 bg-yellow-900/40" />
            </div>
            <h1 className="font-display text-4xl font-light tracking-tight text-stone-100">
              Tasks
            </h1>
            <p className="mt-2 text-xs tracking-wide text-stone-600">
              {tasks.length === 0
                ? "No tasks yet — add one below."
                : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} in your list.`}
            </p>
          </div>

          {/* ── Add task input ── */}
          <div className="animate-fade-up mb-8 [animation-delay:0.08s]">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Add a new task…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKey}
                  className={`font-mono-custom w-full rounded-sm border px-4 py-3
                              text-sm tracking-wide text-stone-200
                              placeholder:text-stone-700 outline-none
                              transition-all duration-200
                              ${focused
                                ? "border-yellow-600/50 bg-yellow-950/30 shadow-[0_0_0_3px_rgba(161,98,7,0.08)]"
                                : "border-stone-800 bg-white/[0.02] hover:border-stone-700"
                              }`}
                />
                <span
                  className="underline-gold"
                  style={{ width: focused ? "100%" : "0%" }}
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={!input.trim()}
                className="btn-shimmer relative overflow-hidden rounded-sm
                           bg-yellow-600 px-5 py-3
                           text-xs font-medium tracking-widest uppercase text-neutral-950
                           transition-all duration-200
                           hover:bg-yellow-500 active:scale-[0.98]
                           disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="relative">Add</span>
              </button>
            </div>
            <p className="mt-2 text-[10px] tracking-wide text-stone-700">
              Press <kbd className="rounded border border-stone-800 bg-stone-900 px-1 py-0.5 text-stone-600">↵ Enter</kbd> to add quickly
            </p>
          </div>

          {/* ── Task list ── */}
          <div className="flex flex-col gap-2">
            {tasks.length === 0 && (
              <div className="animate-fade-in flex flex-col items-center justify-center
                              rounded-sm border border-dashed border-stone-800
                              py-16 text-center">
                <div className="relative mb-4 h-10 w-10 rotate-45 border border-yellow-900/50">
                  <div className="absolute inset-[7px] border border-yellow-800/40" />
                </div>
                <p className="font-display text-xl font-light text-stone-600">Nothing here yet</p>
                <p className="mt-1 text-xs tracking-wide text-stone-700">Add your first task above</p>
              </div>
            )}

            {tasks.map((task, i) => (
              <div
                key={task._id}
                className={`task-row group flex items-center justify-between
                            rounded-sm border border-stone-800/80 bg-white/[0.02]
                            px-5 py-4 transition-all duration-200
                            hover:border-yellow-900/40 hover:bg-yellow-950/10
                            animate-fade-in
                            ${removing === task._id ? "animate-removing" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Left — index + title */}
                <div className="flex items-center gap-4">
                  <span className="w-5 text-right text-xs text-stone-700 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-3 w-px bg-stone-800" />
                  <p className="text-sm tracking-wide text-stone-300">
                    {task.title}
                  </p>
                </div>

                {/* Right — delete */}
                <button
                  onClick={() => handleRemove(task._id)}
                  className="task-delete font-mono-custom cursor-pointer border-none
                             bg-transparent p-0 text-xs tracking-widest uppercase
                             text-stone-700 transition-colors duration-150
                             hover:text-red-400/80"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

        </main>

        {/* ── Footer ── */}
        <footer className="relative z-10 mt-16 border-t border-yellow-900/20 px-6 py-5 md:px-10">
          <p className="text-xs tracking-widest uppercase text-stone-800">
            © 2025 Aurum — All rights reserved
          </p>
        </footer>

      </div>
    </>
  );
}
