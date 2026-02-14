import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Video, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Practice Problems",
    description: "Solve curated coding challenges across data structures, algorithms, and more.",
  },
  {
    icon: Video,
    title: "Mock Interviews",
    description: "Simulate real interview scenarios with timed sessions and feedback.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Monitor your growth with detailed analytics and performance insights.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Ace Your Placement
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Practice, assess, and prepare for your dream job
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/dashboard">Get Started</Link>
        </Button>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border bg-card">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Placement Prep. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
