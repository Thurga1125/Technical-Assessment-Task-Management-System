import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const FeatureIconBase = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const TaskManagementIcon = ({ className }: { className?: string }) => (
  <FeatureIconBase className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18" />
    <path d="M8 4v16" />
  </FeatureIconBase>
);

const KanbanIcon = ({ className }: { className?: string }) => (
  <FeatureIconBase className={className}>
    <rect x="4" y="5" width="5" height="14" rx="1.5" />
    <rect x="10.5" y="5" width="4.5" height="9" rx="1.5" />
    <rect x="16.5" y="5" width="3.5" height="6" rx="1.5" />
  </FeatureIconBase>
);

const ProgressIcon = ({ className }: { className?: string }) => (
  <FeatureIconBase className={className}>
    <path d="M5 17l4-4 3 3 7-8" />
    <path d="M19 8v4h-4" />
  </FeatureIconBase>
);

const DueDateIcon = ({ className }: { className?: string }) => (
  <FeatureIconBase className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </FeatureIconBase>
);

const AccountIcon = ({ className }: { className?: string }) => (
  <FeatureIconBase className={className}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19a7 7 0 0114 0" />
  </FeatureIconBase>
);

const SecureAuthIcon = ({ className }: { className?: string }) => (
  <FeatureIconBase className={className}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3z" />
    <path d="M9.5 12l1.75 1.75L14.5 10.5" />
  </FeatureIconBase>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="TaskFlow"
              className="w-9 h-9 object-contain"
            />
            <div className="leading-none">
              <div className="text-[10px] font-black text-[var(--color-primary)] tracking-[0.15em]">TASK</div>
              <div className="text-[10px] font-black text-gray-900 tracking-[0.15em]">FLOW</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium">How It Works</a>
            <a href="#why" className="text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium">Why TaskFlow</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-[var(--color-primary)] transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-3d bg-[var(--color-primary)] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #EBF7FF 0%, #f0f9ff 40%, #ffffff 100%)" }}
      >
        {/* 3D floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-orb absolute top-16 left-[8%] w-72 h-72 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #90D5FF 0%, transparent 70%)" }} />
          <div className="animate-orb-2 absolute top-32 right-[6%] w-56 h-56 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #3FA9FF 0%, transparent 70%)" }} />
          <div className="animate-orb absolute bottom-10 left-[40%] w-40 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #90D5FF 0%, transparent 70%)" }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(#3FA9FF 1px, transparent 1px), linear-gradient(90deg, #3FA9FF 1px, transparent 1px)",
              backgroundSize: "48px 48px"
            }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Logo hero badge */}
          <div className="flex justify-center mb-8">
            <div className="animate-float-slow w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, #BDEAFF, #3FA9FF)",
                boxShadow: "0 20px 60px rgba(63,169,255,0.45), inset 0 2px 8px rgba(255,255,255,0.5)"
              }}
            >
              <img src={logo} alt="TaskFlow" className="w-14 h-14 object-contain" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-white border border-[color:rgba(144,213,255,0.45)] text-[var(--color-primary)] text-xs font-bold px-5 py-2.5 rounded-full mb-10 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
            Built for teams &amp; solo achievers
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Your Tasks.<br />
            <span className="text-[var(--color-primary)]" style={{ textShadow: "0 4px 18px rgba(63,169,255,0.3)" }}>
              Organized. Done.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            TaskFlow is a full-stack task management app that helps you create tasks, set
            priorities, and track your progress — all in one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-3d bg-[var(--color-primary)] text-white font-bold px-9 py-4 rounded-2xl transition-all text-base"
            >
              Start for Free →
            </Link>
            <Link
              to="/login"
              className="border-2 border-gray-900 text-gray-900 font-bold px-9 py-4 rounded-2xl hover:bg-gray-50 transition-colors text-base"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* 3D Mockup */}
        <div className="mockup-3d mt-20 max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[color:rgba(144,213,255,0.6)]"
          style={{ boxShadow: "0 40px 80px rgba(63,169,255,0.3), 0 8px 24px rgba(0,0,0,0.1)" }}
        >
          <div className="bg-[var(--color-primary)] px-5 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-white/85 text-xs ml-2 font-medium">TaskFlow Dashboard</span>
          </div>
          <div className="bg-[var(--color-primary-soft)]/70 p-6 grid grid-cols-3 gap-4">
            {[
              { label: "TO DO", dot: "bg-gray-300" },
              { label: "IN PROGRESS", dot: "bg-yellow-400" },
              { label: "DONE", dot: "bg-green-400" },
            ].map(({ label, dot }, i) => (
              <div key={label} className="bg-white/55 rounded-xl p-4 backdrop-blur-sm"
                style={{ boxShadow: "0 4px 16px rgba(63,169,255,0.15), inset 0 1px 2px rgba(255,255,255,0.8)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-slate-700/80 text-xs font-bold tracking-wide">{label}</span>
                </div>
                {[1, 2].map(n => (
                  <div key={n} className="bg-white/75 rounded-lg p-3 mb-2 last:mb-0"
                    style={{ boxShadow: "0 2px 8px rgba(63,169,255,0.1)" }}
                  >
                    <div className="h-2 bg-[var(--color-primary-soft)]/70 rounded mb-2 w-3/4" />
                    <div className="h-1.5 bg-[var(--color-primary-soft)]/45 rounded w-1/2 mb-2" />
                    <div className={`h-1.5 rounded-full w-10 ${i === 0 ? "bg-red-400/60" : i === 1 ? "bg-yellow-400/60" : "bg-green-400/60"}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "3", label: "Task Statuses" },
            { value: "∞", label: "Tasks You Can Create" },
            { value: "100%", label: "Secure & Private" },
          ].map(s => (
            <div key={s.label}
              className="rounded-2xl py-6 px-4 transition-transform hover:-translate-y-1"
              style={{ boxShadow: "0 4px 24px rgba(63,169,255,0.1)" }}
            >
              <div className="text-5xl font-black text-[var(--color-primary)] mb-2"
                style={{ textShadow: "0 2px 12px rgba(63,169,255,0.3)" }}
              >{s.value}</div>
              <div className="text-gray-400 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6" style={{ background: "linear-gradient(180deg, #F8FCFF 0%, #ffffff 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-3">FEATURES</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Everything you need to stay on track</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Powerful features wrapped in a clean, distraction-free interface.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TaskManagementIcon, title: "Task Management", desc: "Create, update, and delete tasks with ease. Keep your work neatly organized in one place." },
              { icon: KanbanIcon, title: "Kanban Board", desc: "View tasks by status: To Do, In Progress, and Done. Filter by priority and stay focused." },
              { icon: ProgressIcon, title: "Progress Tracking", desc: "See live completion percentages and task counts at a glance." },
              { icon: DueDateIcon, title: "Priority & Due Dates", desc: "Assign Low, Medium, High, or Urgent priority. Set due dates so nothing slips through." },
              { icon: AccountIcon, title: "Your Account", desc: "Your workspace, your identity. Only you can access your tasks and data." },
              { icon: SecureAuthIcon, title: "Secure Authentication", desc: "JWT-based login keeps your data private. Refresh tokens for seamless sessions." },
            ].map(f => (
              <div key={f.title} className="card-3d bg-white rounded-2xl p-7 border border-gray-100">
                <div className="icon-glow w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "linear-gradient(135deg, #EBF7FF, #C8ECFF)", color: "var(--color-primary)" }}
                >
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-3">HOW IT WORKS</p>
          <h2 className="text-4xl font-black text-gray-900 mb-16">Up and running in minutes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33.33%+0.5rem)] right-[calc(33.33%+0.5rem)] h-0.5"
              style={{ background: "linear-gradient(90deg, #90D5FF, #3FA9FF, #90D5FF)" }} />
            {[
              { title: "Create an Account", desc: "Sign up in seconds with just your email and password. No credit card required." },
              { title: "Add Your Tasks", desc: "Create tasks with titles, descriptions, priorities, and due dates in moments." },
              { title: "Track & Complete", desc: "Move tasks through statuses and watch your progress grow in real time." },
            ].map((step, i) => (
              <div key={step.title} className="flex flex-col items-center group">
                <div className="sphere-3d w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-black mb-6 z-10
                  transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-20 px-6">
        <div className="card-why-3d max-w-6xl mx-auto bg-[var(--color-primary)] rounded-3xl p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-white/75 font-bold text-xs uppercase tracking-widest mb-4">WHY TASKFLOW?</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
              Simple enough for one.<br />Powerful enough for projects.
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Built as a full-stack application using React, Node.js, and PostgreSQL —
              TaskFlow demonstrates clean architecture, real-time UI updates, and thoughtful UX design.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-7 py-3.5 rounded-2xl
                hover:bg-white hover:text-[var(--color-primary)] transition-all
                hover:shadow-[0_8px_24px_rgba(255,255,255,0.4)] hover:-translate-y-1"
            >
              Get Started Free →
            </Link>
          </div>

          <div className="space-y-5">
            {[
              { title: "Clean Kanban Interface", desc: "Intuitive columns with status filters to keep you focused." },
              { title: "Real-time Progress Dashboard", desc: "See task counts and completion rates across all your tasks." },
              { title: "Secure JWT Authentication", desc: "Token-based auth keeps your data private and protected." },
              { title: "Fully Responsive", desc: "Works seamlessly on desktop, tablet, and mobile devices." },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 group">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.22)", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.1)" }}
                >
                  <CheckIcon />
                </div>
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-white/80 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: "linear-gradient(180deg, #F8FCFF 0%, #EBF7FF 100%)" }}>
        <div className="max-w-2xl mx-auto">
          {/* Small logo in CTA */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="TaskFlow" className="w-16 h-16 object-contain animate-float" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to get things done?</h2>
          <p className="text-gray-400 mb-10 text-lg">Join TaskFlow and start organizing your work the smart way.</p>
          <Link
            to="/register"
            className="btn-3d bg-[var(--color-primary)] text-white font-bold px-10 py-5 rounded-2xl inline-flex items-center gap-2 text-base transition-all"
          >
            Create Your Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="TaskFlow" className="w-7 h-7 object-contain" />
            <span className="font-black text-gray-900">TaskFlow</span>
          </div>
          <p className="text-gray-400 text-sm">Built with React, Node.js &amp; PostgreSQL</p>
          <div className="flex gap-6">
            <Link to="/login" className="text-gray-400 hover:text-[var(--color-primary)] text-sm font-medium transition-colors">Sign In</Link>
            <Link to="/register" className="text-gray-400 hover:text-[var(--color-primary)] text-sm font-medium transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
