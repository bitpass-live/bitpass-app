import { EventCheckout } from "@/components/event-checkout"

// ID del evento hardcodeado para la demo
const HARDCODED_EVENT_ID = "event123"

export default function HomePage() {
  return <EventCheckout eventId={HARDCODED_EVENT_ID} />
}
