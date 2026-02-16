import { Outlet, useLocation, Navigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import SecondaryPanel from "@/components/SecondaryPanel";
import { steps } from "./config";

const ResumeBuilderLayout = () => {
    const { pathname } = useLocation();
    const currentPath = pathname.split("/").pop();

    // Find current step index
    const currentStepIndex = steps.findIndex((step) => step.path === currentPath);

    // Handle /rb root or invalid paths (optional, but good for safety)
    if (pathname === "/rb" || pathname === "/rb/") {
        return <Navigate to="/rb/01-problem" replace />;
    }

    // If on proof page or unknown step, handle gracefully
    // For proof page, we might want a different layout or just hide the panel?
    // The requirement says "Use the same Premium Layout system" for the route rail.
    // Proof page is likely valid.
    const isProofPage = currentPath === "proof";

    const currentStep = currentStepIndex !== -1 ? steps[currentStepIndex] : null;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <TopBar
                projectName="AI Resume Builder"
                currentStep={currentStepIndex !== -1 ? currentStepIndex + 1 : 8}
                totalSteps={8}
                status="In Progress" // You might want to make this dynamic later
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Main Workspace - 70% */}
                <main className={`flex-1 overflow-y-auto ${!isProofPage ? 'w-[70%]' : 'w-full'}`}>
                    <Outlet />
                </main>

                {/* Secondary Build Panel - 30% */}
                {/* Only show on step pages, maybe not on proof page if not needed, 
            but user asked for "Use the same Premium Layout system" ... 
            "Build panel: ... Copy This Into Lovable textarea"
            The Proof page has specific requirements "Create /rb/proof page: ... inputs for Lovable link..."
            It likely doesn't need the prompt panel.
         */}
                {!isProofPage && currentStep && (
                    <div className="w-[30%] border-l bg-card">
                        <SecondaryPanel
                            stepTitle={currentStep.title}
                            stepDescription={currentStep.subtext}
                            promptText={currentStep.prompt}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeBuilderLayout;
