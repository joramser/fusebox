import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { cn } from "@web/lib/utils";
import { Badge } from "./ui/badge";

export type StatusBadgeProps = {
  status: ProcessSchema["spawn"]["status"];
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === "init") {
    return null;
  }

  return (
    <Badge variant="secondary" className="flex gap-2 items-center">
      <span
        className={cn("rounded-full size-2 bg-muted-foreground", {
          "bg-amber-400": status === "killed",
          "bg-emerald-400 animate-pulse duration-200": status === "running",
        })}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
