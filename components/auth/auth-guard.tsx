'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';

const PROTECTED_ROUTES: string[] = ['/checkin', '/onboarding', '/dashboard']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || !user.loaded) return;
    
    switch (true) {
      case (PROTECTED_ROUTES.includes(pathname) && !isAuthenticated):
        router.push('/');
        break;
        
      case (pathname === '/' && isAuthenticated):
        router.push('/dashboard');
        break;
    }
  }, [isAuthenticated, user, pathname]);

  return <>{children}</>;
}
