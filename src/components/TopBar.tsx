import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  projectName: string;
  currentStep: number;
  totalSteps: number;
  status: "Not Started" | "In Progress" | "Shipped";
}

const statusStyles: Record<TopBarProps["status"], string> = {
  "Not Started": "bg-secondary text-secondary-foreground",
  "In Progress": "bg-warning text-warning-foreground",
  "Shipped": "bg-success text-success-foreground",
};

const TopBar = ({ projectName, currentStep, totalSteps, status }: TopBarProps) => {
  return (
    <header className="flex items-center justify-between border-b px-sp-4 py-sp-2">
      <span className="font-body text-sm font-semibold tracking-wide text-foreground">
        {projectName}
      </span>
      <span className="font-body text-sm text-muted-foreground">
        Step {currentStep} / {totalSteps}
      </span>
      <Badge className={`${statusStyles[status]} rounded-md px-sp-2 py-1 text-xs font-medium`}>
        {status}
      </Badge>
    </header>
  );
};

export default TopBar;
