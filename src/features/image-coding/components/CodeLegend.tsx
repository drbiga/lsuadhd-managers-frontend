import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { errorMessage } from "../lib/errors";
import { formatDateTime } from "../lib/format";
import type { ImageCode } from "../types";

type CodeLegendProps = {
  codes: ImageCode[];
  loading: boolean;
  error: string | null;
  onSelectImages: (code: ImageCode) => void;
  onRenameCode: (codeId: string, text: string) => Promise<void>;
  onDeleteCode: (codeId: string) => Promise<void>;
  disabled: boolean;
};

export function CodeLegend({
  codes,
  loading,
  error,
  onSelectImages,
  onRenameCode,
  onDeleteCode,
  disabled,
}: CodeLegendProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStartEditing = (code: ImageCode) => {
    setEditingId(code.id);
    setEditText(code.text);
    setActionError(null);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSave = async (codeId: string) => {
    const text = editText.trim();
    if (!text) {
      return;
    }

    setPendingId(codeId);
    setActionError(null);

    try {
      await onRenameCode(codeId, text);
      setEditingId(null);
      setEditText("");
    } catch (renameError) {
      setActionError(errorMessage(renameError, "Could not update this code."));
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (codeId: string) => {
    if (!window.confirm("Delete this code? This cannot be undone.")) {
      return;
    }

    setPendingId(codeId);
    setActionError(null);

    try {
      await onDeleteCode(codeId);
    } catch (deleteError) {
      setActionError(errorMessage(deleteError, "Could not delete this code."));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">Codes ({codes.length})</h2>
        {loading && <span className="text-xs text-muted-foreground">Loading...</span>}
      </div>

      <p className="text-xs text-muted-foreground">
        Created, edited and deleted codes are saved to the backend and cached in this browser.
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {actionError && <p className="text-sm text-destructive">{actionError}</p>}

      {codes.length === 0 && !loading ? (
        <p className="text-sm text-muted-foreground">No codes yet. Select images and add the first one.</p>
      ) : (
        <ul className="flex min-h-0 max-h-[55vh] flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {codes.map((code) => {
            const isEditing = editingId === code.id;
            const isBusy = pendingId === code.id;

            return (
              <li key={code.id} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
                <div className="flex items-start gap-2">
                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                    style={{ backgroundColor: code.color }}
                  />

                  {isEditing ? (
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <textarea
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        rows={3}
                        className="w-full resize-y rounded-md border border-input bg-background px-2 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(code.id)} disabled={isBusy || !editText.trim()}>
                          {isBusy ? "Saving..." : "Save"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEditing} disabled={isBusy}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm text-foreground">
                        {code.text}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Edit code text"
                          onClick={() => handleStartEditing(code)}
                          disabled={disabled || isBusy}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Delete code"
                          onClick={() => handleDelete(code.id)}
                          disabled={disabled || isBusy}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {code.imageNames.length} image{code.imageNames.length === 1 ? "" : "s"} &middot; created{" "}
                    {formatDateTime(code.createdAt)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectImages(code)}
                    disabled={disabled || code.imageNames.length === 0}
                  >
                    Show images
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
