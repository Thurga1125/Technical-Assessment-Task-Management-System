import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) return null;
  if (accessToken) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 md:px-16 py-10 bg-white">
        <Link to="/" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors w-fit mb-12">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-200">
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-[11px] font-black text-blue-600 tracking-[0.2em] leading-none">TASK</div>
              <div className="text-[11px] font-black text-gray-900 tracking-[0.2em] leading-none mt-0.5">FLOW</div>
            </div>

            <h1 className="text-3xl font-black text-gray-900 text-center mb-1">Create Account</h1>
            <p className="text-gray-400 text-sm text-center mb-8">Fill in your details to get started.</p>

            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Right — Blue panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col items-center justify-center px-16 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-600 rounded-full opacity-50" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-800 rounded-full opacity-60" />

        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white mb-5 leading-tight">Welcome<br />Back!</h2>
          <p className="text-blue-200 mb-10 text-base leading-relaxed max-w-xs">
            To keep connected with us please login with your personal info.
          </p>
          <Link
            to="/login"
            className="border-2 border-white text-white font-black px-12 py-3.5 rounded-full hover:bg-white hover:text-blue-700 transition-colors uppercase tracking-widest text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
