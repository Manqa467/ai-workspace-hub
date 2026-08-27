import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/Disclaimer";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/assistant.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste long meeting notes and get key points, action items, decisions and deadlines you can edit and copy.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into structured key points, actions, decisions, dates.",
      },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Q3 Roadmap sync — Tue 10:00, 42 min
Attendees: Priya (PM), Marco (Eng), Thandi (Design), Sam (Finance)

Priya walked through the backlog. Onboarding revamp is still the top bet — activation dropped 6% last month. Marco says the auth refactor is blocking it; he needs two more sprints, wants a decision on whether to ship the revamp behind a flag first.
Thandi has the new flows ready except the empty states. She'll share Figma by Thu.
Sam flagged the vendor invoice — analytics tool renews on the 30th, needs sign-off by the 25th or we auto-renew at the higher tier. Team agreed to downgrade to the standard plan.
Marco raised flaky CI: about 1 in 4 builds fail, costs the team roughly a day a week. Agreed to give him Friday to fix it.
We decided to postpone the referral programme to Q4. Priya will tell the growth team.
Next sync same time next week.`;

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      setOutput(await run({ data: { notes } }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not summarize the notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Paste raw notes or a transcript. You get a summary plus key points, action items, decisions and deadlines."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="surface-panel space-y-5 rounded-2xl border border-border p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Meeting notes</Label>
              <button
                type="button"
                onClick={() => setNotes(SAMPLE)}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Load sample
              </button>
            </div>
            <Textarea
              id="notes"
              rows={18}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste the full notes, including who said what and any dates mentioned."
              className="text-[13px] leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              {notes.trim() ? notes.trim().split(/\s+/).length : 0} words
            </p>
          </div>

          <Button className="w-full" onClick={submit} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          onReset={() => setOutput("")}
          loading={loading}
          rows={20}
          placeholder="Your structured summary will appear here."
        />
      </div>

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
