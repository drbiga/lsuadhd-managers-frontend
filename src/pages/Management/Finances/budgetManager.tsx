import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useGetBudget } from "@/hooks/useGetBudget";
import { useSetBudget } from "@/hooks/useSetBudget";
import managementService, { Manager } from "@/services/managementService";

export default function BudgetManager() {
  const { budget } = useGetBudget();
  const { setBudget } = useSetBudget();

  const [managers, setManagers] = useState<Manager[]>([]);
  const [managerName, setManagerName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const managersResponse = await managementService.getManagers();
        setManagers(managersResponse);
      } catch (err) {
        toast.error("Failed to get managers");
      }
    })();
  }, []);

  const handleSubmit = async () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      toast.error("Please enter a valid dollar amount");
      return;
    }

    const success = await setBudget({ manager_name: managerName, value: val });
    if (success) {
      toast.success("Budget set successfully");
      setManagerName("");
      setValue("");
      window.location.reload();
    } else {
      toast.error("Failed to set budget");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Set New Budget</h2>
      <div className="max-w-sm space-y-4">
        <div>
          <Label className="block mb-3 text-base">Manager:</Label>
          <select
            className="bg-primary p-2 border-[1px] border-slate-400 dark:border-slate-600 rounded-md"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
          >
            <option value="">Select manager</option>
            {managers.map((m) => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="block mb-3 text-base">Budget ($):</Label>
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button 
          variant="outline"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>

      <h2 className="text-xl font-semibold mt-8">Current Budget</h2>
      {budget && (
        <ul className="text-sm bg-slate-800 max-w-md p-4 rounded-lg">
          <li><strong>Set By:</strong> {budget.manager_name}</li>
          <li><strong>Budget Value:</strong> ${budget.value.toFixed(2)}</li>
          <li><strong>Date Set:</strong> {new Date(budget.date_set).toLocaleDateString()}</li>
        </ul>
      )}
      {!budget && <p className="mt-4">No active budget.</p>}
    </div>
  );
}