import { comedians } from "@/lib/roster";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Comedian Roster",
  description:
    "Regular comedians at Why So Serious Comedy — English stand-up comedy performers in Tokyo, Kinshicho.",
  path: "/roster",
});

export default function RosterPage() {
  return (
    <div className="page-viewport page-viewport--scroll py-4">
      <header className="mb-6">
        <h1 className="font-sans text-base font-semibold text-white">
          Comedian roster
        </h1>
        <p className="mt-4 text-neutral-400">
          Faces you’ll see on our lineup. Edit names, roles, and bios in{" "}
          <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-sm text-white">
            lib/roster.ts
          </code>
          —and add headshots when you have them.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2">
        {comedians.map((c) => (
          <li
            key={c.id}
            className="flex gap-5 rounded-2xl border border-white/10 bg-neutral-950/50 p-6"
          >
            <div
              className="h-24 w-24 shrink-0 rounded-xl bg-neutral-800 ring-1 ring-white/10"
              aria-hidden
            />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">{c.name}</h2>
              <p className="mt-0.5 text-xs font-semibold text-neutral-400">
                {c.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{c.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
