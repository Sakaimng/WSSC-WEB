import type { Metadata } from "next";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { EXTERNAL_TICKETS_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Get tickets for Why So Serious Comedy shows.",
};

export default function TicketsPage() {
  return (
    <div className="box-border w-full max-w-none flex-1 px-[2vw] py-12 sm:py-16">
      <header className="mb-12">
        <h1 className="font-sans text-4xl font-semibold tracking-wide text-white sm:text-5xl">
          Tickets
        </h1>
        <p className="mt-4 text-neutral-400">
          Grab seats here or jump to our partner box office when that’s the smoother move at
          showtime.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-8">
          <h2 className="text-lg font-semibold text-white">On this site</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Hook your checkout provider (Stripe, Eventbrite embed, etc.) into this card when you’re
            ready. For now it’s a styled placeholder you can replace with a widget or form.
          </p>
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-neutral-500"
          >
            Checkout coming soon
          </button>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/[0.03] p-8">
          <h2 className="text-lg font-semibold text-white">Third-party box office</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Send fans straight to your ticketing partner. Update{" "}
            <code className="rounded border border-white/10 bg-black px-1.5 py-0.5 text-white">
              NEXT_PUBLIC_EXTERNAL_TICKETS_URL
            </code>{" "}
            or{" "}
            <code className="rounded border border-white/10 bg-black px-1.5 py-0.5 text-white">
              lib/config.ts
            </code>
            .
          </p>
          <a
            href={EXTERNAL_TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Open box office
          </a>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-neutral-500">
        <Link href="/" className="text-white underline-offset-4 hover:underline">
          Back home
        </Link>
      </p>
    </div>
  );
}
