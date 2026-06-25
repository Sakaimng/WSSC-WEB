"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { useI18n } from "@/components/LanguageProvider";

type BookingPayload = {
  code: string;
  eventTitle: string;
  eventDateIso: string;
  eventTime: string;
  quantity: number;
  email: string;
  emailSent: boolean;
};

export function TicketSuccessContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState<BookingPayload | null>(null);
  const [pending, setPending] = useState(Boolean(sessionId));
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setPending(false);
      setMissing(true);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    async function loadBooking() {
      const response = await fetch(`/api/tickets/booking?session_id=${sessionId}`);
      if (cancelled) return;

      if (response.ok) {
        const payload = (await response.json()) as BookingPayload;
        setBooking(payload);
        setPending(false);
        setMissing(false);
        return;
      }

      attempts += 1;
      if (attempts < 8) {
        window.setTimeout(() => {
          void loadBooking();
        }, 1500);
        return;
      }

      setPending(false);
      setMissing(true);
    }

    void loadBooking();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="page-viewport page-viewport--scroll py-4">
      <header className="mb-6">
        <h1 className="font-sans text-base font-semibold text-white">
          {t.ticketsPage.successTitle}
        </h1>
        <p className="mt-4 text-neutral-400">{t.ticketsPage.successDescription}</p>
      </header>

      {pending ? (
        <p className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 text-sm text-neutral-300">
          {t.ticketsPage.successPending}
        </p>
      ) : null}

      {booking ? (
        <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            {t.ticketsPage.codeLabel}
          </p>
          <p className="mt-4 font-mono text-3xl font-semibold tracking-[0.12em] text-white">
            {booking.code}
          </p>
          <p className="mt-6 text-sm text-neutral-300">
            {booking.eventTitle}
            <br />
            {booking.eventDateIso} · {booking.eventTime}
          </p>
          <p className="mt-3 text-sm text-neutral-500">
            {t.ticketsPage.quantityNote(booking.quantity)} · {booking.email}
          </p>
          {booking.emailSent ? (
            <p className="mt-6 text-sm text-neutral-400">{t.ticketsPage.successEmailNote}</p>
          ) : null}
        </div>
      ) : null}

      {missing && !pending ? (
        <p className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 text-sm text-neutral-300">
          {t.ticketsPage.successMissing}
        </p>
      ) : null}

      <p className="mt-10 text-center text-sm text-neutral-500">
        <Link href="/tickets" className="text-white underline-offset-4 hover:underline">
          {t.ticketsPage.title}
        </Link>
        {" · "}
        <Link href="/" className="text-white underline-offset-4 hover:underline">
          {t.ticketsPage.backHome}
        </Link>
      </p>
    </div>
  );
}
