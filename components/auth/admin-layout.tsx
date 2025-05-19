'use client';
import { LoaderView } from '@/components/loader-view';
import { useAuth } from '@/lib/auth-provider';
import { useDraftEventContext } from '@/lib/draft-event-context';
import { LoginForm } from '../login-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { user, isAuthenticated } = useAuth();
  const { draftEvent } = useDraftEventContext();

  const isAllowed =
    user?.loaded &&
    isAuthenticated &&
    (!draftEvent ||
      (draftEvent?.id &&
        (draftEvent.creatorId === user.id || draftEvent.team?.some((member) => member.userId === user.id))));

  useEffect(() => {
    if (isAllowed && !draftEvent?.id) {
      router.push('/onboarding');
    }
  }, [draftEvent]);

  if (!isAllowed)
    return (
      <div className='min-h-screen flex flex-col flex-1 items-center justify-center w-full max-w-md mx-auto py-6'>
        <LoginForm />
      </div>
    );

  return <>{children}</>;
}
