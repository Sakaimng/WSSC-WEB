import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateTicketCode } from "@/lib/tickets/codes";
import type { TicketBooking, TicketBookingStatus } from "@/lib/tickets/types";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "ticket-bookings.json");

async function ensureBookingsFile() {
  await mkdir(path.dirname(BOOKINGS_PATH), { recursive: true });

  try {
    await readFile(BOOKINGS_PATH, "utf8");
  } catch {
    await writeFile(BOOKINGS_PATH, "[]\n", "utf8");
  }
}

async function readBookings(): Promise<TicketBooking[]> {
  await ensureBookingsFile();
  const raw = await readFile(BOOKINGS_PATH, "utf8");
  const parsed = JSON.parse(raw) as TicketBooking[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeBookings(bookings: TicketBooking[]) {
  await ensureBookingsFile();
  await writeFile(BOOKINGS_PATH, `${JSON.stringify(bookings, null, 2)}\n`, "utf8");
}

export async function getAllBookings() {
  return readBookings();
}

export async function getPaidQuantityForEvent(eventId: string) {
  const bookings = await readBookings();
  return bookings
    .filter((booking) => booking.eventId === eventId && booking.status === "paid")
    .reduce((total, booking) => total + booking.quantity, 0);
}

export async function getBookingBySessionId(stripeSessionId: string) {
  const bookings = await readBookings();
  return bookings.find((booking) => booking.stripeSessionId === stripeSessionId);
}

async function createUniqueCode(bookings: TicketBooking[]) {
  let code = generateTicketCode();
  while (bookings.some((booking) => booking.code === code)) {
    code = generateTicketCode();
  }
  return code;
}

export async function createPaidBooking(input: {
  eventId: string;
  eventTitle: string;
  eventDateIso: string;
  eventTime: string;
  customerEmail: string;
  customerName?: string;
  quantity: number;
  amountJpy: number;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
}) {
  const bookings = await readBookings();
  const existing = bookings.find(
    (booking) => booking.stripeSessionId === input.stripeSessionId,
  );
  if (existing) return existing;

  const code = await createUniqueCode(bookings);
  const booking: TicketBooking = {
    id: crypto.randomUUID(),
    code,
    ...input,
    status: "paid",
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  };

  bookings.push(booking);
  await writeBookings(bookings);
  return booking;
}

export async function markBookingEmailSent(stripeSessionId: string) {
  const bookings = await readBookings();
  const index = bookings.findIndex(
    (booking) => booking.stripeSessionId === stripeSessionId,
  );

  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index]!,
    emailSentAt: new Date().toISOString(),
  };

  await writeBookings(bookings);
  return bookings[index]!;
}

export async function updateBookingStatus(
  stripeSessionId: string,
  status: TicketBookingStatus,
) {
  const bookings = await readBookings();
  const index = bookings.findIndex(
    (booking) => booking.stripeSessionId === stripeSessionId,
  );

  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index]!,
    status,
  };

  await writeBookings(bookings);
  return bookings[index]!;
}
