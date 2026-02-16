import { Check } from "lucide-react";

interface ProofItem {
  label: string;
  completed: boolean;
}

interface ProofFooterProps {
  items: ProofItem[];
  onToggle: (index: number) => void;
}

const ProofFooter = ({ items, onToggle }: ProofFooterProps) => {
  return (
    <footer className="border-t px-sp-4 py-sp-3">
      <div className="flex flex-wrap items-center gap-sp-3">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onToggle(index)}
            className="flex items-center gap-sp-1 font-body text-sm transition-all duration-200 ease-in-out"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-sm border transition-all duration-200 ease-in-out ${item.completed
                ? "border-success bg-success text-success-foreground"
                : "border-border bg-background text-transparent"
                }`}
            >
              <Check className="h-3 w-3" />
            </span>
            <span className={item.completed ? "text-foreground" : "text-muted-foreground"}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default ProofFooter;
