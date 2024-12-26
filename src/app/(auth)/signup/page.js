"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl">
        <div>
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Create Account
          </h2>
          <p className="text-gray-400 text-center">
            Join us on Fintech Calgary
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/25"
          >
            Sign Up
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800/50 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200"
        >
          <FcGoogle className="w-5 h-5" />
          Sign up with Google
        </button>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
