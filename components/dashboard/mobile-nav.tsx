'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, QrCode, Settings } from 'lucide-react';

export function MobileNav({ children }: any) {
  const pathname = usePathname();

  // Skip rendering on login page
  if (pathname === '/') return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-40 md:hidden'>
      <div className='flex items-center justify-around bg-background border-t h-20 px-4'>
        {children ? (
          children
        ) : (
          <>
            <Link
              href='/dashboard'
              className={`flex flex-col items-center justify-center gap-1 w-20 h-full ${
                pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <LayoutDashboard className='h-5 w-5' />
              <span className='text-xs'>Home</span>
            </Link>
            <Link
              href='/checkin'
              className={`flex flex-col items-center justify-center gap-1 w-20 h-full ${
                pathname.startsWith('/checkin') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <QrCode className='h-5 w-5' />
              <span className='text-xs'>Check-in</span>
            </Link>
            <Link
              href='/settings'
              className={`flex flex-col items-center justify-center gap-1 w-20 h-full ${
                pathname.startsWith('/settings') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Settings className='h-5 w-5' />
              <span className='text-xs'>Settings</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
