import { ShieldAlert } from "lucide-react";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 text-xs leading-relaxed text-muted-foreground ${className ?? ""}`}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-foreground/70" />
      <p>
        <span className="font-medium text-foreground">Responsible AI notice.</span> These results are
        AI-generated drafts and can be incomplete or inaccurate. Review names, dates, figures and
        commitments, and never paste confidential information you are not permitted to share.
      </p>
    </div>
  );
}
