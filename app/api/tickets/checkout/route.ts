import { NextResponse } from "next/server";
import { MAX_TICKETS_PER_ORDER, isStripeConfigured } from "@/lib/tickets/config";
import { getBookableEventById } from "@/lib/tickets/events";
import { createTicketCheckoutSession } from "@/lib/tickets/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  eventId?: string;
  email?: string;
  name?: string;
  quantity?: number;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 503 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const eventId = body.eventId?.trim();
  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  const quantity = Number(body.quantity ?? 1);

  if (!eventId || !email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "A valid event and email are required." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_TICKETS_PER_ORDER) {
    return NextResponse.json(
      { error: `Quantity must be between 1 and ${MAX_TICKETS_PER_ORDER}.` },
      { status: 400 },
    );
  }

  const event = await getBookableEventById(eventId);
  if (!event || !event.available) {
    return NextResponse.json(
      { error: "This event is sold out or unavailable." },
      { status: 409 },
    );
  }

  if (quantity > event.remaining) {
    return NextResponse.json(
      { error: `Only ${event.remaining} ticket(s) remain for this event.` },
      { status: 409 },
    );
  }

  try {
    const session = await createTicketCheckoutSession({
      eventId: event.id,
      eventTitle: event.title,
      eventDateLabel: event.dateLabel,
      eventDateIso: event.dateIso,
      eventTime: event.time,
      priceJpy: event.priceJpy,
      quantity,
      customerEmail: email,
      customerName: name || undefined,
      bookingId: crypto.randomUUID(),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[tickets] checkout failed:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
