"use client";

import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { TicketDropdown } from "@/components/TicketDropdown";
import { useI18n } from "@/components/LanguageProvider";
import {
  getEventLabel,
  getTokyoToday,
  getUpcomingShows,
  SHOW_TIME,
  type TokyoDate,
} from "@/lib/show-schedule";
import { formatMonthTitle, formatShowDate, type Language } from "@/lib/i18n";

type CalendarDay = {
  key: string;
  day: number | null;
  isToday: boolean;
  eventLabel: string | null;
};

function translateShowLabel(
  label: string | null,
  labels: Record<"week1Wed" | "week2Fri" | "week3Wed" | "week4Fri", string>,
) {
  if (label === "Week 1 Wed") return labels.week1Wed;
  if (label === "Week 2 Fri") return labels.week2Fri;
  if (label === "Week 3 Wed") return labels.week3Wed;
  if (label === "Week 4 Fri") return labels.week4Fri;
  return label;
}

function buildCalendarMonth(
  year: number,
  month: number,
  today: TokyoDate,
  language: Language,
  eventLabels: Record<"week1Wed" | "week2Fri" | "week3Wed" | "week4Fri", string>,
) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarDay[] = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push({
      key: `empty-${year}-${month}-${i}`,
      day: null,
      isToday: false,
      eventLabel: null,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      key: `${year}-${month}-${day}`,
      day,
      isToday: today.year === year && today.month === month && today.day === day,
      eventLabel: translateShowLabel(getEventLabel(year, month, day), eventLabels),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      key: `empty-end-${year}-${month}-${cells.length}`,
      day: null,
      isToday: false,
      eventLabel: null,
    });
  }

  return {
    /** Stable across language so React keeps nodes; title/locale updates in place. */
    monthKey: `${year}-${month}`,
    title: formatMonthTitle(new Date(year, month, 1), language),
    cells,
  };
}

export function ScheduleContent() {
  const { language, t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [today] = useState<TokyoDate>(() => getTokyoToday());

  const calendarMonth = useMemo(
    () =>
      buildCalendarMonth(
        today.year,
        today.month,
        today,
        language,
        t.schedule.showLabels,
      ),
    [language, t.schedule.showLabels, today],
  );

  const upcomingShows = useMemo(() => getUpcomingShows(today, 6), [today]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".schedule-reveal");

      gsap.set(items, { autoAlpha: 0, y: 28 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, [today]);

  return (
    <section
      ref={root}
      className="schedule-page page-viewport flex w-full flex-col max-sm:pb-8 sm:min-h-0 sm:flex-1 sm:justify-center"
    >
      <div className="schedule-reveal w-full shrink-0 opacity-0">
        <p className="text-xs font-semibold text-neutral-500">
          {t.schedule.eyebrow}
        </p>
        <h1 className="mt-3 max-w-5xl font-sans text-base font-semibold text-white">
          {t.schedule.title}
        </h1>
      </div>

      <div className="mt-4 grid w-full min-w-0 shrink-0 gap-5 sm:mt-5 sm:max-h-[calc(100dvh-12rem)] sm:grid-cols-[0.6fr_1.4fr] sm:items-stretch lg:gap-5">
        <div className="schedule-reveal relative z-10 flex h-full min-h-0 w-full min-w-0 flex-col opacity-0">
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto lg:space-y-1.5">
            {upcomingShows.map((show) => (
              <div
                key={show.key}
                className="flex w-full min-w-0 flex-col gap-2 pb-3 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:pb-2"
              >
                <span className="text-sm font-medium text-white sm:min-w-0">
                  {formatShowDate(new Date(show.year, show.month, show.day), language)}
                </span>
                <span className="text-xs font-semibold text-neutral-500 sm:shrink-0 sm:text-right">
                  {translateShowLabel(show.label, t.schedule.showLabels)} / {SHOW_TIME}
                </span>
              </div>
            ))}
          </div>
          <div className="relative z-30 mt-6 shrink-0 overflow-visible sm:mt-0">
            <TicketDropdown label={t.schedule.ticketOptions} variant="wide" />
          </div>
        </div>

        <article className="schedule-reveal relative z-0 flex h-full min-h-0 w-full min-w-0 flex-col opacity-0">
          <h2 className="shrink-0 font-sans text-xl font-semibold text-white lg:text-lg">
            {calendarMonth.title}
          </h2>
          <div className="mt-auto flex min-h-0 flex-col justify-end pt-5 lg:pt-3">
            <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] text-neutral-600 lg:text-[0.58rem]">
              {t.schedule.weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
            {calendarMonth.cells.map((cell) => (
              <div
                key={cell.key}
                className={`min-h-12 border border-white/10 p-1.5 text-left lg:min-h-10 lg:p-1 ${
                  cell.eventLabel
                    ? "border-white/40 bg-white text-black"
                    : cell.day
                      ? "text-neutral-300"
                      : "border-white/10"
                }`}
              >
                {cell.day ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium lg:text-xs">{cell.day}</span>
                      {cell.isToday ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      ) : null}
                    </div>
                    {cell.eventLabel ? (
                      <p className="mt-2 text-[0.62rem] font-semibold lg:mt-1 lg:text-[0.5rem]">
                        {SHOW_TIME}
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>
            ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
