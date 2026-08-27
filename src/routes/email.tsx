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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/assistant.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional, friendly or persuasive workplace emails in seconds, then edit and copy them.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "AI-drafted workplace emails in three tones, fully editable.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Professional" | "Friendly" | "Persuasive";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("Request final design assets ahead of the Friday launch");
  const [recipient, setRecipient] = useState("Thandi, Design Lead");
  const [tone, setTone] = useState<Tone>("Professional");
  const [details, setDetails] = useState(
    "Need the hero banner and 3 social crops. Launch is Friday 09:00. Offer to help with resizing if capacity is tight.",
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!purpose.trim()) {
      toast.error("Describe what the email should achieve.");
      return;
    }
    setLoading(true);
    try {
      setOutput(await run({ data: { purpose, recipient, tone, details } }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the situation and pick a tone. You get a subject line and a ready-to-send draft you can edit."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="surface-panel space-y-5 rounded-2xl border border-border p-5">
          <div className="space-y-2">
            <Label htmlFor="purpose">What is the email about?</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Follow up on the budget approval"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Sam, Finance Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Key details (optional)</Label>
            <Textarea
              id="details"
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Dates, numbers, context, what you want the reader to do next"
            />
          </div>

          <Button className="w-full" onClick={submit} disabled={loading}>
            <Sparkles className="size-4" />
            {loading ? "Writing draft…" : "Generate email"}
          </Button>
        </div>

        <OutputPanel
          value={output}
          onChange={setOutput}
          onReset={() => setOutput("")}
          loading={loading}
          placeholder="Your generated email will appear here."
        />
      </div>

      <Disclaimer className="mt-6" />
    </AppShell>
  );
}
