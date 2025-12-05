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
      <h2 className="text-muted-foreground text-2xl mb-8 font-medium">
        Create new student
      </h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          placeholder="Name"
          {...register("name", { required: true })}
        />
        <select
          className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
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
          className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
          {...register("surveyId", { required: false })}
        />
        <div>
          <button
            type="submit"
            className="float-right bg-accent text-accent-foreground hover:bg-accent/80 font-medium rounded-lg px-5 py-2.5 transition-colors duration-150"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}