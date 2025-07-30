import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { useAuth } from '../../features/auth/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(v) => {
            const e: Record<string, string> = {};
            if (!v.email) e.email = 'Email is required';
            if (!v.password) e.password = 'Password is required';
            return e;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await login(values);
              toast.success('Welcome back!');
              const to = loc.state?.from?.pathname ?? '/dashboard';
              nav(to, { replace: true });
            } catch {
              toast.error('Invalid credentials');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <label className="block">
                <span className="text-sm">Email</span>
                <Field name="email" type="email" className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-900" />
                {touched.email && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </label>
              <label className="block">
                <span className="text-sm">Password</span>
                <Field name="password" type="password" className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-900" />
                {touched.password && errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </label>
              <button type="submit" disabled={isSubmitting}
                className="w-full rounded bg-gray-900 text-white py-2 disabled:opacity-60 dark:bg-gray-700">
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-3 text-xs text-gray-500">Tip: admin@example.com / admin123</p>
      </div>
    </div>
  );
}
