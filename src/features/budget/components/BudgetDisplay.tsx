import { Budget } from "../services/budgetService";

interface BudgetDisplayProps {
  budget: Budget | undefined;
}

export function BudgetDisplay({ budget }: BudgetDisplayProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-8 mb-2">Current Budget</h2>
      {budget && (
        <ul className="text-sm bg-slate-800 max-w-md p-4 rounded-lg">
          <li><strong>Set By:</strong> {budget.manager_name}</li>
          <li><strong>Budget Value:</strong> ${budget.value.toFixed(2)}</li>
          <li><strong>Date/Time Set:</strong> {new Date(budget.date_set).toLocaleString('en-US', {
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
      {!budget && <p className="mt-4">No active budget.</p>}
    </div>
  );
}