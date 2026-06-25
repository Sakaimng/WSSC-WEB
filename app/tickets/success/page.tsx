import { Suspense } from "react";
import { TicketSuccessContent } from "@/components/TicketSuccessContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Booking confirmed",
  description: "Your WSSC ticket confirmation and door code.",
  path: "/tickets/success",
});

export default function TicketSuccessPage() {
  return (
    <Suspense fallback={null}>
      <TicketSuccessContent />
    </Suspense>
  );
}
