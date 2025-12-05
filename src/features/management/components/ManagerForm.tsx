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
      <h2 className="text-muted-foreground text-2xl mb-8 font-medium">Create new manager</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <div>
          <Button 
            type="submit" 
            className="float-right"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}