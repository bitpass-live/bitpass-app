"use client"
import { LoaderView } from '@/components/loader-view';
import { useAuth } from '@/lib/auth-provider';
import { useDraftEventContext } from '@/lib/draft-event-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuth();
    const { draftEvent } = useDraftEventContext();

    const isAllowed =
        user?.loaded &&
        isAuthenticated &&
        draftEvent?.id &&
        (draftEvent.creatorId === user.id ||
            draftEvent.team?.some((member) => member.userId === user.id));

    if (!isAllowed) return <LoaderView />;

    return <>{children}</>;
}   