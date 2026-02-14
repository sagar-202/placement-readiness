import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { getEntryById, getHistory } from "@/lib/analysis-store";
import type { AnalysisEntry } from "@/lib/analysis-types";
import { CheckCircle, BookOpen, Calendar, HelpCircle, Target } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Core CS": "bg-primary/10 text-primary border-primary/20",
  "Languages": "bg-accent text-accent-foreground border-accent-foreground/20",
  "Web": "bg-success/10 text-success border-success/20",
  "Data": "bg-warning/10 text-warning border-warning/20",
  "Cloud/DevOps": "bg-destructive/10 text-destructive border-destructive/20",
  "Testing": "bg-secondary text-secondary-foreground border-border",
  "General": "bg-muted text-muted-foreground border-border",
};

const ReadinessRing = ({ score }: { score: number }) => {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center py-4">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
        <circle
          cx="75" cy="75" r={r} fill="none"
          stroke="hsl(var(--primary))" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 75 75)"
          className="transition-all duration-700 ease-in-out"
        />
        <text x="75" y="70" textAnchor="middle" className="fill-foreground" fontSize="28" fontWeight="700">{score}</text>
        <text x="75" y="90" textAnchor="middle" className="fill-muted-foreground" fontSize="11">Readiness</text>
      </svg>
    </div>
  );
};

const ResourcesPage = () => {
  const location = useLocation();
  const [entry, setEntry] = useState<AnalysisEntry | null>(null);

  useEffect(() => {
    const stateId = (location.state as any)?.analysisId;
    if (stateId) {
      const found = getEntryById(stateId);
      if (found) { setEntry(found); return; }
    }
    // Fall back to latest
    const history = getHistory();
    if (history.length > 0) setEntry(history[0]);
  }, [location.state]);

  if (!entry) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Results</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No analysis yet. Go to <span className="font-medium text-foreground">Practice</span> to analyze a job description.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
          <p className="mt-1 text-muted-foreground">
            {entry.company && <span className="font-medium text-foreground">{entry.company}</span>}
            {entry.company && entry.role && " — "}
            {entry.role && <span>{entry.role}</span>}
            {!entry.company && !entry.role && "General analysis"}
          </p>
        </div>
        <ReadinessRing score={entry.readinessScore} />
      </div>

      {/* Extracted Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" /> Key Skills Extracted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entry.extractedSkills.map((cat) => (
            <div key={cat.name}>
              <p className="text-sm font-medium text-muted-foreground mb-1.5">{cat.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${categoryColors[cat.name] || categoryColors["General"]}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Round-wise Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> Round-wise Preparation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {entry.checklist.map((round, ri) => (
            <div key={ri}>
              <p className="font-semibold text-foreground mb-2">{round.title}</p>
              <div className="space-y-2 pl-1">
                {round.items.map((item, ii) => (
                  <label key={ii} className="flex items-start gap-2 text-sm cursor-pointer">
                    <Checkbox className="mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" /> 7-Day Preparation Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {entry.plan.map((day, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="rounded-md">{day.day}</Badge>
                <span className="font-semibold text-foreground">{day.focus}</span>
              </div>
              <ul className="space-y-1 pl-4 list-disc text-sm text-foreground">
                {day.tasks.map((task, ti) => (
                  <li key={ti}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Interview Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Likely Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal pl-5 text-sm text-foreground">
            {entry.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesPage;
