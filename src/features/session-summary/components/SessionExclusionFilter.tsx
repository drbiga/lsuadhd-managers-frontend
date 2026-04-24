import { Button } from "@/components/ui/button";
import { SessionExclusion, DetailedSessionRecord } from "../services/sessionSummaryService";
import { useSessionExclusionFilter } from "../hooks/useSessionExclusionFilter";

interface SessionExclusionFilterProps {
  detailedSessions: DetailedSessionRecord[];
  exclusions: SessionExclusion[];
  onExclusionsChange: (exclusions: SessionExclusion[]) => void;
}

export function SessionExclusionFilter({
  detailedSessions,
  exclusions,
  onExclusionsChange,
}: SessionExclusionFilterProps) {
  const {
    selectedStudent,
    selectedSessions,
    students,
    studentSessions,
    setSelectedStudent,
    toggleSession,
    addExclusion,
    removeSession,
    removeStudent,
    clearAllExclusions,
  } = useSessionExclusionFilter({
    detailedSessions,
    exclusions,
    onExclusionsChange,
  });

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Exclude Sessions from Statistics</h3>
        {exclusions.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllExclusions} className="text-destructive hover:text-destructive">
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Student</label>
          <select
            value={selectedStudent}
            onChange={(e) => {
              setSelectedStudent(e.target.value);
            }}
            className="h-9 px-3 py-1 rounded-md border border-input bg-background text-foreground text-sm min-w-[140px]"
          >
            <option value="">Choose student</option>
            {students.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {selectedStudent && studentSessions.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Sessions to Exclude</label>
            <div className="flex flex-wrap gap-1">
              {studentSessions.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => toggleSession(num)}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    selectedSessions.includes(num)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-accent"
                  }`}
                >
                  S{num}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={addExclusion}
          disabled={!selectedStudent || selectedSessions.length === 0}
        >
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {exclusions.map(exc => (
          <div key={exc.studentName} className="flex items-center gap-1 bg-secondary/50 rounded-md px-2 py-1">
            <span className="text-sm font-medium text-foreground">{exc.studentName}:</span>
            {exc.sessionNumbers.map(num => (
              <span key={num} className="inline-flex items-center gap-0.5 bg-destructive/20 text-destructive text-xs px-1.5 py-0.5 rounded">
                S{num}
                <button type="button" onClick={() => removeSession(exc.studentName, num)} className="hover:text-destructive/70">
                  <p>x</p>
                </button>
              </span>
            ))}
            <button type="button" onClick={() => removeStudent(exc.studentName)} className="ml-1 text-muted-foreground hover:text-destructive">
              <p>X</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
