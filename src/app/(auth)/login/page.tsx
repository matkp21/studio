"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a login process
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      // In a real application, you would verify credentials here
      // If successful, redirect after the animation
      setTimeout(() => {
        router.push("/dashboard"); // Replace with your actual dashboard route
      }, 1500); // Wait for the gradient animation
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative overflow-hidden">
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 origin-bottom"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white p-8 rounded-lg shadow-md w-full max-w-sm z-10 ${
          loginSuccess ? "hidden" : ""
        }`}
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-blue-500 mb-2"
          >
            <HeartHandshake size={48} />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging In..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;