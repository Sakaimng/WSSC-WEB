export type TicketEventKind = "show" | "special";

export type TicketBookingStatus = "pending" | "paid" | "cancelled" | "refunded";

export type BookableEvent = {
  id: string;
  kind: TicketEventKind;
  title: string;
  titleJp: string;
  description?: string;
  descriptionJp?: string;
  dateIso: string;
  dateLabel: string;
  time: string;
  priceJpy: number;
  capacity: number;
  sold: number;
  remaining: number;
  available: boolean;
};

export type TicketBooking = {
  id: string;
  code: string;
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
  status: TicketBookingStatus;
  createdAt: string;
  paidAt?: string;
  emailSentAt?: string;
};

export type SpecialTicketEvent = {
  id: string;
  title: string;
  titleJp: string;
  description?: string;
  descriptionJp?: string;
  date: string;
  time: string;
  priceJpy: number;
  capacity: number;
  active: boolean;
};
