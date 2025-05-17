'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { useDraftEventContext } from '@/lib/draft-event-context';
import { LoaderView } from '../loader-view';

const AUTHENTICATED_ROUTES: string[] = ['/tickets']
const PRIVILEGED_ROUTES: string[] = ['/admin', '/admin/checkin', '/admin/settings', '/onboarding']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { draftEvent } = useDraftEventContext();
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || !user.loaded || redirecting) return;

    const shouldRedirect = () => {

      if (!isAuthenticated && (PRIVILEGED_ROUTES.includes(pathname) || AUTHENTICATED_ROUTES.includes(pathname))) {
        router.push('/login');
        return true;
      }

      const isOwner = draftEvent ? draftEvent.creatorId === user.id : false;
      const isTeamMember = draftEvent ? draftEvent.team?.some((member) => member.userId === user.id) : false;

      if (PRIVILEGED_ROUTES.includes(pathname) && isAuthenticated && !isOwner && !isTeamMember) {
        router.push('/');
        return true;
      }

      if (pathname === '/admin' && (!draftEvent || draftEvent.status === "DRAFT")) {
        router.push('/onboarding');
        return true;
      }

      if (pathname === '/onboarding' && (draftEvent && draftEvent.status === 'PUBLISHED')) {
        router.push('/admin');
        return true;
      }

      return false;
    };

    const redirected = shouldRedirect();
    setRedirecting(redirected);
  }, [isAuthenticated, draftEvent, user, redirecting, router]);

  useEffect(() => {
    setRedirecting(false);
  }, [pathname])

  if (redirecting || !user.loaded) return (<LoaderView />)

  return <>{children}</>;
}
