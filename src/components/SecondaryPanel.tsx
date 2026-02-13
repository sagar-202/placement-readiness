import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, AlertCircle, Camera } from "lucide-react";

interface SecondaryPanelProps {
  stepTitle: string;
  stepDescription: string;
  promptText: string;
}

const SecondaryPanel = ({ stepTitle, stepDescription, promptText }: SecondaryPanelProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
  };

  return (
    <aside className="flex flex-col gap-sp-3 border-l p-sp-3">
      <div>
        <h3 className="font-heading text-foreground">{stepTitle}</h3>
        <p className="mt-sp-1 text-sm text-muted-foreground">{stepDescription}</p>
      </div>

      <div className="rounded-md border bg-secondary/50 p-sp-2">
        <p className="font-body text-sm text-foreground leading-relaxed">{promptText}</p>
      </div>

      <div className="flex flex-col gap-sp-1">
        <Button variant="default" size="sm" onClick={handleCopy}>
          <Copy className="mr-1" /> Copy Prompt
        </Button>
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-1" /> Build in Lovable
        </Button>
        <Button variant="success" size="sm">
          <Check className="mr-1" /> It Worked
        </Button>
        <Button variant="outline" size="sm">
          <AlertCircle className="mr-1" /> Error
        </Button>
        <Button variant="ghost" size="sm">
          <Camera className="mr-1" /> Add Screenshot
        </Button>
      </div>
    </aside>
  );
};

export default SecondaryPanel;
