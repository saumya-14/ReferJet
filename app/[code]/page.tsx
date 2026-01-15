"use client";

import { useState, FormEvent } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-100 p-4">
            <Lock className="h-8 w-8 text-gray-700" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Private Access
        </h1>
        <p className="mb-8 text-center text-sm text-gray-600">
          Enter your access code to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access code"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
              autoFocus
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Access Dashboard"
            )}
          </button>
        </form>

        {/* Security note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Secure authentication • No data stored
        </p>
      </div>
    </div>
  );
}

