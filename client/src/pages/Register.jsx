import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const FIELDS = [
  { name: "name",     type: "text",     label: "Full Name", placeholder: "John Doe"        },
  { name: "email",    type: "email",    label: "Email",     placeholder: "you@example.com" },
  { name: "password", type: "password", label: "Password",  placeholder: "••••••••••"      },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await register(form)) navigate("/login");
  };

  return (
    <>
      {/* Font import + custom keyframes only (no layout/color styles here) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
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

        .animate-fade-up  { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-drift    { animation: drift 11s ease-in-out infinite alternate; }
        .animate-drift-delay { animation: drift 11s ease-in-out infinite alternate; animation-delay: -4s; }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateX(-100%);
          transition: none;
        }
        .btn-shimmer:hover::after { animation: shimmer 0.55s ease forwards; }

        .underline-gold {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          background: #b8955a;
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
      `}</style>

      <div className="font-mono-custom relative flex min-h-screen overflow-hidden bg-neutral-950">

        {/* Ambient blobs */}
        <div className="animate-drift pointer-events-none fixed -top-40 -right-20 h-96 w-96
                        rounded-full opacity-10 blur-3xl
                        bg-gradient-to-br from-yellow-600 to-transparent" />
        <div className="animate-drift-delay pointer-events-none fixed -bottom-24 -left-16 h-72 w-72
                        rounded-full opacity-10 blur-3xl
                        bg-gradient-to-tr from-yellow-800 to-transparent" />

        {/* ── Left panel ── */}
        <aside className="relative hidden md:flex w-5/12 flex-shrink-0 flex-col
                          justify-between overflow-hidden
                          border-r border-yellow-900/30 bg-neutral-900/60 px-12 py-14">
          {/* Stripe texture */}
          <div className="pointer-events-none absolute inset-0"
               style={{ backgroundImage: "repeating-linear-gradient(-45deg,transparent,transparent 38px,rgba(180,140,80,0.04) 38px,rgba(180,140,80,0.04) 39px)" }} />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative h-7 w-7 rotate-45 border border-yellow-600/70">
              <div className="absolute inset-[5px] bg-yellow-600/80" />
            </div>
            <span className="font-display text-lg font-semibold tracking-widest uppercase text-stone-200">
              Aurum
            </span>
          </div>

          {/* Headline */}
          <div className="relative z-10">
            <h1 className="font-display mb-5 text-5xl font-light leading-tight tracking-tight text-stone-100">
              Begin your<br />
              <em className="not-italic text-yellow-500/90">journey</em><br />
              with us.
            </h1>
            <p className="max-w-xs text-xs leading-relaxed tracking-wide text-stone-500">
              Create an account and manage your task efficiently with in deadlines.
            </p>
          </div>

          {/* Panel footer */}
          <p className="relative z-10 text-xs tracking-widest uppercase text-stone-700">
            © 2025 Aurum
          </p>
        </aside>

        {/* ── Form area ── */}
        <main className="flex flex-1 items-center justify-center px-6 py-16 md:px-14">
          <div className="animate-fade-up w-full max-w-sm">

            {/* Header */}
            <div className="mb-10">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xs tracking-widest uppercase text-yellow-600/80">
                  New account
                </span>
                <div className="h-px flex-1 bg-yellow-900/40" />
              </div>
              <h2 className="font-display text-4xl font-light tracking-tight text-stone-100">
                Register
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Fields */}
              <div className="mb-8 flex flex-col gap-5">
                {FIELDS.map(({ name, type, label, placeholder }) => {
                  const active = focused === name;
                  return (
                    <div key={name}>
                      <label
                        htmlFor={name}
                        className={`mb-2 block text-xs tracking-widest uppercase
                                    transition-colors duration-200
                                    ${active ? "text-yellow-500" : "text-stone-600"}`}
                      >
                        {label}
                      </label>

                      <div className="relative">
                        <input
                          id={name}
                          type={type}
                          name={name}
                          placeholder={placeholder}
                          value={form[name]}
                          onChange={handleChange}
                          onFocus={() => setFocused(name)}
                          onBlur={() => setFocused(null)}
                          required
                          autoComplete={name === "password" ? "new-password" : name}
                          className={`font-mono-custom w-full rounded-sm border px-4 py-3
                                      text-sm tracking-wide text-stone-200
                                      placeholder:text-stone-700 outline-none
                                      transition-all duration-200
                                      ${active
                                        ? "border-yellow-600/50 bg-yellow-950/30 shadow-[0_0_0_3px_rgba(161,98,7,0.08)]"
                                        : "border-stone-800 bg-white/[0.02] hover:border-stone-700"
                                      }`}
                        />
                        {/* Animated gold underline */}
                        <span
                          className="underline-gold"
                          style={{ width: active ? "100%" : "0%" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-shimmer relative mb-6 w-full overflow-hidden rounded-sm
                           bg-yellow-600 py-3.5
                           text-xs font-medium tracking-widest uppercase text-neutral-950
                           transition-all duration-200
                           hover:bg-yellow-500 active:scale-[0.99]
                           disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading && (
                    <span className="h-3 w-3 animate-spin rounded-full
                                     border border-neutral-900/40 border-t-neutral-900" />
                  )}
                  {loading ? "Creating account…" : "Create account"}
                </span>
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-xs tracking-wide text-stone-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-mono-custom cursor-pointer border-none bg-transparent p-0
                           text-xs tracking-wide text-yellow-600/80
                           underline underline-offset-2 decoration-yellow-800
                           transition-colors duration-150
                           hover:text-yellow-500 hover:decoration-yellow-500"
              >
                Sign in
              </button>
            </p>

          </div>
        </main>
      </div>
    </>
  );
}
