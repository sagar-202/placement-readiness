
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Copy, Trophy, AlertCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { isChecklistComplete, STORAGE_KEY as CHECKLIST_KEY } from "@/lib/checklist-logic";
import { Layout } from "@/components/layout/Layout";
import { SecondaryPanel } from "@/components/layout/SecondaryPanel";

const PROOF_STORAGE_KEY = "prp_final_submission";

const STEPS = [
    { id: "design", label: "Design System Foundation" },
    { id: "practice", label: "Practice Interface" },
    { id: "assessments", label: "Assessment Logic" },
    { id: "resources", label: "Resources & History" },
    { id: "profile", label: "Profile Management" },
    { id: "hardening", label: "Platform Hardening" },
];

interface ProofData {
    lovableUrl: string;
    githubUrl: string;
    deployedUrl: string;
    manualSteps: Record<string, boolean>;
}

const ProofPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<ProofData>({
        lovableUrl: "",
        githubUrl: "",
        deployedUrl: "",
        manualSteps: {},
    });
    const [checklistPassed, setChecklistPassed] = useState(false);

    useEffect(() => {
        // Load saved data
        const saved = localStorage.getItem(PROOF_STORAGE_KEY);
        if (saved) {
            setData(JSON.parse(saved));
        }

        // Check checklist status
        const checklistSaved = localStorage.getItem(CHECKLIST_KEY);
        if (checklistSaved) {
            const items = JSON.parse(checklistSaved);
            setChecklistPassed(isChecklistComplete(items));
        }
    }, []);

    const handleSave = (newData: ProofData) => {
        setData(newData);
        localStorage.setItem(PROOF_STORAGE_KEY, JSON.stringify(newData));
    };

    const handleStepToggle = (id: string, checked: boolean) => {
        const newSteps = { ...data.manualSteps, [id]: checked };
        handleSave({ ...data, manualSteps: newSteps });
    };

    const handleInputChange = (field: keyof ProofData, value: string) => {
        handleSave({ ...data, [field]: value });
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const manualStepsComplete = STEPS.every(s => data.manualSteps[s.id]);
    const urlsValid = isValidUrl(data.lovableUrl) && isValidUrl(data.githubUrl) && isValidUrl(data.deployedUrl);
    const isShipped = manualStepsComplete && checklistPassed && urlsValid;

    const handleCopy = () => {
        if (!isShipped) {
            toast.error("Complete all requirements to copy submission.");
            return;
        }

        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${data.lovableUrl}
GitHub Repository: ${data.githubUrl}
Live Deployment: ${data.deployedUrl}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
`.trim();

        navigator.clipboard.writeText(text);
        toast.success("Submission copied to clipboard!");
    };

    return (
        <Layout
            projectName="KodNest Premium Build"
            currentStep={5}
            totalSteps={5}
            status={isShipped ? "Shipped" : "In Progress"}
            title="Proof & Submission"
            description="Finalize your build and generate your proof of work."
            stepLabel="Step 5"
            sidebar={
                <SecondaryPanel
                    stepExplanation="You've reached the final step. Verify your implementation against the checklist and provide the necessary links to your deployed application."
                    prompt="Verify all steps and provide your project links. Ensure all checklist items are passed and your URLs are valid."
                    onCopy={handleCopy}
                    onBuild={() => toast.info("Build logic triggered")}
                    onSuccess={() => toast.success("Marked as working")}
                    onError={() => toast.error("Marked as error")}
                    onScreenshot={() => toast.info("Screenshot tool triggered")}
                />
            }
        >
            <div className="space-y-8">
                {isShipped && (
                    <Card className="bg-success/5 border-success/50">
                        <CardContent className="pt-6 flex gap-4">
                            <Trophy className="h-12 w-12 text-success shrink-0" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">You built a real product.</h3>
                                <p className="text-muted-foreground">
                                    Not a tutorial. Not a clone. A structured tool that solves a real problem.
                                    This is your proof of work.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="mb-6">
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>

                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Step Completion</CardTitle>
                            <CardDescription>Confirm implementation of core modules.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {STEPS.map((step) => (
                                <div key={step.id} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={step.id}
                                        checked={!!data.manualSteps[step.id]}
                                        onCheckedChange={(c) => handleStepToggle(step.id, c as boolean)}
                                    />
                                    <Label htmlFor={step.id} className="cursor-pointer">{step.label}</Label>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-border space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`h-4 w-4 rounded-sm border ${checklistPassed ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                                        {checklistPassed && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                                    </div>
                                    <span className={checklistPassed ? "" : "text-muted-foreground"}>
                                        Test Checklist (10/10)
                                    </span>
                                    {!checklistPassed && (
                                        <Button variant="link" size="sm" className="h-auto p-0 ml-auto" onClick={() => window.open("/prp/07-test", "_self")}>
                                            Fix <ExternalLink className="h-3 w-3 ml-1" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Artifacts</CardTitle>
                            <CardDescription>Provide links to your proof.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Lovable Project Link</Label>
                                <Input
                                    placeholder="https://lovable.dev/..."
                                    value={data.lovableUrl}
                                    onChange={(e) => handleInputChange("lovableUrl", e.target.value)}
                                    className={data.lovableUrl && !isValidUrl(data.lovableUrl) ? "border-destructive" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>GitHub Repository</Label>
                                <Input
                                    placeholder="https://github.com/..."
                                    value={data.githubUrl}
                                    onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                                    className={data.githubUrl && !isValidUrl(data.githubUrl) ? "border-destructive" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Deployed URL</Label>
                                <Input
                                    placeholder="https://vercel.app/..."
                                    value={data.deployedUrl}
                                    onChange={(e) => handleInputChange("deployedUrl", e.target.value)}
                                    className={data.deployedUrl && !isValidUrl(data.deployedUrl) ? "border-destructive" : ""}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Final Submission</CardTitle>
                            <CardDescription>Generate your submission block.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCopy}
                                disabled={!isShipped}
                            >
                                {isShipped ? (
                                    <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy Final Submission
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        Complete Requirements to Copy
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default ProofPage;
