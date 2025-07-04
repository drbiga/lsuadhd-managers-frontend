import { SessionGroup } from "@/features/session-groups/services/sessionGroupsService";
import { FieldValues, useForm } from "react-hook-form";

interface StudentFormProps {
  sessionGroups: SessionGroup[];
  onSubmitStudent: (data: FieldValues) => Promise<void>;
}

export function StudentForm({ sessionGroups, onSubmitStudent }: StudentFormProps) {
  const { reset, handleSubmit, register } = useForm();

  const handleFormSubmit = async (data: FieldValues) => {
    await onSubmitStudent(data);
    reset();
  };

  return (
    <div className="mb-8 flex flex-col">
      <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">
        Create new student
      </h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <input
          type="text"
          className="bg-accent p-2 rounded-lg"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <select
          className="bg-primary p-1 border-[1px] border-slate-400 dark:border-slate-600 rounded-md"
          id="sessionGroupName"
          aria-placeholder="Select a session group"
          {...register("sessionGroupName", { required: true })}
        >
          {sessionGroups.map((sg) => (
            <option key={sg.group_name} value={sg.group_name}>
              {sg.group_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Survey ID (Optional)"
          className="bg-accent p-2 rounded-lg"
          {...register("surveyId", { required: false })}
        />
        <div>
          <button
            type="submit"
            className="float-right bg-accent p-2 rounded-lg hover:bg-accent-foreground hover:text-accent transition-all duration-100"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}