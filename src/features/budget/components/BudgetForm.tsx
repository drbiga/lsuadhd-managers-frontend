import { useForm, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface BudgetFormProps {
  setBudgetValue: (value: number) => Promise<boolean>;
}

export function BudgetForm({ setBudgetValue }: BudgetFormProps) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const val = parseFloat(data.budget);
    if (isNaN(val)) {
      toast.error("Please enter a valid dollar amount");
      return;
    }

    const valueIsSet = await setBudgetValue(val);
    if (valueIsSet) {
      reset();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">Set New Budget</h2>
      <form className="max-w-sm space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-sm space-y-4">
          <Label htmlFor="budget" className="block mb-3 text-base text-foreground font-medium">Budget ($):</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            {...register("budget", { required: true })}
          />
          <Button 
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}