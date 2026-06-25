import { Suspense } from "react";
import { TicketsContent } from "@/components/TicketsContent";
import { isStripeConfigured } from "@/lib/tickets/config";
import { getBookableEvents } from "@/lib/tickets/events";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Tickets",
  description:
    "Book Why So Serious Comedy shows in Tokyo. Stripe checkout, unique door codes, and email confirmations for every order.",
  path: "/tickets",
});

export default async function TicketsPage() {
  const events = await getBookableEvents("en", 12);
  const showEvents = events.filter((event) => event.kind === "show");
  const checkoutEnabled = isStripeConfigured();

  return (
    <Suspense fallback={null}>
      <TicketsContent showEvents={showEvents} checkoutEnabled={checkoutEnabled} />
    </Suspense>
  );
}
