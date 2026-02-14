import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getEntryById, getHistory, updateEntry } from "@/lib/analysis-store";
import type { AnalysisEntry } from "@/lib/analysis-types";
import { CheckCircle, BookOpen, Calendar, HelpCircle, Target, Download, Copy, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

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
  // Ensure score is within 0-100 bounds for visual representation
  const boundedScore = Math.max(0, Math.min(100, score));
  const offset = circ - (boundedScore / 100) * circ;

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
        <text x="75" y="70" textAnchor="middle" className="fill-foreground" fontSize="28" fontWeight="700">{Math.round(boundedScore)}</text>
        <text x="75" y="90" textAnchor="middle" className="fill-muted-foreground" fontSize="11">Readiness</text>
      </svg>
    </div>
  );
};

const ResourcesPage = () => {
  const location = useLocation();
  const [entry, setEntry] = useState<AnalysisEntry | null>(null);
  const [confidenceMap, setConfidenceMap] = useState<Record<string, "know" | "practice">>({});
  const [liveScore, setLiveScore] = useState(0);

  // Initialize entry and state
  useEffect(() => {
    const stateId = (location.state as any)?.analysisId;
    let foundEntry: AnalysisEntry | undefined;

    if (stateId) {
      foundEntry = getEntryById(stateId);
    } else {
      // Fall back to latest
      const history = getHistory();
      if (history.length > 0) foundEntry = history[0];
    }

    if (foundEntry) {
      setEntry(foundEntry);
      setConfidenceMap(foundEntry.skillConfidenceMap || {});
      setLiveScore(foundEntry.readinessScore);
    }
  }, [location.state]);

  // Recalculate score whenever confidenceMap changes, but only if we have an entry
  useEffect(() => {
    if (!entry) return;

    // Calculate score adjustment
    let scoreAdjustment = 0;
    Object.values(confidenceMap).forEach((status) => {
      if (status === "know") scoreAdjustment += 2;
      if (status === "practice") scoreAdjustment -= 2;
    });

    // Base score is the original assessment score
    // We assume the stored readinessScore is the BASE, but that might be confusing if we update it.
    // For now, let's treat entry.readinessScore as the base reference for this session, 
    // OR we can say the stored score IS the live score.
    // Requirement says: "Start from base readinessScore (already computed). Then +2/-2"
    // To avoid double counting, we should really recalculate from the ORIGINAL base if possible,
    // or just apply the delta to the CURRENT stored score if we treat it as dynamic.
    // Let's simpler approach: The score in `entry` captures the state.

    // Wait, if we persist the score, next load will add +2 again?
    // Better strategy: Calculate score dynamically from skills + base traits.
    // Since we don't have the "base traits score" separately, let's just update the single score field
    // but ensure we don't drift.
    // Implementation: valid range 0-100.

    // Let's just trust the current map state reflects the user's intent to modifier.
    // Effectively: NewScore = BaseScore + (Knows * 2) - (NeedsPractice * 2)
    // PROBLEM: We don't know "BaseScore" (score without any toggles).
    // ALTERNATIVE: We update the score visibly but maybe only persist the map?
    // REQUIREMENT: "Update score in real-time."

    // Let's implement a simple heuristic:
    // We will use the `entry.readinessScore` as the starting point.
    // But we need to handle the case where we reload.
    // If we reload, `entry.readinessScore` already includes changes? 
    // Let's assume `entry.readinessScore` in the DB is the "Live" score.

    // Actually, to make this robust:
    // Let's allow the user to modify the score, and we save that new score.
    // BUT we need to ensure meaningful changes.
    // Let's just apply the delta to the state visually and save it.

    // Refined Logic (matches requirement "Start from base... then"):
    // We will initialize `liveScore` with `entry.readinessScore` on load.
    // When a toggle changes:
    //   Previous State -> New State
    //   None -> Know (+2)
    //   None -> Practice (-2)
    //   Know -> Practice (-4)
    //   Practice -> Know (+4)
    //   Know -> None (-2)
    //   Practice -> None (+2)

    // To do this strictly, we need the `previous` state.
    // Just handling it in the toggle function is safer.

  }, [confidenceMap, entry]); // We will handle score updates in toggleSkill instead to be precise.

  const toggleSkill = (skill: string, type: "know" | "practice") => {
    if (!entry) return;

    const currentStatus = confidenceMap[skill];
    let newMap = { ...confidenceMap };
    let scoreDelta = 0;

    // Logic for toggling
    if (currentStatus === type) {
      // Toggle off (remove status)
      delete newMap[skill];
      // Reverse the effect
      if (type === "know") scoreDelta = -2;
      if (type === "practice") scoreDelta = +2;
    } else {
      // Toggle on (or switch)
      newMap[skill] = type;

      if (currentStatus === "know") {
        // Switching Know -> Practice
        if (type === "practice") scoreDelta = -4; // -2 for removing know, -2 for adding practice
      } else if (currentStatus === "practice") {
        // Switching Practice -> Know
        if (type === "know") scoreDelta = +4; // +2 for removing practice, +2 for adding know
      } else {
        // Fresh toggle (None -> X)
        if (type === "know") scoreDelta = +2;
        if (type === "practice") scoreDelta = -2;
      }
    }

    // Update state
    setConfidenceMap(newMap);

    const newScore = Math.max(0, Math.min(100, liveScore + scoreDelta));
    setLiveScore(newScore);

    // Persist changes
    const updatedEntry = {
      ...entry,
      skillConfidenceMap: newMap,
      readinessScore: newScore
    };

    setEntry(updatedEntry); // Keep local entry in sync
    updateEntry(updatedEntry); // Save to local storage
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDownloadTxt = () => {
    if (!entry) return;

    const lines = [
      `PLACEMENT READINESS REPORT`,
      `==========================`,
      `Role: ${entry.role || "N/A"}`,
      `Company: ${entry.company || "N/A"}`,
      `Date: ${new Date(entry.createdAt).toLocaleDateString()}`,
      `Readiness Score: ${liveScore}/100`,
      ``,
      `SKILLS ASSESSMENT`,
      `-----------------`,
      ...entry.extractedSkills.flatMap(cat =>
        cat.skills.map(s => {
          const status = confidenceMap[s] ? `[${confidenceMap[s].toUpperCase()}]` : "[ ]";
          return `${status} ${s} (${cat.name})`;
        })
      ),
      ``,
      `7-DAY PREPARATION PLAN`,
      `----------------------`,
      ...entry.plan.map(d => `Day ${d.day} (${d.focus}):\n` + d.tasks.map(t => `  - ${t}`).join('\n')),
      ``,
      `PREPARATION CHECKLIST`,
      `---------------------`,
      ...entry.checklist.flatMap(r => `[${r.title}]\n` + r.items.map(i => `  [ ] ${i}`).join('\n')),
      ``,
      `LIKELY INTERVIEW QUESTIONS`,
      `--------------------------`,
      ...entry.questions.map((q, i) => `${i + 1}. ${q}`)
    ];

    const blob = new Blob([lines.join('\n')], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `readiness-report-${entry.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully");
  };

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

  // Derived data for export
  const planText = entry.plan.map(d => `Day ${d.day} (${d.focus}):\n` + d.tasks.map(t => `- ${t}`).join('\n')).join('\n\n');
  const checklistText = entry.checklist.map(r => `## ${r.title}\n` + r.items.map(i => `- [ ] ${i}`).join('\n')).join('\n\n');
  const questionsText = entry.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');

  // Identify weak skills for "Action Next" box
  const weakSkills = Object.entries(confidenceMap)
    .filter(([_, status]) => status === "practice")
    .map(([skill]) => skill)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
          <p className="mt-1 text-muted-foreground">
            {entry.company && <span className="font-medium text-foreground">{entry.company}</span>}
            {entry.company && entry.role && " — "}
            {entry.role && <span>{entry.role}</span>}
            {!entry.company && !entry.role && "General analysis"}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => copyToClipboard(planText, "7-Day Plan")}>
              <Copy className="h-3.5 w-3.5" /> Copy 7-day plan
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => copyToClipboard(checklistText, "Checklist")}>
              <Copy className="h-3.5 w-3.5" /> Copy Checklist
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => copyToClipboard(questionsText, "Questions")}>
              <Copy className="h-3.5 w-3.5" /> Copy Questions
            </Button>
            <Button variant="secondary" size="sm" className="h-8 gap-2" onClick={handleDownloadTxt}>
              <Download className="h-3.5 w-3.5" /> Download Report
            </Button>
          </div>
        </div>
        <ReadinessRing score={liveScore} />
      </div>

      {/* Extracted Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" /> Key Skills Assessment
          </CardTitle>
          <p className="text-sm text-muted-foreground">Mark skills you know (+2 score) or need to practice (-2 score).</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {entry.extractedSkills.map((cat) => (
            <div key={cat.name}>
              <p className="text-sm font-medium text-muted-foreground mb-2">{cat.name}</p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const status = confidenceMap[skill];
                  return (
                    <div
                      key={skill}
                      className="inline-flex items-center rounded-md border p-1 pr-2 gap-2 bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => toggleSkill(skill, "know")}
                          className={`p-1 rounded hover:bg-success/20 transition-colors ${status === "know" ? "text-success bg-success/10" : "text-muted-foreground"}`}
                          title="I know this"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleSkill(skill, "practice")}
                          className={`p-1 rounded hover:bg-warning/20 transition-colors ${status === "practice" ? "text-warning bg-warning/10" : "text-muted-foreground"}`}
                          title="Need practice"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className={`text-sm ${status === "know" ? "font-medium text-foreground" : status === "practice" ? "text-muted-foreground" : "text-foreground"}`}>
                        {skill}
                      </span>
                    </div>
                  );
                })}
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
                  <label key={ii} className="flex items-start gap-2 text-sm cursor-pointer hover:text-foreground/80 transition-colors">
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

      {/* Action Next Box - Persistent at bottom of results */}
      {weakSkills.length > 0 && (
        <Card className="border-t-4 border-t-primary bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Action Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">You identified {weakSkills.length} key skills to practice, including <span className="font-medium text-foreground">{weakSkills.join(", ")}</span>.</p>
            <p className="font-medium text-foreground">Recommendation: Start Day 1 tasks focusing on these areas.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full sm:w-auto gap-2 group">
              Start Day 1 Plan Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ResourcesPage;
