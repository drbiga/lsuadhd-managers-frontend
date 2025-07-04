import { FieldValues, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ManagerFormProps {
  createManager: (data: FieldValues) => Promise<void>;
}

export function ManagerForm({ createManager }: ManagerFormProps) {
  const { reset, handleSubmit, register } = useForm();
  
  const onSubmit = async (data: FieldValues) => {
    await createManager(data);
    reset();
  };

  return (
    <div className="mb-8 flex flex-col">
      <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Create new manager</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          className="bg-accent p-2 rounded-lg"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <div>
          <Button 
            type="submit" 
            variant="outline"
            className="float-right"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}