import { Form, Link, useActionData, useNavigation } from 'react-router';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { prisma } from '~/db/client.server';
import { hashPassword, createUserSession } from '~/services/auth.server';
import { signupSchema } from '~/utils/validation';
export async function action({ request }: any) {
  const formData = await request.formData();
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const displayName = formData.get('displayName');
  try {
    const validated = signupSchema.parse({ username, email, password, displayName });
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { username: validated.username }
        ]
      }
    });
    if (existingUser) {
      return { error: 'Email Or Username Already Exists' };
    }
    const hashedPassword = await hashPassword(validated.password);
    const user = await prisma.user.create({
      data: {
        username: validated.username,
        email: validated.email,
        password: hashedPassword,
        displayName: validated.displayName
      }
    });
    return createUserSession(user.id, '/');
  } catch (error: any) {
    return { error: error.errors?.[0]?.message || 'Invalid Input' };
  }
}
export default function Signup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join FakePen</h1>
            <p className="text-gray-600 dark:text-gray-400">Create Your Account</p>
          </div>
          <Form method="post" className="space-y-5">
            {actionData?.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {actionData.error}
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="johndoe"
              />
            </div>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                required
                placeholder="John Doe"
              />
            </div>
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
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already Have An Account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}