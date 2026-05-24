import { ScheduleContent } from "@/components/ScheduleContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Schedule",
  description:
    "Upcoming stand-up comedy shows in Tokyo. Why So Serious Comedy at Moxy Kinshicho — dates, show times, and ticket options for the best English comedy in Kinshicho.",
  path: "/schedule",
});

export default function SchedulePage() {
  return <ScheduleContent />;
}
