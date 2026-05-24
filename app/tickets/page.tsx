import { TicketsContent } from "@/components/TicketsContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Tickets",
  description:
    "Get tickets for stand-up comedy in Tokyo — Why So Serious Comedy at Moxy Kinshicho. Book via Meetup, Eventbrite, or on-site checkout.",
  path: "/tickets",
});

export default function TicketsPage() {
  return <TicketsContent />;
}
