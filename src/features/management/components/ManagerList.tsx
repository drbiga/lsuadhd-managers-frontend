import { Manager } from "../services/managementService";

interface ManagerListProps {
  managers: Manager[];
}

export function ManagerList({ managers }: ManagerListProps) {
  return (
    <div>
      <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Existing managers</h2>
      <ul>
        {managers.map(m => (
          <li className="mb-4" key={m.name}>
            <p>Manager's name: {m.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}