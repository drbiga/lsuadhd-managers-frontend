import { Manager } from "../services/managementService";

interface ManagerListProps {
  managers: Manager[];
}

export function ManagerList({ managers }: ManagerListProps) {
  return (
    <div>
      <h2 className="text-muted-foreground text-2xl mb-8 font-medium">Existing managers</h2>
      <ul>
        {managers.map(m => (
          <li className="mb-4 p-4 border border-border rounded-lg bg-card shadow-sm" key={m.name}>
            <p className="text-foreground"><span className="font-semibold">Manager's name:</span> {m.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}