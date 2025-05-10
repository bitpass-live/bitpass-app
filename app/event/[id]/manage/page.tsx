import { Header } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { EventManagement } from '@/components/manage/event-management';

export default function EventManagePage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header backGoHome={true} />
      <main className='py-6 pb-20 md:pb-6'>
        <EventManagement eventId={params.id} />
      </main>
      <MobileNav />
    </>
  );
}
