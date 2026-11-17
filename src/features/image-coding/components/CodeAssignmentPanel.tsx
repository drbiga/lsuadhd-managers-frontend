import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { errorMessage } from "../lib/errors";

type CodeAssignmentPanelProps = {
  selectedCount: number;
  onCreateCode: (text: string) => Promise<void>;
  onClearSelection: () => void;
  disabled: boolean;
};

export function CodeAssignmentPanel({
  selectedCount,
  onCreateCode,
  onClearSelection,
  disabled,
}: CodeAssignmentPanelProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = selectedCount > 0 && text.trim().length > 0 && !isSubmitting && !disabled;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreateCode(text.trim());
      setText("");
    } catch (submitError) {
      setError(errorMessage(submitError, "Could not save this code."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex shrink-0 flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">Assign a code</h2>
          <p className="text-sm text-muted-foreground">
            {selectedCount > 0
              ? `${selectedCount} image${selectedCount === 1 ? "" : "s"} currently selected.`
              : "Select one or more images to create a code."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          disabled={disabled || selectedCount === 0}
          className="shrink-0"
        >
          Clear selection
        </Button>
      </div>

      {selectedCount > 0 && (
        <>
          <Label htmlFor="image-code-text">Code text</Label>
          <textarea
            id="image-code-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            disabled={disabled || isSubmitting}
            placeholder="Describe the behaviour or pattern you see. Short labels and long notes are both fine."
            className="min-h-[120px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <Button onClick={handleSubmit} disabled={!canSubmit}>
            <Plus className="h-4 w-4" />
            {isSubmitting
              ? "Saving..."
              : `Add code to ${selectedCount} image${selectedCount === 1 ? "" : "s"}`}
          </Button>
        </>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        A code can contain many images, and an image can belong to many codes. New codes are saved to the backend for
        this session; the legend keeps a local cache so it can show them again after a reload.
      </p>
    </section>
  );
}
