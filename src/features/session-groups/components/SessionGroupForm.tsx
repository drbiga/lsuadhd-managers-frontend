import { FieldValues, useForm } from "react-hook-form";

interface SessionGroupFormProps {
  onSubmit: (data: FieldValues) => Promise<void>;
}

export function SessionGroupForm({ onSubmit }: SessionGroupFormProps) {
  const { register, handleSubmit } = useForm();

  return (
    <div className="max-w-[600px]">
      <h2 className="text-muted-foreground text-2xl mb-8 font-medium">
        Create new session group
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input type="text"
          placeholder="Group name"
          className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          {...register('group_name', { required: true })}
          required
        />
        <input type="text"
          placeholder="Public Link"
          className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          {...register('public_link', { required: true })}
          required
        />
        <div>
          <button type="submit" className="float-right bg-accent text-accent-foreground hover:bg-accent/80 font-medium rounded-lg px-5 py-2.5 transition-colors duration-150">Create</button>
        </div>
      </form>
    </div>
  );
}