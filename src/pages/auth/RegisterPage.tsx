import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { useAuth } from '../../features/auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-4 text-xl font-semibold">Register</h1>
        <Formik
          initialValues={{ name: '', email: '', password: '', role: 'USER' }}
          validate={(v) => {
            const e: Record<string, string> = {};
            if (!v.name) e.name = 'Name is required';
            if (!v.email) e.email = 'Email is required';
            if (!v.password || v.password.length < 6) e.password = 'Min 6 characters';
            return e;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await register(values);
              toast.success('Account created!');
              nav('/dashboard', { replace: true });
            } catch {
              toast.error('Registration failed');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              <label className="block">
                <span className="text-sm">Name</span>
                <Field name="name" className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-900" />
                {touched.name && errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </label>
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
              <label className="block">
                <span className="text-sm">Role</span>
                <Field as="select" name="role" className="mt-1 w-full rounded border px-3 py-2 dark:bg-gray-900">
                  <option value="USER">USER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </Field>
              </label>
              <button type="submit" disabled={isSubmitting}
                className="w-full rounded bg-gray-900 text-white py-2 disabled:opacity-60 dark:bg-gray-700">
                {isSubmitting ? 'Creating…' : 'Create account'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
