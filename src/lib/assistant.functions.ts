import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string().optional(),
  tone: z.enum(["Professional", "Friendly", "Persuasive"]),
  details: z.string().optional(),
});

const NotesInput = z.object({ notes: z.string().min(1) });

const PlanInput = z.object({
  tasks: z.string().min(1),
  horizon: z.enum(["Daily", "Weekly"]),
  hours: z.string().optional(),
});

async function runPrompt(system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured.");

  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const { streamText } = await import("ai");

  const gateway = createLovableAiGatewayProvider(key);
  const result = streamText({
    model: gateway("google/gemini-3.7-flash"),
    system,
    prompt,
  });

  try {
    return await result.text;
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode;
    if (status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (status === 402) throw new Error("AI credits are exhausted. Please add credits in Lovable.");
    throw new Error(error instanceof Error ? error.message : "AI request failed.");
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    runPrompt(
      "You are an expert workplace communication assistant. Write clear, concise, ready-to-send business emails. Output plain text only: a 'Subject:' line, then a blank line, then the email body with a greeting, 1-3 short paragraphs and a sign-off. No markdown, no commentary, no placeholders other than [Your Name] when the sender is unknown.",
      [
        `Tone: ${data.tone}`,
        `Recipient: ${data.recipient?.trim() || "the relevant colleague"}`,
        `Purpose: ${data.purpose}`,
        data.details?.trim() ? `Key details to include:\n${data.details}` : "",
        "Write the email now.",
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) =>
    runPrompt(
      "You are a meeting analyst. Summarize meeting notes accurately and never invent facts. Output plain text using exactly these uppercase section headers, each on its own line, in this order: SUMMARY, KEY POINTS, ACTION ITEMS, DECISIONS, DEADLINES. Use '- ' bullets under each header. Action items use the format '- Owner — task'. Deadlines use '- Date/timeframe — what is due'. If a section has nothing, write '- None mentioned'. No markdown symbols.",
      `Meeting notes:\n\n${data.notes}`,
    ),
  );

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) =>
    runPrompt(
      "You are a productivity planner. Turn a raw task list into a realistic, prioritized schedule. Output plain text only. For a daily plan use time blocks (e.g. '09:00-10:30 — task') grouped under headers MORNING, AFTERNOON, WRAP-UP. For a weekly plan use headers MONDAY..FRIDAY with '- ' bullets. Always end with a section called PRIORITY NOTES containing 2-4 bullets on sequencing, risks and what to drop if time runs short. Respect the available hours and never overload a day.",
      [
        `Planning horizon: ${data.horizon}`,
        data.hours?.trim() ? `Available focus time: ${data.hours}` : "",
        `Tasks and priorities:\n${data.tasks}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );
