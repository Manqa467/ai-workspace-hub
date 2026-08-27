import { Check, Copy, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  value,
  onChange,
  onReset,
  loading,
  placeholder,
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  onReset?: () => void;
  loading?: boolean;
  placeholder: string;
  rows?: number;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="surface-panel flex h-full flex-col rounded-2xl border border-border p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">AI output</h2>
          <p className="text-xs text-muted-foreground">Editable — refine it before you use it.</p>
        </div>
        <div className="flex gap-2">
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset} disabled={!value}>
              <RotateCcw className="size-3.5" /> Clear
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={copy} disabled={!value}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col gap-3 py-6">
          {[90, 75, 96, 60, 84].map((w, i) => (
            <div
              key={i}
              className="h-3 animate-pulse rounded bg-muted"
              style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="flex-1 resize-y whitespace-pre-wrap border-border bg-background/40 font-mono text-[13px] leading-relaxed"
        />
      )}
    </div>
  );
}
