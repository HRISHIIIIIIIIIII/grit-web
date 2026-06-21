import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/api/hooks/auth';
import { ApiError } from '@/api/client';
import { Button, Input } from '@/components/primitives';
import { AuthLayout } from './AuthLayout';
import styles from './AuthLayout.module.css';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type Form = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login.mutateAsync(values);
      navigate('/');
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Could not sign in. Try again.');
    }
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep your streak alive."
      footer={
        <>
          New to GRIT? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className={styles.fields} noValidate>
        {formError && <div className={styles.formError}>{formError}</div>}
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" block disabled={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
}
