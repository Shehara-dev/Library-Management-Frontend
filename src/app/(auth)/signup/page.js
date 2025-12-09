'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 1. Imports for shadcn form & validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// 2. Define Validation Schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
  role: z.string().default("USER"), // Default role
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Error will appear under confirmPassword field
});

export default function SignupPage() {
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  // 3. Initialize Form Hook
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    },
  });

  // 4. Handle Submit
  const onSubmit = async (values) => {
    setGlobalError('');
    setLoading(true);

    try {
      const result = await signup({
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setGlobalError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setGlobalError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">Create Account</h1>
          <p className="text-gray-600 text-sm">
            Join our library system and start your reading journey
          </p>
        </div>

        {/* 5. Shadcn Form Wrapper */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm text-center shadow-sm">
                 Account created successfully! Redirecting...
              </div>
            )}

            {/* Error Message */}
            {globalError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm text-center shadow-sm">
                {globalError}
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="At least 6 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Repeat password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-2.5 bg-primary-800 hover:bg-primary-700 shadow-md"
              disabled={loading || success}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p className="mt-3">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign in
                </Link>
              </p>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}