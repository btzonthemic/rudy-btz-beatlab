import { Button } from "@/components/ui/button";
import { Database, FileUp, Code, Table, Key, Settings } from "lucide-react";

interface AIActionsProps {
  isProcessing: boolean;
  onAction: (action: string) => void;
}

export const AIActions = ({ isProcessing, onAction }: AIActionsProps) => {
  const actions = [
    { id: "database", icon: Database, label: "Database" },
    { id: "storage", icon: FileUp, label: "Storage" },
    { id: "functions", icon: Code, label: "Functions" },
    { id: "tables", icon: Table, label: "Tables" },
    { id: "api-keys", icon: Key, label: "API Keys" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {actions.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="outline"
          onClick={() => onAction(id)}
          disabled={isProcessing}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};