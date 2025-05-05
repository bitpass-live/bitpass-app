import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='border-b'>
        <div className='container flex h-16 items-center justify-between py-4'>
          <Link href='/' className='flex items-center'>
            <Logo className='text-xl' />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className='flex-1 flex items-center justify-center p-6'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>Welcome Back</h1>
            <p className='text-muted-foreground mt-2'>Sign in to your account to continue</p>
          </div>

          <LoginForm />

          <div className='text-center text-sm text-muted-foreground'>
            <p>
              Don&apos;t have an account?{' '}
              <Link href='/' className='text-primary hover:underline'>
                Go to homepage
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='py-6 border-t'>
        <div className='container text-center text-sm text-muted-foreground'>
          <p>© {new Date().getFullYear()} NotPass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
