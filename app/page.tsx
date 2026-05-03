import { HomeHero } from "@/components/HomeHero";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-1 flex-col overflow-hidden bg-black sm:min-h-[calc(100dvh-5rem)]">
      <HomeHero />
    </div>
  );
}
