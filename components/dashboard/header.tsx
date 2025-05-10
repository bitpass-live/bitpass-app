'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User, ChevronDown, Settings } from 'lucide-react';

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

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Skip rendering on login page
  if (pathname === '/') return null;

  return (
    <header className='border-b bg-card'>
      <div className='container flex h-16 items-center justify-between py-4'>
        <Link href='/dashboard' className='flex items-center'>
          <Logo className='text-xl' />
        </Link>

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

        <div className='flex items-center gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='gap-2'>
                <User className='h-4 w-4' />
                <span className='hidden sm:inline'>
                  {user?.name || user?.email || (user?.pubkey && `${user.pubkey.substring(0, 8)}...`) || 'User'}
                </span>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>
                {user?.authMethod === 'email'
                  ? 'Email Account'
                  : user?.authMethod === 'nostr'
                  ? 'Nostr Account'
                  : 'Demo Account'}
              </DropdownMenuLabel>
              <DropdownMenuItem disabled className='text-xs text-muted-foreground'>
                {user?.email || user?.pubkey || 'demo@eventro.com'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/settings'>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
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
