import { Header } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { EventManagement } from '@/components/manage/event-management';
import { INSTANCE_ID } from '@/lib/instance-id';

export default async function EventManagePage() {
    return (
        <>
            <Header backGoHome={true} />

            <main className='py-6 pb-20 md:pb-6'>
                <EventManagement eventId={INSTANCE_ID} />
            </main>

            <MobileNav />
        </>
    );
}
