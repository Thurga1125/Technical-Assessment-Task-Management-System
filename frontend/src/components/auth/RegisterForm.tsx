import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerSchema, type RegisterFormData } from "../../lib/validations";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

export default function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    try {
      const res = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
      });
      login(res.data.accessToken, res.data.user);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Registration failed. Please try again.";
      setServerError(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email address"
          className={`w-full pl-11 pr-4 py-3.5 text-sm bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          {...register("email")}
        />
        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Password (min 8 chars, 1 uppercase, 1 number)"
          className={`w-full pl-11 pr-4 py-3.5 text-sm bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          {...register("password")}
        />
        {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Confirm password"
          className={`w-full pl-11 pr-4 py-3.5 text-sm bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-200 uppercase tracking-wider text-sm"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating account...
          </span>
        ) : "Sign Up"}
      </button>

      <p className="text-sm text-center text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Sign In
        </Link>
      </p>
    </form>
  );
}
