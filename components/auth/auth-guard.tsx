'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { useDraftEventContext } from '@/lib/draft-event-context';

const PROTECTED_ROUTES: string[] = ['/admin', '/admin/checkin', '/admin/settings', '/onboarding']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { draftEvent } = useDraftEventContext();
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || !user.loaded) return;
    
    switch (true) {
      case (PROTECTED_ROUTES.includes(pathname) && !isAuthenticated):
        router.push('/');
        break;

      case (pathname === '/admin' && (!draftEvent || !draftEvent.id)):
        router.push('/onboarding');
        break;

      case (PROTECTED_ROUTES.includes(pathname) && isAuthenticated): {
        if (!draftEvent) {
          break;
        }

        const isOwner = draftEvent?.creatorId === user.id
        const isTeamMember = draftEvent?.team?.some((member) => member.userId === user.id);
        if (!isOwner && !isTeamMember) {
          router.push('/')
          break;
        }
      }
        
      case (pathname === '/login' && isAuthenticated): {
        router.push('/')
        break;
      }
    }
  }, [isAuthenticated, user, pathname]);

  return <>{children}</>;
}
