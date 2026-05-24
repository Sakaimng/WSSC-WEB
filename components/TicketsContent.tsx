"use client";

import { TransitionLink as Link } from "@/components/TransitionLink";
import { TicketDropdown } from "@/components/TicketDropdown";
import { useI18n } from "@/components/LanguageProvider";

export function TicketsContent() {
  const { t } = useI18n();

  return (
    <div className="page-viewport page-viewport--scroll py-4">
      <header className="mb-6">
        <h1 className="font-sans text-base font-semibold text-white">
          {t.ticketsPage.title}
        </h1>
        <p className="mt-4 text-neutral-400">{t.ticketsPage.description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-8">
          <h2 className="text-lg font-semibold text-white">{t.ticketsPage.onsite}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {t.ticketsPage.onsiteDescription}
          </p>
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-neutral-500"
          >
            {t.ticketsPage.checkoutSoon}
          </button>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/[0.03] p-8">
          <h2 className="text-lg font-semibold text-white">{t.ticketsPage.thirdParty}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {t.ticketsPage.thirdPartyDescription}
          </p>
          <div className="mt-6">
            <TicketDropdown label={t.tickets.openBoxOffice} variant="mobile" />
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-neutral-500">
        <Link href="/" className="text-white underline-offset-4 hover:underline">
          {t.ticketsPage.backHome}
        </Link>
      </p>
    </div>
  );
}
