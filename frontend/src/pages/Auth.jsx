import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { api } from '../services/api';
import { useAuth } from '../store/auth';

export default function Auth() {
  const { register, handleSubmit } = useForm();
  const setUser = useAuth((state) => state.setUser);

  const submit = async (values) => {
    const { data } = await api.post('/auth/login', values);
    setUser(data.data.user);
  };

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="mb-4 text-3xl font-black">Login</h1>
      <form onSubmit={handleSubmit(submit)} className="space-y-3">
        <input className="input" placeholder="Email" {...register('email')} />
        <input className="input" type="password" placeholder="Password" {...register('password')} />
        <button className="btn w-full">Login</button>
      </form>
    </Card>
  );
}
