"use client";

import { useState, FormEvent } from "react";
import { Lock, Loader2, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Login page at /<secret-path>
 * 
 * Security notes:
 * - Secret path comes from PRIVATE_ENTRY_PATH env variable
 * - Password is never exposed in URL or frontend code
 * - Password is sent via POST to /api/login
 * - Server handles all authentication logic
 */
export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Trim password before sending
      const trimmedPassword = password.trim();

      if (!trimmedPassword) {
        setError("Please enter an access code");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in request
        body: JSON.stringify({ password: trimmedPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid password");
        setIsLoading(false);
        return;
      }

      // Success - wait a moment for cookie to be set, then redirect
      console.log("✅ Login successful, redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] font-sans text-slate-900">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30"
            >
              <Lock className="h-7 w-7 text-white" />
            </motion.div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
              Private Access
            </h1>
            <p className="text-sm text-slate-500">
              Enter your secure access code to continue to the dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Access Code
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3.5 pr-12 text-slate-900 placeholder-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-4 ${error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                    }`}
                  required
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                      <span className="block h-1.5 w-1.5 rounded-full bg-red-600" />
                    </div>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-slate-900/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure End-to-End Encryption</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
