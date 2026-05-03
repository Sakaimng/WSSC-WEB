import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Why So Serious Comedy.",
};

export default function AboutPage() {
  return (
    <div className="box-border w-full max-w-none flex-1 px-[2vw] py-12 sm:py-16">
      <h1 className="font-sans text-4xl font-semibold tracking-wide text-white sm:text-5xl">
        Our story
      </h1>
      <div className="mt-10 space-y-6 leading-relaxed text-neutral-300">
        <p>
          Why So Serious Comedy started as a small room with a loud neighbor, a borrowed PA, and a
          stubborn belief that the best punchlines land when the room feels honest. We built a
          home for comics who like edge without cruelty—and audiences who laugh hard enough to
          forget the week they just had.
        </p>
        <p>
          Today we run regular showcases, feature touring talent, and keep the energy tight:
          sharp hosts, fair pay, and a crowd that respects the work on stage. Swap this copy for
          your real origin story, milestones, and the people who made the club happen.
        </p>
        <p className="text-sm text-neutral-500">
          Tip: add a founders’ photo or venue shot in{" "}
          <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-white">
            public/
          </code>{" "}
          or your gallery archive and link it from this page when assets land.
        </p>
      </div>
    </div>
  );
}
