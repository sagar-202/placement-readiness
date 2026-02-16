
import { Button } from "@/components/ui/button";
import { Copy, Terminal, CheckCircle2, AlertCircle, ImagePlus } from "lucide-react";

interface SecondaryPanelProps {
    stepExplanation: string;
    prompt: string;
    onCopy?: () => void;
    onBuild?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    onScreenshot?: () => void;
}

export const SecondaryPanel = ({
    stepExplanation,
    prompt,
    onCopy,
    onBuild,
    onSuccess,
    onError,
    onScreenshot,
}: SecondaryPanelProps) => {
    return (
        <div className="w-full h-full bg-secondary/30 border-l border-border p-sp-6 flex flex-col gap-sp-6">
            <div className="space-y-2">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                    Step Guidance
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {stepExplanation}
                </p>
            </div>

            <div className="space-y-3 bg-card border border-border rounded-md p-sp-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Prompt
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={onCopy}
                    >
                        <Copy className="w-3 h-3 text-muted-foreground" />
                    </Button>
                </div>
                <div className="bg-muted/50 p-3 rounded text-xs font-mono text-muted-foreground break-words whitespace-pre-wrap">
                    {prompt}
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
                <Button onClick={onCopy} className="w-full justify-start" variant="outline">
                    <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                </Button>
                <Button onClick={onBuild} className="w-full justify-start" variant="default">
                    <Terminal className="mr-2 h-4 w-4" /> Build in Lovable
                </Button>
                <div className="grid grid-cols-2 gap-3">
                    <Button onClick={onSuccess} variant="outline" className="w-full justify-start text-success hover:text-success hover:bg-success/10 border-success/20">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> It Worked
                    </Button>
                    <Button onClick={onError} variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                        <AlertCircle className="mr-2 h-4 w-4" /> Error
                    </Button>
                </div>
                <Button onClick={onScreenshot} variant="outline" className="w-full justify-start">
                    <ImagePlus className="mr-2 h-4 w-4" /> Add Screenshot
                </Button>
            </div>
        </div>
    );
};
