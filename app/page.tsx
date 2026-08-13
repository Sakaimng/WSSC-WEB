import { HomeHero } from "@/components/HomeHero";
import { MerchLaunchPopup } from "@/components/MerchLaunchPopup";

export default function Home() {
  return (
    <section className="relative h-[100dvh] min-h-[100dvh] w-full">
      <HomeHero />
      <MerchLaunchPopup />
    </section>
  );
}
