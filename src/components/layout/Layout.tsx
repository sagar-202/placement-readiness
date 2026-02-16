
import { ReactNode } from "react";
import TopBar from "@/components/TopBar";
import { ContextHeader } from "./ContextHeader";
import { ProofFooter } from "./ProofFooter";

interface LayoutProps {
    children: ReactNode;
    sidebar?: ReactNode;
    projectName?: string;
    currentStep?: number;
    totalSteps?: number;
    status?: "Not Started" | "In Progress" | "Shipped";
    title?: string;
    description?: string;
    stepLabel?: string;
}

export const Layout = ({
    children,
    sidebar,
    projectName = "KodNest Premium Build",
    currentStep = 1,
    totalSteps = 5,
    status = "In Progress",
    title = "Context Header",
    description = "Description of the current step.",
    stepLabel = "Step 1",
}: LayoutProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <TopBar
                projectName={projectName}
                currentStep={currentStep}
                totalSteps={totalSteps}
                status={status}
            />

            <ContextHeader title={title} description={description} step={stepLabel} />

            <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full border-x border-border/40">
                <div className="w-full md:w-[70%] p-sp-6 md:p-sp-8">
                    {children}
                </div>

                {sidebar && (
                    <aside className="w-full md:w-[30%] border-t md:border-t-0 md:border-l border-border/40">
                        {sidebar}
                    </aside>
                )}
            </main>

            <div className="h-24"></div> {/* Spacer for ProofFooter */}
            <ProofFooter />
        </div>
    );
};
