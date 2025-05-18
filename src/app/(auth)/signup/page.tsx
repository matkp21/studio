'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSigningUp(true);

    // Simulate sign-up process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Assuming sign-up is successful for this example
    setSignupSuccess(true);

    // Simulate gradient animation and then redirect
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Duration of gradient animation
    router.push('/dashboard'); // Redirect to dashboard or appropriate page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <AnimatePresence>
        {signupSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 z-10"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: signupSuccess ? 0 : 1, y: signupSuccess ? -50 : 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm z-20"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <HeartPulse size={48} className="text-blue-600" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSigningUp}
            >
              {isSigningUp ? 'Signing Up...' : 'Sign Up'}
            </button>
            <button
              type="button"
              className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
              onClick={() => router.push('/login')}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUpPage;