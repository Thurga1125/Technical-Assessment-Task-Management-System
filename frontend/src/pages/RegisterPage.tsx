import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/auth/RegisterForm";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) return null;
  if (accessToken) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Blue 3D panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-16 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #5ABBFF 0%, #3FA9FF 45%, #1a88e0 100%)" }}
      >
        {/* 3D depth layers */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(315deg, rgba(255,255,255,0.12) 0%, transparent 50%)" }} />

        {/* Large far circle */}
        <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full"
          style={{ background: "rgba(255,255,255,0.12)", boxShadow: "inset 0 0 60px rgba(255,255,255,0.08)" }} />
        {/* Mid circle */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full"
          style={{ background: "rgba(255,255,255,0.10)", boxShadow: "inset 0 0 40px rgba(255,255,255,0.06)" }} />
        {/* Small near circle */}
        <div className="absolute top-[38%] left-10 w-24 h-24 rounded-full"
          style={{ background: "rgba(255,255,255,0.14)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
        {/* Tiny accent */}
        <div className="absolute top-[18%] right-12 w-10 h-10 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }} />

        {/* 3D content card */}
        <div className="relative z-10 rounded-3xl px-8 py-10"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(2px)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25), 0 20px 60px rgba(0,0,0,0.12)" }}>
          <h2 className="text-5xl font-black text-white mb-5 leading-tight"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>
            Welcome<br />Back!
          </h2>
          <p className="text-white/80 mb-8 text-base leading-relaxed max-w-xs mx-auto">
            Already have an account? Sign in to continue managing your tasks.
          </p>
          <Link to="/login"
            className="inline-block border-2 border-white text-white font-black px-12 py-3.5 rounded-full uppercase tracking-widest text-sm hover:bg-white hover:text-[var(--color-primary)] transition-colors duration-200"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 md:px-16 py-10 bg-white relative">

        {/* Subtle background depth */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(144,213,255,0.08) 0%, transparent 60%)" }} />

        <Link to="/" className="relative flex items-center gap-1.5 text-gray-400 hover:text-[var(--color-primary)] transition-colors w-fit mb-12">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="relative flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="mb-3 p-3 rounded-2xl"
                style={{ boxShadow: "0 8px 32px rgba(63,169,255,0.18), 0 2px 8px rgba(0,0,0,0.06)" }}>
                <img src={logo} alt="TaskFlow" className="w-12 h-12 object-contain" />
              </div>
              <div className="text-[11px] font-black text-[var(--color-primary)] tracking-[0.2em] leading-none">TASK</div>
              <div className="text-[11px] font-black text-gray-900 tracking-[0.2em] leading-none mt-0.5">FLOW</div>
            </div>

            {/* 3D form card */}
            <div className="rounded-2xl p-7"
              style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(63,169,255,0.1), 0 1px 2px rgba(0,0,0,0.04)", border: "1px solid rgba(144,213,255,0.2)" }}>
              <h1 className="text-2xl font-black text-gray-900 text-center mb-1">Create Account</h1>
              <p className="text-gray-400 text-sm text-center mb-6">Fill in your details to get started.</p>
              <RegisterForm />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
