import { useState } from 'react';
import { Form, Link, useActionData, useNavigation } from 'react-router';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { prisma } from '~/db/client.server';
import { verifyPassword, createUserSession } from '~/services/auth.server';
import { loginSchema } from '~/utils/validation';
export async function action({ request }: any) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  try {
    const validated = loginSchema.parse({ email, password });
    const user = await prisma.user.findUnique({ where: { email: validated.email } });
    if (!user) {
      return { error: 'Invalid Email Or Password' };
    }
    const isValid = await verifyPassword(validated.password, user.password);
    if (!isValid) {
      return { error: 'Invalid Email Or Password' };
    }
    return createUserSession(user.id, '/');
  } catch (error: any) {
    return { error: error.errors?.[0]?.message || 'Invalid Input' };
  }
}
export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign In To Your Account</p>
          </div>
          <Form method="post" className="space-y-6">
            {actionData?.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {actionData.error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't Have An Account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}