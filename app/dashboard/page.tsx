import { EventList } from '@/components/event-list';
import { Header } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { CreateEventButton } from '@/components/create-event-button';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className='container py-6 space-y-8 pb-20 md:pb-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Your Events</h1>
          <CreateEventButton />
        </div>
        <EventList />
      </main>
      <MobileNav />
    </>
  );
}
