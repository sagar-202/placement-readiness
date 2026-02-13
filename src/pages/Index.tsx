import { useState } from "react";
import TopBar from "@/components/TopBar";
import ContextHeader from "@/components/ContextHeader";
import SecondaryPanel from "@/components/SecondaryPanel";
import ProofFooter from "@/components/ProofFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [proofItems, setProofItems] = useState([
    { label: "UI Built", completed: false },
    { label: "Logic Working", completed: false },
    { label: "Test Passed", completed: false },
    { label: "Deployed", completed: false },
  ]);

  const handleToggle = (index: number) => {
    setProofItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar
        projectName="KodNest Premium Build System"
        currentStep={1}
        totalSteps={6}
        status="In Progress"
      />

      <ContextHeader
        headline="Design System Foundation"
        subtext="Establish the visual language that governs every component, layout, and interaction."
      />

      <div className="flex flex-1">
        {/* Primary Workspace — 70% */}
        <main className="flex-[7] p-sp-4">
          <div className="grid gap-sp-3">
            {/* Color Palette */}
            <Card className="border p-sp-3">
              <h3 className="font-heading text-foreground">Color Palette</h3>
              <p className="mt-sp-1 text-sm text-muted-foreground">
                Four colors. No more. Every surface, every interaction draws from this palette.
              </p>
              <div className="mt-sp-3 flex gap-sp-2">
                <div className="flex flex-col items-center gap-sp-1">
                  <div className="h-16 w-16 rounded-md bg-background border" />
                  <span className="text-xs text-muted-foreground">Background</span>
                </div>
                <div className="flex flex-col items-center gap-sp-1">
                  <div className="h-16 w-16 rounded-md bg-foreground" />
                  <span className="text-xs text-muted-foreground">Foreground</span>
                </div>
                <div className="flex flex-col items-center gap-sp-1">
                  <div className="h-16 w-16 rounded-md bg-primary" />
                  <span className="text-xs text-muted-foreground">Accent</span>
                </div>
                <div className="flex flex-col items-center gap-sp-1">
                  <div className="h-16 w-16 rounded-md bg-secondary" />
                  <span className="text-xs text-muted-foreground">Secondary</span>
                </div>
              </div>
            </Card>

            {/* Typography */}
            <Card className="border p-sp-3">
              <h3 className="font-heading text-foreground">Typography</h3>
              <div className="mt-sp-3 space-y-sp-2">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Heading — DM Serif Display</span>
                  <h2 className="font-heading mt-sp-1">The quick brown fox jumps over the lazy dog</h2>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Body — DM Sans</span>
                  <p className="font-body mt-sp-1 text-base text-foreground">
                    Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects, and the products are not burdened with non-essentials.
                  </p>
                </div>
              </div>
            </Card>

            {/* Components */}
            <Card className="border p-sp-3">
              <h3 className="font-heading text-foreground">Components</h3>
              <div className="mt-sp-3 flex flex-wrap items-center gap-sp-2">
                <Button variant="default">Primary Action</Button>
                <Button variant="outline">Secondary Action</Button>
                <Button variant="ghost">Tertiary</Button>
                <Button variant="success">Confirm</Button>
                <Button variant="warning">Caution</Button>
              </div>
              <div className="mt-sp-3 max-w-sm">
                <label className="text-sm font-medium text-foreground">Input Field</label>
                <Input className="mt-sp-1" placeholder="Enter value..." />
              </div>
            </Card>

            {/* Spacing */}
            <Card className="border p-sp-3">
              <h3 className="font-heading text-foreground">Spacing Scale</h3>
              <p className="mt-sp-1 text-sm text-muted-foreground">
                8 · 16 · 24 · 40 · 64 — five values, applied everywhere.
              </p>
              <div className="mt-sp-3 flex items-end gap-sp-2">
                {[8, 16, 24, 40, 64].map((px) => (
                  <div key={px} className="flex flex-col items-center gap-sp-1">
                    <div
                      className="rounded-sm bg-primary"
                      style={{ width: px, height: px }}
                    />
                    <span className="text-xs text-muted-foreground">{px}px</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Empty State Example */}
            <Card className="border border-dashed p-sp-4">
              <div className="flex flex-col items-center justify-center text-center">
                <h3 className="font-heading text-foreground">No content yet</h3>
                <p className="mt-sp-1 text-sm text-muted-foreground">
                  This workspace is ready. Add your first component to begin building.
                </p>
                <Button variant="default" size="sm" className="mt-sp-3">
                  Get Started
                </Button>
              </div>
            </Card>
          </div>
        </main>

        {/* Secondary Panel — 30% */}
        <div className="flex-[3]">
          <SecondaryPanel
            stepTitle="Step 1: Design Tokens"
            stepDescription="Define the foundational visual language — colors, typography, spacing, and component rules."
            promptText="Create a premium SaaS design system with off-white background, deep red accent, serif headings, and strict 8px spacing scale."
          />
        </div>
      </div>

      <ProofFooter items={proofItems} onToggle={handleToggle} />
    </div>
  );
};

export default Index;
