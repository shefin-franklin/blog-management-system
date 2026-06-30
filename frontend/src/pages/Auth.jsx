import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { api } from '../services/api';
import { useAuth } from '../store/auth';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname === '/register';
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const setUser = useAuth((state) => state.setUser);

  const submit = async (values) => {
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister
      ? values
      : {
          email: values.email,
          password: values.password,
        };

    const { data } = await api.post(endpoint, payload);
    setUser(data.data.user);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-hover">Secure access</p>
        <h1 className="mt-3 text-3xl font-black">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-2 text-muted">
          {isRegister
            ? 'Join the AI-powered publishing workspace and start creating premium content.'
            : 'Sign in to manage blogs, analytics, bookmarks and AI writing tools.'}
        </p>

        <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
          {isRegister && (
            <label className="block space-y-2">
              <span className="text-sm text-muted">Name</span>
              <input className="input" placeholder="Jane Author" {...register('name', { required: 'Name is required' })} />
              {errors.name && <span className="text-sm text-red-300">{errors.name.message}</span>}
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-sm text-muted">Email</span>
            <input className="input" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} />
            {errors.email && <span className="text-sm text-red-300">{errors.email.message}</span>}
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-muted">Password</span>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            {errors.password && <span className="text-sm text-red-300">{errors.password.message}</span>}
          </label>

          {isRegister && (
            <label className="block space-y-2">
              <span className="text-sm text-muted">Role</span>
              <select className="input" defaultValue="subscriber" {...register('role')}>
                <option value="subscriber">Subscriber</option>
                <option value="author">Author</option>
                <option value="editor">Editor</option>
              </select>
            </label>
          )}

          <button className="btn w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link className="font-semibold text-hover" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </p>
      </Card>
    </div>
  );
}
