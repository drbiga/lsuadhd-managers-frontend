import { StudentWithSessionData } from "../services/studentService";

interface StudentSelectorProps {
  students: StudentWithSessionData[];
  selectedStudent: StudentWithSessionData;
  onStudentChange: (student: StudentWithSessionData) => void;
}

export function StudentSelector({ students, selectedStudent, onStudentChange }: StudentSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const student = JSON.parse(e.target.value);
    onStudentChange(student);
  };

  return (
    <div className="mb-4">
      <select
        name="student_name" 
        id="student_name"
        className="bg-primary py-2 px-4 border-[1px] border-black dark:border-white rounded-lg"
        onChange={handleChange}
        value={selectedStudent ? JSON.stringify(selectedStudent) : ''}
      >
        {students.map(s => (
          <option 
            className="bg-primary p-2 text-black" 
            key={s.name} 
            value={JSON.stringify(s)}
          >
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
