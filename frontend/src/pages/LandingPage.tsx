import { Link } from "react-router-dom";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <ClipboardIcon className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <div className="text-[10px] font-black text-blue-600 tracking-[0.15em]">TASK</div>
              <div className="text-[10px] font-black text-gray-900 tracking-[0.15em]">FLOW</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">How It Works</a>
            <a href="#why" className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">Why TaskFlow</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/register" className="bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50/60 to-white px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 text-xs font-bold px-5 py-2.5 rounded-full mb-10 shadow-sm">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Built for teams & solo achievers
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
            Your Tasks.<br />
            <span className="text-blue-600">Organized. Done.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            TaskFlow is a full-stack task management app that helps you create tasks, set
            priorities, and track your progress — all in one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white font-bold px-9 py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200 text-base"
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

        {/* Mockup */}
        <div className="mt-20 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-blue-100">
          <div className="bg-blue-800 px-5 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-blue-300 text-xs ml-2 font-medium">TaskFlow Dashboard</span>
          </div>
          <div className="bg-blue-700 p-6 grid grid-cols-3 gap-4">
            {[
              { label: "TO DO", dot: "bg-gray-300" },
              { label: "IN PROGRESS", dot: "bg-yellow-400" },
              { label: "DONE", dot: "bg-green-400" },
            ].map(({ label, dot }, i) => (
              <div key={label} className="bg-blue-600/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-white/80 text-xs font-bold tracking-wide">{label}</span>
                </div>
                {[1, 2].map(n => (
                  <div key={n} className="bg-white/10 rounded-lg p-3 mb-2 last:mb-0">
                    <div className="h-2 bg-white/40 rounded mb-2 w-3/4" />
                    <div className="h-1.5 bg-white/20 rounded w-1/2 mb-2" />
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
            <div key={s.label}>
              <div className="text-5xl font-black text-blue-600 mb-2">{s.value}</div>
              <div className="text-gray-400 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3">FEATURES</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Everything you need to stay on track</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Powerful features wrapped in a clean, distraction-free interface.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🗂️", bg: "bg-teal-50", title: "Task Management", desc: "Create, update, and delete tasks with ease. Keep your work neatly organized in one place." },
              { emoji: "📊", bg: "bg-yellow-50", title: "Kanban Board", desc: "View tasks by status: To Do, In Progress, and Done. Filter by priority and stay focused." },
              { emoji: "📈", bg: "bg-purple-50", title: "Progress Tracking", desc: "See live completion percentages and task counts at a glance." },
              { emoji: "⏰", bg: "bg-red-50", title: "Priority & Due Dates", desc: "Assign Low, Medium, High, or Urgent priority. Set due dates so nothing slips through." },
              { emoji: "👤", bg: "bg-green-50", title: "Your Account", desc: "Your workspace, your identity. Only you can access your tasks and data." },
              { emoji: "🔒", bg: "bg-blue-50", title: "Secure Authentication", desc: "JWT-based login keeps your data private. Refresh tokens for seamless sessions." },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className={`w-13 h-13 w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center text-2xl mb-5`}>{f.emoji}</div>
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
          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3">HOW IT WORKS</p>
          <h2 className="text-4xl font-black text-gray-900 mb-16">Up and running in minutes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[calc(33.33%+0.5rem)] right-[calc(33.33%+0.5rem)] h-0.5 bg-blue-100" />
            {[
              { title: "Create an Account", desc: "Sign up in seconds with just your email and password. No credit card required." },
              { title: "Add Your Tasks", desc: "Create tasks with titles, descriptions, priorities, and due dates in moments." },
              { title: "Track & Complete", desc: "Move tasks through statuses and watch your progress grow in real time." },
            ].map((step, i) => (
              <div key={step.title} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-black mb-6 z-10 shadow-lg shadow-blue-200">
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
        <div className="max-w-6xl mx-auto bg-blue-700 rounded-3xl p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-200 font-bold text-xs uppercase tracking-widest mb-4">WHY TASKFLOW?</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">
              Simple enough for one.<br />Powerful enough for projects.
            </h2>
            <p className="text-blue-200 mb-8 leading-relaxed">
              Built as a full-stack application using React, Node.js, and PostgreSQL —
              TaskFlow demonstrates clean architecture, real-time UI updates, and thoughtful UX design.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-white hover:text-blue-700 transition-colors"
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
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon />
                </div>
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-blue-200 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to get things done?</h2>
          <p className="text-gray-400 mb-10 text-lg">Join TaskFlow and start organizing your work the smart way.</p>
          <Link
            to="/register"
            className="bg-blue-600 text-white font-bold px-10 py-5 rounded-2xl hover:bg-blue-700 transition-colors shadow-xl shadow-blue-200 inline-flex items-center gap-2 text-base"
          >
            Create Your Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <ClipboardIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900">TaskFlow</span>
          </div>
          <p className="text-gray-400 text-sm">Built with React, Node.js & PostgreSQL</p>
          <div className="flex gap-6">
            <Link to="/login" className="text-gray-400 hover:text-gray-700 text-sm font-medium">Sign In</Link>
            <Link to="/register" className="text-gray-400 hover:text-gray-700 text-sm font-medium">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
