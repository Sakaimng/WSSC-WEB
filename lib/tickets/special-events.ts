import type { SpecialTicketEvent } from "@/lib/tickets/types";

/**
 * Add or edit special events here. Set `active: true` when tickets should go on sale.
 */
export const specialTicketEvents: SpecialTicketEvent[] = [
  {
    id: "special-example-2026",
    title: "Special Night (example)",
    titleJp: "スペシャル公演（例）",
    description:
      "Replace this with your real special event copy, or set active: false until you are ready.",
    descriptionJp:
      "本番用のスペシャル公演情報に差し替えてください。準備ができるまで active: false のままにできます。",
    date: "2026-12-31",
    time: "9:00 PM",
    priceJpy: 3500,
    capacity: 80,
    active: false,
  },
];
