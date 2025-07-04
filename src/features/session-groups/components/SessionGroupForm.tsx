import { FieldValues, useForm } from "react-hook-form";

interface SessionGroupFormProps {
  onSubmit: (data: FieldValues) => Promise<void>;
}

export function SessionGroupForm({ onSubmit }: SessionGroupFormProps) {
  const { register, handleSubmit } = useForm();

  return (
    <div className="max-w-[600px]">
      <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">
        Create new session group
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input type="text"
          placeholder="Group name"
          className="bg-primary border-[1px] border-slate-200 dark:border-slate-800 p-2 rounded-lg"
          {...register('group_name')}
        />
        <input type="text"
          placeholder="Public Link"
          className="bg-primary border-[1px] border-slate-200 dark:border-slate-800 p-2 rounded-lg"
          {...register('public_link')}
        />
        <div>
          <button type="submit" className="float-right bg-accent p-2 rounded-lg hover:bg-accent-foreground hover:text-accent transition-all duration-100">Create</button>
        </div>
      </form>
    </div>
  );
}