import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarClock, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Draft workplace emails, summarize meeting notes and plan your day with three focused AI tools in one clean dashboard.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Emails, meeting summaries and task plans — AI drafts you can edit and copy.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a one-line intent into a polished email in a professional, friendly or persuasive tone.",
    hint: "e.g. Ask the design team for final assets by Friday",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Paste messy notes and get key points, action items, decisions and deadlines, cleanly separated.",
    hint: "e.g. 45 minutes of Q3 roadmap notes",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Feed in your tasks and priorities to get a realistic daily or weekly schedule you can adjust.",
    hint: "e.g. 9 tasks, 6 focus hours, deadline Thursday",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Good to see you"
      description="Three focused AI tools for everyday workplace writing and planning. No accounts, no setup — pick a tool and start."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="surface-panel group flex flex-col rounded-2xl border border-border p-5 transition-colors hover:border-foreground/25"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
              <tool.icon className="size-4" />
            </span>
            <h2 className="mt-4 text-base font-semibold">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.body}</p>
            <p className="mt-4 text-xs text-muted-foreground/70">{tool.hint}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
              Open tool
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Tone control", "Professional, friendly or persuasive output on demand."],
          ["Always editable", "Every result lands in an editable panel with one-click copy."],
          ["Nothing stored", "Runs entirely in your browser session — no login, no history."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
