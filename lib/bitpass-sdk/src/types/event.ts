export interface Event {
    id: string;
    title: string;
    description?: string;
    location: string;
    startsAt: string; // ISO
    endsAt: string;   // ISO
    status: "DRAFT" | "PUBLISHED";
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}