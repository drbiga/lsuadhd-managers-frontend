import { Student } from "../services/studentService";

interface StudentSelectorProps {
  students: Student[];
  selectedStudentName: string | null;
  onStudentChange: (studentName: string | null) => void;
}

export function StudentSelector({ students, selectedStudentName, onStudentChange }: StudentSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onStudentChange(value === '' ? null : value);
  };

  return (
    <div className="mb-4">
      <select
        name="student_name" 
        id="student_name"
        className="bg-background text-foreground py-2 px-4 border-[1px] border-border rounded-lg"
        onChange={handleChange}
        value={selectedStudentName || ''}
      >
        <option 
          className="bg-background text-foreground" 
          value=""
        >
          Select a student
        </option>
        {students.map(s => (
          <option 
            className="bg-background text-foreground" 
            key={s.name} 
            value={s.name}
          >
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
