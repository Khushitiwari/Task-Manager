
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordUser } from "../api/authApi";

export default function ResetPassword() {
  const navigate       = useNavigate();
  const { token }      = useParams();

  const [form,    setForm]    = useState({ password: "", confirm: "" });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (form.password !== form.confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await resetPasswordUser(token, { password: form.password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Token is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (name) =>
    `font-mono-custom w-full rounded-sm border px-4 py-3 text-sm tracking-wide
     text-stone-200 placeholder:text-stone-700 outline-none transition-all duration-200
     ${focused === name
       ? "border-yellow-600/50 bg-yellow-950/30 shadow-[0_0_0_3px_rgba(161,98,7,0.08)]"
       : "border-stone-800 bg-white/[0.02] hover:border-stone-700"}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&display=swap');

        .font-display     { font-family: 'Cormorant Garamond', serif; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes drift   { from { transform:translate(0,0) scale(1) }     to { transform:translate(28px,18px) scale(1.05) } }
        @keyframes shimmer { from { transform:translateX(-100%) }           to { transform:translateX(100%) } }

        .animate-fade-up     { animation: fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-drift       { animation: drift 11s ease-in-out infinite alternate; }
        .animate-drift-delay { animation: drift 11s ease-in-out infinite alternate; animation-delay:-4s; }

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
      `}</style>

      <div className="font-mono-custom relative flex min-h-screen overflow-hidden bg-neutral-950">

        {/* Blobs */}
        <div className="animate-drift pointer-events-none fixed -top-40 -right-20 h-96 w-96 rounded-full opacity-10 blur-3xl bg-gradient-to-br from-yellow-600 to-transparent" />
        <div className="animate-drift-delay pointer-events-none fixed -bottom-24 -left-16 h-72 w-72 rounded-full opacity-10 blur-3xl bg-gradient-to-tr from-yellow-800 to-transparent" />

        {/* Left panel */}
        <aside className="relative hidden md:flex w-5/12 flex-shrink-0 flex-col justify-between overflow-hidden border-r border-yellow-900/30 bg-neutral-900/60 px-12 py-14">
          <div className="pointer-events-none absolute inset-0"
               style={{ backgroundImage: "repeating-linear-gradient(-45deg,transparent,transparent 38px,rgba(180,140,80,0.04) 38px,rgba(180,140,80,0.04) 39px)" }} />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative h-7 w-7 rotate-45 border border-yellow-600/70">
              <div className="absolute inset-[5px] bg-yellow-600/80" />
            </div>
            <span className="font-display text-lg font-semibold tracking-widest uppercase text-stone-200">Aurum</span>
          </div>

          {/* Copy */}
          <div className="relative z-10">
            <h1 className="font-display mb-5 text-5xl font-light leading-tight tracking-tight text-stone-100">
              Choose a<br />
              <em className="not-italic text-yellow-500/90">strong</em><br />
              new password.
            </h1>
            <p className="max-w-xs text-xs leading-relaxed tracking-wide text-stone-500">
              Pick something secure — at least 6 characters. You won't need to do this again for a while.
            </p>
          </div>

          <p className="relative z-10 text-xs tracking-widest uppercase text-stone-700">© 2025 Aurum</p>
        </aside>

        {/* Form area */}
        <main className="flex flex-1 items-center justify-center px-6 py-16 md:px-14">
          <div className="animate-fade-up w-full max-w-sm">

            {/* Header */}
            <div className="mb-10">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xs tracking-widest uppercase text-yellow-600/80">Account recovery</span>
                <div className="h-px flex-1 bg-yellow-900/40" />
              </div>
              <h2 className="font-display text-4xl font-light tracking-tight text-stone-100">
                New password
              </h2>
            </div>

            {/* Success state */}
            {done ? (
              <div className="rounded-sm border border-emerald-800/50 bg-emerald-950/20 px-5 py-6 text-center">
                <div className="relative mx-auto mb-4 h-10 w-10 rotate-45 border border-emerald-700/50">
                  <div className="absolute inset-[7px] bg-emerald-600/30" />
                </div>
                <p className="mb-1 text-sm tracking-wide text-emerald-400/90">Password updated</p>
                <p className="text-xs tracking-wide text-stone-600">
                  Your password has been reset successfully.
                </p>
                <button onClick={() => navigate("/login")}
                  className="font-mono-custom mt-6 cursor-pointer border-none bg-transparent p-0 text-xs tracking-widest uppercase text-yellow-600/80 underline underline-offset-2 decoration-yellow-800 transition-colors hover:text-yellow-500">
                  Sign in now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Error */}
                {error && (
                  <div className="mb-5 rounded-sm border border-red-900/50 bg-red-950/20 px-4 py-3">
                    <p className="text-xs tracking-wide text-red-400/80">{error}</p>
                  </div>
                )}

                <div className="mb-8 flex flex-col gap-5">
                  {/* New password */}
                  <div>
                    <label htmlFor="password"
                      className={`mb-2 block text-xs tracking-widest uppercase transition-colors duration-200
                                  ${focused === "password" ? "text-yellow-500" : "text-stone-600"}`}>
                      New password
                    </label>
                    <div className="relative">
                      <input id="password" type="password" placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                        required className={inputCls("password")} autoComplete="new-password" />
                      <span className="underline-gold" style={{ width: focused === "password" ? "100%" : "0%" }} />
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label htmlFor="confirm"
                      className={`mb-2 block text-xs tracking-widest uppercase transition-colors duration-200
                                  ${focused === "confirm" ? "text-yellow-500" : "text-stone-600"}`}>
                      Confirm password
                    </label>
                    <div className="relative">
                      <input id="confirm" type="password" placeholder="Repeat your password"
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)}
                        required className={inputCls("confirm")} autoComplete="new-password" />
                      <span className="underline-gold" style={{ width: focused === "confirm" ? "100%" : "0%" }} />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="btn-shimmer relative mb-6 w-full overflow-hidden rounded-sm bg-yellow-600 py-3.5 text-xs font-medium tracking-widest uppercase text-neutral-950 transition-all duration-200 hover:bg-yellow-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40">
                  <span className="relative flex items-center justify-center gap-2">
                    {loading && <span className="h-3 w-3 animate-spin rounded-full border border-neutral-900/40 border-t-neutral-900" />}
                    {loading ? "Resetting…" : "Reset password"}
                  </span>
                </button>
              </form>
            )}

            {/* Back link */}
            {!done && (
              <p className="text-center text-xs tracking-wide text-stone-600">
                Changed your mind?{" "}
                <button onClick={() => navigate("/login")}
                  className="font-mono-custom cursor-pointer border-none bg-transparent p-0 text-xs tracking-wide text-yellow-600/80 underline underline-offset-2 decoration-yellow-800 transition-colors hover:text-yellow-500 hover:decoration-yellow-500">
                  Back to sign in
                </button>
              </p>
            )}

          </div>
        </main>
      </div>
    </>
  );
}