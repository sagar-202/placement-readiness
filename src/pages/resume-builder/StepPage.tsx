import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ContextHeader from "@/components/ContextHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast"; // Adjust path if needed, checked ui folder
import { steps } from "./config";
import { CheckCircle, ArrowRight, Save } from "lucide-react";

// Helper to get step ID from path
const getStepId = (path: string) => path;

const StepPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const currentPath = location.pathname.split("/").pop() || "";

    const currentStepIndex = steps.findIndex(s => s.path === currentPath);
    const step = steps[currentStepIndex];

    const [artifact, setArtifact] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (step) {
            const savedArtifact = localStorage.getItem(`rb_step_${currentStepIndex + 1}_artifact`);
            if (savedArtifact) {
                setArtifact(savedArtifact);
                setIsSaved(true);
            } else {
                setArtifact("");
                setIsSaved(false);
            }
        }
    }, [step, currentStepIndex]);

    const handleSave = () => {
        if (!artifact.trim()) {
            toast({
                title: "Error",
                description: "Artifact content cannot be empty.",
                variant: "destructive"
            });
            return;
        }

        localStorage.setItem(`rb_step_${currentStepIndex + 1}_artifact`, artifact);
        setIsSaved(true);
        toast({
            title: "Success",
            description: "Artifact saved successfully.",
        });
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            navigate(`/rb/${steps[currentStepIndex + 1].path}`);
        } else {
            navigate("/rb/proof");
        }
    };

    if (!step) return <div>Step not found</div>;

    return (
        <div className="flex flex-col h-full">
            <ContextHeader headline={step.headline} subtext={step.subtext} />

            <div className="flex-1 p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Project Artifact
                    </label>
                    <p className="text-sm text-muted-foreground">
                        {step.path === "08-ship" || step.path === "06-build"
                            ? "Paste the link to your work here."
                            : "Enter your deliverables for this step."}
                    </p>
                    <Textarea
                        placeholder="Type your content here..."
                        className="min-h-[300px] font-mono text-sm"
                        value={artifact}
                        onChange={(e) => {
                            setArtifact(e.target.value);
                            setIsSaved(false); // Mark as unsaved on change? Or just keep it. 
                            // If we mark as unsaved, user has to save again to proceed.
                            // Let's keep it simple: if valid text exists, allow save.
                        }}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Artifact
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!isSaved} // Gating: must be saved
                        variant={isSaved ? "default" : "secondary"}
                        className="gap-2"
                    >
                        Next Step
                        <ArrowRight className="w-4 h-4" />
                    </Button>

                    {isSaved && (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Saved</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepPage;
