import { Header } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { EventManagement } from '@/components/manage/event-management';

export default async function EventManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  return (
    <>
      <Header backGoHome={true} />
      <main className='py-6 pb-20 md:pb-6'>
        <EventManagement eventId={eventId} />
      </main>
      <MobileNav />
    </>
  );
}
