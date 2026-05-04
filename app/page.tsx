import { HomeHero } from "@/components/HomeHero";
import { HomeLocationMap } from "@/components/HomeLocationMap";
import { HomeScheduleCalendar } from "@/components/HomeScheduleCalendar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-black">
      <section className="flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:min-h-[calc(100dvh-5rem)]">
        <HomeHero />
      </section>
      <HomeScheduleCalendar />
      <HomeLocationMap />
    </div>
  );
}
