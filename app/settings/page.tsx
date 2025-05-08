import { Header } from '@/components/dashboard/header';
import { MobileNav } from '@/components/dashboard/mobile-nav';
import { UserSettings } from '@/components/settings/user-settings';

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className='container py-6 pb-20 md:pb-6'>
        <h1 className='text-3xl font-bold mb-6'>Settings</h1>
        <UserSettings />
      </main>
      <MobileNav />
    </>
  );
}
