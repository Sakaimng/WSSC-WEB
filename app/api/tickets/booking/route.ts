import { NextResponse } from "next/server";
import { fulfillPaidCheckoutSession } from "@/lib/tickets/fulfill";
import { getBookingBySessionId } from "@/lib/tickets/store";
import { getStripe } from "@/lib/tickets/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required." }, { status: 400 });
  }

  let booking = (await getBookingBySessionId(sessionId)) ?? null;

  if (!booking) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        booking = (await fulfillPaidCheckoutSession(session)) ?? null;
      }
    } catch (error) {
      console.error("[tickets] booking lookup failed:", error);
    }
  }

  if (!booking || booking.status !== "paid") {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({
    code: booking.code,
    eventTitle: booking.eventTitle,
    eventDateIso: booking.eventDateIso,
    eventTime: booking.eventTime,
    quantity: booking.quantity,
    email: booking.customerEmail,
    emailSent: Boolean(booking.emailSentAt),
  });
}
