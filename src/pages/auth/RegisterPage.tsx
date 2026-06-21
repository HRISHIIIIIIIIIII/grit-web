import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin, useRegister } from '@/api/hooks/auth';
import { ApiError } from '@/api/client';
import { Button, Input } from '@/components/primitives';
import { AuthLayout } from './AuthLayout';
import styles from './AuthLayout.module.css';

const schema = z.object({
  display_name: z.string().min(1, 'Tell us your name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
});
type Form = z.infer<typeof schema>;

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin';

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMut = useRegister();
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
      await registerMut.mutateAsync({ ...values, timezone: tz });
      await login.mutateAsync({ email: values.email, password: values.password });
      navigate('/onboarding');
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Could not create your account.');
    }
  });

  const busy = registerMut.isPending || login.isPending;

  return (
    <AuthLayout
      title="Start your streak"
      subtitle="Create an account and set up your system."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className={styles.fields} noValidate>
        {formError && <div className={styles.formError}>{formError}</div>}
        <Input
          id="display_name"
          label="Name"
          placeholder="Jordan Reyes"
          autoComplete="name"
          error={errors.display_name?.message}
          {...register('display_name')}
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
