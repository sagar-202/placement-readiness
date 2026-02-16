import { useState, useEffect } from "react";
import ContextHeader from "@/components/ContextHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Check if Label exists, otherwise use label tag
import { steps } from "./config";
import { Check, Copy, ExternalLink, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProofPage = () => {
    const { toast } = useToast();
    const [stepStatus, setStepStatus] = useState<boolean[]>(new Array(8).fill(false));
    const [links, setLinks] = useState({
        lovable: "",
        github: "",
        deploy: ""
    });

    useEffect(() => {
        // Check local storage for each step
        const newStatus = steps.map((_, index) => {
            return !!localStorage.getItem(`rb_step_${index + 1}_artifact`);
        });
        setStepStatus(newStatus);

        // Load saved links
        const savedLinks = localStorage.getItem("rb_proof_links");
        if (savedLinks) {
            setLinks(JSON.parse(savedLinks));
        }
    }, []);

    const handleLinkChange = (field: keyof typeof links, value: string) => {
        const newLinks = { ...links, [field]: value };
        setLinks(newLinks);
        localStorage.setItem("rb_proof_links", JSON.stringify(newLinks));
    };

    const handleCopy = () => {
        const submission = `
Project: AI Resume Builder
Status: ${stepStatus.every(Boolean) ? "Complete" : "In Progress"}

Links:
- Lovable: ${links.lovable}
- GitHub: ${links.github}
- Deploy: ${links.deploy}

Steps Completed: ${stepStatus.filter(Boolean).length}/8
        `.trim();

        navigator.clipboard.writeText(submission);
        toast({
            title: "Copied!",
            description: "Submission details copied to clipboard.",
        });
    };

    const allStepsComplete = stepStatus.every(Boolean);
    const allLinksFilled = Object.values(links).every(l => l.trim().length > 0);

    return ( // Added overflow-y-auto to allow scrolling on small screens or high zoom
        <div className="flex flex-col h-full overflow-y-auto">
            <ContextHeader headline="Proof of Work" subtext="Verify your progress and submit your project." />

            <div className="p-6 max-w-4xl space-y-8">

                {/* Step Status Grid */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold">Step Completion Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.path}
                                className={`p-4 rounded-lg border flex items-center justify-between ${stepStatus[index] ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                                    }`}
                            >
                                <span className="text-sm font-medium">
                                    {index + 1}. {step.title.split(". ")[1]}
                                </span>
                                {stepStatus[index] ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <span className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Project Links */}
                <section className="space-y-6">
                    <h3 className="text-lg font-semibold">Project Links</h3>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Lovable Project Link</label>
                            <Input
                                placeholder="https://lovable.dev/..."
                                value={links.lovable}
                                onChange={(e) => handleLinkChange("lovable", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">GitHub Repository</label>
                            <Input
                                placeholder="https://github.com/..."
                                value={links.github}
                                onChange={(e) => handleLinkChange("github", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Deployed Application URL</label>
                            <Input
                                placeholder="https://..."
                                value={links.deploy}
                                onChange={(e) => handleLinkChange("deploy", e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <div className="pt-4 flex items-center justify-end gap-4">
                    {!allStepsComplete && (
                        <p className="text-sm text-yellow-600">
                            Complete all steps to finalize submission.
                        </p>
                    )}
                    <Button
                        onClick={handleCopy}
                        disabled={!allLinksFilled}
                        className="w-full sm:w-auto gap-2"
                    >
                        <Trophy className="w-4 h-4" />
                        Copy Final Submission
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProofPage;
