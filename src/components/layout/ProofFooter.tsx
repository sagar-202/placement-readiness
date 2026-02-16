
import { CheckSquare, Square, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ProofItem {
    id: string;
    label: string;
    checked: boolean;
    required?: boolean;
}

interface ProofFooterProps {
    items?: ProofItem[];
    onProofUpdate?: (items: ProofItem[]) => void;
}

const defaultProofItems: ProofItem[] = [
    { id: "ui-built", label: "UI Built", checked: false },
    { id: "logic-working", label: "Logic Working", checked: false },
    { id: "test-passed", label: "Test Passed", checked: false },
    { id: "deployed", label: "Deployed", checked: false },
];

export const ProofFooter = ({ items = defaultProofItems, onProofUpdate }: ProofFooterProps) => {
    const [proofs, setProofs] = useState<ProofItem[]>(items);

    const toggleProof = (id: string) => {
        const newProofs = proofs.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setProofs(newProofs);
        onProofUpdate?.(newProofs);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 px-8 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <span className="text-sm font-serif font-bold tracking-wider text-muted-foreground uppercase">
                        Proof of Work
                    </span>
                    <div className="flex items-center gap-6">
                        {proofs.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleProof(item.id)}
                                className="flex items-center gap-2 group focus:outline-none"
                            >
                                {item.checked ? (
                                    <CheckSquare className="w-5 h-5 text-primary transition-colors" />
                                ) : (
                                    <Square className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                )}
                                <span
                                    className={`text-sm font-medium transition-colors ${item.checked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Placeholder for future actions if needed */}
                </div>
            </div>
        </div>
    );
};
