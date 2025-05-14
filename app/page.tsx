'use client';

import Link from 'next/link';
import { useDraftEventContext } from '@/lib/draft-event-context';
import { useAuth } from '@/lib/auth-provider';
import CheckoutPage from '@/components/checkout/checkout-page';
import { Loader } from 'lucide-react';
import { LoaderView } from '@/components/loader-view';

export default function AuthPage() {
  const { user, isAuthenticated } = useAuth();
  const { draftEvent, loading } = useDraftEventContext();

  if (loading) return <LoaderView />

  if (user.loaded && isAuthenticated && (!draftEvent || !draftEvent.id)) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center py-6">
            <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Welcome!</h1>
                <p className="text-muted-foreground mt-2">
                  Create your first event with our step-by-step guide.
                </p>
              </div>

              <Link
                href="/onboarding"
                className="text-center bg-primary text-black rounded-md py-2 px-4 hover:bg-primary/90 transition"
              >
                Start now
              </Link>
            </div>
        </main>
      </div>
    );
  }

  if (user.loaded && !isAuthenticated && (!draftEvent || !draftEvent.id)) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center py-6">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome!</h1>
              <p className="text-muted-foreground mt-2">
                You need to log in to start creating your event.
              </p>
            </div>

            <Link
              href="/login"
              className="text-center bg-primary text-black rounded-md py-2 px-4 hover:bg-primary/90 transition"
            >
              Log in
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (<CheckoutPage />);
}
