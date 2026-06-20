import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TelemetryErrorRecord } from "../services/telemetryService";

interface ErrorHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: TelemetryErrorRecord[];
  loading: boolean;
}

export function ErrorHistoryDialog({ open, onOpenChange, errors, loading }: ErrorHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recent errors</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading…</p>
        ) : errors.length === 0 ? (
          <p>No errors found within this time window.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {errors.map((error, idx) => (
              <li key={idx} className="space-y-1 border p-1 rounded">
                <div>
                  {new Date(error.requestTimestamp).toLocaleString()} - {error.responseStatus} {error.httpMethod} {error.endpoint}
                </div>

                <div>Username: {error.username ?? "unauthenticated"}</div>

                {error.errorDetail && (
                  <div>Error Detail: {error.errorDetail}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
