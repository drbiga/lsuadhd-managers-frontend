import { Budget } from "../services/budgetService";

interface BudgetDisplayProps {
  budget: Budget | undefined;
}

export function BudgetDisplay({ budget }: BudgetDisplayProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Current Budget</h2>
      {budget && (
        <ul className="text-sm bg-card border border-border max-w-md p-6 rounded-xl shadow-sm space-y-2">
          <li className="text-foreground"><strong className="font-semibold">Set By:</strong> {budget.manager_name}</li>
          <li className="text-foreground"><strong className="font-semibold">Budget Value:</strong> ${budget.value.toFixed(2)}</li>
          <li className="text-foreground"><strong className="font-semibold">Date/Time Set:</strong> {new Date(budget.date_set).toLocaleString('en-US', {
            timeZone: 'America/Chicago',
            year: 'numeric',
            month: 'numeric', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          })}</li>
        </ul>
      )}
      {!budget && <p className="mt-4 text-muted-foreground">No active budget.</p>}
    </div>
  );
}