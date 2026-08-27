import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/Disclaimer";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/assistant.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a task list into a prioritized daily or weekly schedule you can edit and copy in seconds.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritized daily and weekly schedules generated from your task list.",
      },
    ],
  }),
  component: PlannerPage,
});

const SAMPLE = `- Finish Q3 budget deck (high, due Thursday)
- Review 4 pull requests (medium)
- Client call prep for Nedbank (high, call is Wednesday 14:00)
- Write onboarding email sequence (medium)
- Update team wiki (low)
- 1:1 with Marco (fixed, Tuesday 11:00)
- Follow up on vendor invoice (high, sign-off by the 25th)`;

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState(SAMPLE);
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Weekly");
  const [hours, setHours] = useState("6 focus hours per day");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!tasks.trim()) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    try {
      setOutput(await run({ data: { tasks, horizon, hours } }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not build the plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Task Planner"
      description="List your tasks with rough priorities and deadlines. Get a realistic schedule you can shuffle to fit your day."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="surface-panel space-y-5 rounded-2xl border border-border p-5">
          <div className="space-y-2">
            <Label>Plan for</Label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1">
              {(["Daily", "Weekly"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setHorizon(option)}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    horizon === option
                      ? "bg-secondary font-medium text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Available time</Label>
            <Input
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 5 focus hours per day, no meetings Friday"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tasks">Tasks and priorities</Label>
              <button
                type="button"
                onClick={() => setTasks(SAMPLE)}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Load sample
              </button>
            </div>
            <Textarea
              id="tasks"
              rows={12}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="One task per line — add priority and deadline where you know them."
              className="text-[13px] leading-relaxed"
            />
          </div>

          <Button className="w-full" onClick={submit} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Building plan…" : `Generate ${horizon.toLowerCase()} plan`}
          </Button>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          onReset={() => setOutput("")}
          loading={loading}
          rows={20}
          placeholder="Your prioritized schedule will appear here."
        />
      </div>

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
