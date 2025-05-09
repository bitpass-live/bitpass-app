'use client';

import type React from 'react';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';

const PROTECTED_ROUTES: string[] = ['/checkin', '/dashboard']

// Simplificar el AuthGuard para proteger solo la ruta de checkin
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user.loaded) return;
    
    if (PROTECTED_ROUTES.includes(pathname) && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, user, pathname]);

  return <>{children}</>;
}
