import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UP":
        return <CheckCircle className="w-4 h-4" />;
      case "DOWN":
        return <XCircle className="w-4 h-4" />;
      case "OUT_OF_SERVICE":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Badge
      variant={
        status === "UP"
          ? "default"
          : status === "DOWN"
          ? "destructive"
          : "secondary"
      }
      className="flex items-center gap-1"
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
}
