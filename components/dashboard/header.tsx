'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, Settings, ArrowLeft } from 'lucide-react';

import { useAuth } from '@/lib/auth-provider';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header({ backGoHome = false }: { backGoHome?: boolean }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Skip rendering on login page
  if (pathname === '/') return null;

  return (
    <header className='border-b bg-card'>
      <div className='container flex gap-8 h-16 items-center justify-between py-4'>
        <div className='min-w-10'>
          {backGoHome && (
            <Button className='gap-2' variant='secondary' size='icon' asChild>
              <Link href='/'>
                <ArrowLeft className='h-4 w-4' />
              </Link>
            </Button>
          )}
        </div>
        <div className='flex justify-center w-full h-full'>
          <Link href='/' className='flex items-center'>
            <Logo className='text-xl' />
          </Link>
        </div>

        {/* <nav className='hidden md:flex items-center gap-6'>
          <Link
            href='/dashboard'
            className={`flex items-center gap-2 ${pathname === '/dashboard' ? 'font-medium' : ''}`}
          >
            <LayoutDashboard className='h-4 w-4' />
            <span>Dashboard</span>
          </Link>
          <Link
            href='/checkin'
            className={`flex items-center gap-2 ${pathname.startsWith('/checkin') ? 'font-medium' : ''}`}
          >
            <QrCode className='h-4 w-4' />
            <span>Check-in</span>
          </Link>
        </nav> */}

        <div className='w-10'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='gap-2' variant='secondary' size='icon'>
                <User className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel className='pb-0'>
                {user?.authMethod === 'email'
                  ? 'Email Account'
                  : user?.authMethod === 'nostr'
                  ? 'Nostr Account'
                  : 'Demo Account'}
              </DropdownMenuLabel>
              <DropdownMenuItem disabled className='text-xs text-muted-foreground'>
                {user?.email || 'demo@eventro.com'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem asChild>
                <Link href='/settings'>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={logout}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
