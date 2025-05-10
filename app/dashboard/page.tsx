import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { EventList } from '@/components/event-list';
import { Header } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className='container py-6 space-y-8 pb-20 md:pb-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Your Events</h1>

          <Button asChild>
            <Link href='/event/create'>
              <PlusIcon className='h-4 w-4' />
              Create
            </Link>
          </Button>
        </div>
        <EventList />
      </main>
      <MobileNav />
    </>
  );
}
