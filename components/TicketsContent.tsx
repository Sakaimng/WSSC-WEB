"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TicketDropdown } from "@/components/TicketDropdown";
import { useI18n } from "@/components/LanguageProvider";
import type { BookableEvent } from "@/lib/tickets/types";
import { formatShowDate } from "@/lib/i18n";

type Props = {
  showEvents: BookableEvent[];
  checkoutEnabled: boolean;
};

function formatEventDescription(event: BookableEvent, language: "en" | "jp") {
  if (language === "jp") return event.descriptionJp ?? event.description;
  return event.description ?? event.descriptionJp;
}

function RegularShowBookingCard({
  showEvents,
  checkoutEnabled,
}: {
  showEvents: BookableEvent[];
  checkoutEnabled: boolean;
}) {
  const { language, t } = useI18n();
  const [selectedEventId, setSelectedEventId] = useState(
    () => showEvents.find((event) => event.available)?.id ?? showEvents[0]?.id ?? "",
  );
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedEvent = useMemo(
    () => showEvents.find((event) => event.id === selectedEventId) ?? showEvents[0],
    [selectedEventId, showEvents],
  );

  const description = selectedEvent
    ? formatEventDescription(selectedEvent, language)
    : "";

  const quantityOptions = useMemo(() => {
    if (!selectedEvent?.available) return [];
    const max = Math.min(selectedEvent.remaining, 6);
    return Array.from({ length: max }, (_, index) => index + 1);
  }, [selectedEvent]);

  useEffect(() => {
    if (!selectedEvent) return;
    if (quantity > quantityOptions.length && quantityOptions.length > 0) {
      setQuantity(quantityOptions.length);
    }
  }, [quantity, quantityOptions.length, selectedEvent]);

  function formatDateOption(event: BookableEvent) {
    const dateLabel = formatShowDate(new Date(`${event.dateIso}T12:00:00`), language);
    const soldOutSuffix = event.available ? "" : ` — ${t.ticketsPage.soldOut}`;
    return `${dateLabel} · ${event.time}${soldOutSuffix}`;
  }

  async function handleCheckout() {
    if (!selectedEvent) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/tickets/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          email,
          name,
          quantity,
        }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Checkout failed.");
      }

      window.location.href = payload.url;
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed.";
      setError(message);
      setLoading(false);
    }
  }

  if (!selectedEvent) return null;

  return (
    <article className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            {t.ticketsPage.regularShow}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">{selectedEvent.title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{description}</p>
          ) : null}
        </div>
        <p className="text-sm font-semibold text-white">
          {t.ticketsPage.priceLabel(selectedEvent.priceJpy)}
        </p>
      </div>

      <form
        className="mt-6 grid gap-4"
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          void handleCheckout();
        }}
      >
        <label className="grid gap-2 text-sm">
          <span className="text-neutral-400">{t.ticketsPage.dateLabel}</span>
          <select
            value={selectedEventId}
            onChange={(changeEvent) => setSelectedEventId(changeEvent.target.value)}
            className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
          >
            {showEvents.map((event) => (
              <option key={event.id} value={event.id} disabled={!event.available}>
                {formatDateOption(event)}
              </option>
            ))}
          </select>
        </label>

        <dl className="grid gap-2 text-sm text-neutral-300">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">{t.ticketsPage.timeLabel}</dt>
            <dd>{selectedEvent.time}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500">{t.ticketsPage.availabilityLabel}</dt>
            <dd>
              {selectedEvent.available
                ? t.ticketsPage.remaining(selectedEvent.remaining)
                : t.ticketsPage.soldOut}
            </dd>
          </div>
        </dl>

        <label className="grid gap-2 text-sm">
          <span className="text-neutral-400">{t.ticketsPage.emailLabel}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(changeEvent) => setEmail(changeEvent.target.value)}
            className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-neutral-400">{t.ticketsPage.nameLabel}</span>
          <input
            type="text"
            value={name}
            onChange={(changeEvent) => setName(changeEvent.target.value)}
            className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            autoComplete="name"
          />
        </label>

        {selectedEvent.available ? (
          <label className="grid gap-2 text-sm">
            <span className="text-neutral-400">{t.ticketsPage.quantityLabel}</span>
            <select
              value={quantity}
              onChange={(changeEvent) => setQuantity(Number(changeEvent.target.value))}
              className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-white/30"
            >
              {quantityOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={!checkoutEnabled || loading || !selectedEvent.available}
          className="rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-neutral-500"
        >
          {loading ? t.ticketsPage.booking : t.ticketsPage.bookButton}
        </button>

        {!checkoutEnabled ? (
          <p className="text-sm text-neutral-500">{t.ticketsPage.checkoutUnavailable}</p>
        ) : null}
      </form>
    </article>
  );
}

export function TicketsContent({ showEvents, checkoutEnabled }: Props) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";
  const hasAvailableShow = showEvents.some((event) => event.available);

  return (
    <div className="page-viewport page-viewport--scroll py-4">
      <header className="mb-6">
        <h1 className="font-sans text-base font-semibold text-white">
          {t.ticketsPage.title}
        </h1>
        <p className="mt-4 text-neutral-400">{t.ticketsPage.description}</p>
        {cancelled ? (
          <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-300">
            {t.ticketsPage.cancelled}
          </p>
        ) : null}
      </header>

      {showEvents.length > 0 ? (
        <RegularShowBookingCard
          showEvents={showEvents}
          checkoutEnabled={checkoutEnabled}
        />
      ) : (
        <p className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 text-sm text-neutral-400">
          {t.ticketsPage.checkoutUnavailable}
        </p>
      )}

      {showEvents.length > 0 && !hasAvailableShow ? (
        <p className="mt-4 text-sm text-neutral-500">{t.ticketsPage.soldOut}</p>
      ) : null}

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">{t.ticketsPage.thirdPartyTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          {t.ticketsPage.thirdPartyDescription}
        </p>
        <div className="mt-6">
          <TicketDropdown label={t.tickets.openBoxOffice} variant="mobile" />
        </div>
      </section>
    </div>
  );
}
