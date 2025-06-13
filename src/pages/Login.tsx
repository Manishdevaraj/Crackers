//@ts-nocheck

import { Button } from '@/components/ui/button';
import { useFirebase } from '@/Services/context';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/Services/Firebase.config';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, gooleSignIn,user } = useFirebase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if(user)
  {
    navigate('/');
  }
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleForgotPassword = async () => {
    if (!email) return alert('Please enter your email to reset password.');
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert('Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>

        {/* Google Sign In */}
        <button
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition cursor-pointer"
          onClick={gooleSignIn}
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>

        <div className="flex items-center gap-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Email and Password Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
            <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </button>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <Button type="submit" className="bg-green-400 cursor-pointer hover:bg-green-300">
              Login
            </Button>
            <p className="cursor-pointer text-sm text-gray-600 hover:underline" onClick={() => navigate('/register')}>
              Sign Up?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
