
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getEntryById, getHistory, updateEntry } from "@/lib/analysis-store";
import { normalizeEntry } from "@/lib/analysis-migration";
import type { AnalysisEntry } from "@/lib/analysis-types";
import { CheckCircle, BookOpen, Calendar, HelpCircle, Target, Download, Copy, ArrowRight, ThumbsUp, ThumbsDown, Building, Users, Briefcase, ListChecks, Info } from "lucide-react";
import { toast } from "sonner";

const ReadinessRing = ({ score }: { score: number }) => {
  const r = 60;
  const circ = 2 * Math.PI * r;
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
  const { id } = useParams(); // Support route param if used
  const location = useLocation();
  const [entry, setEntry] = useState<AnalysisEntry | null>(null);
  const [confidenceMap, setConfidenceMap] = useState<Record<string, "know" | "practice">>({});
  const [liveScore, setLiveScore] = useState(0);

  // Initialize entry and state
  useEffect(() => {
    // Try to get ID from params or location state
    const stateId = (location.state as any)?.analysisId || id;
    let foundEntry: AnalysisEntry | undefined;

    try {
      if (stateId) {
        foundEntry = getEntryById(stateId);
      } else {
        // Fall back to latest
        const history = getHistory();
        if (history.length > 0) foundEntry = history[0];
      }

      if (foundEntry) {
        // Normalize on load to ensure schema compliance
        const normalized = normalizeEntry(foundEntry);
        setEntry(normalized);
        setConfidenceMap(normalized.skillConfidenceMap || {});
        setLiveScore(normalized.finalScore ?? normalized.baseScore ?? 0);
      }
    } catch (e) {
      console.error("Error loading entry:", e);
      toast.error("Failed to load analysis data.");
    }
  }, [location.state, id]);

  const toggleSkill = (skill: string, type: "know" | "practice") => {
    if (!entry) return;

    const currentStatus = confidenceMap[skill];
    let newMap = { ...confidenceMap };
    let scoreDelta = 0;

    // Logic for toggling - simplistic approach relative to current state
    // We recalculate delta based on change
    if (currentStatus === type) {
      // Toggle off
      delete newMap[skill];
      if (type === "know") scoreDelta = -2;
      if (type === "practice") scoreDelta = +2;
    } else {
      // Toggle on
      newMap[skill] = type;
      if (currentStatus === "know") { // Switching Know -> Practice
        scoreDelta = -4;
      } else if (currentStatus === "practice") { // Switching Practice -> Know
        scoreDelta = +4;
      } else { // Fresh toggle
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
      finalScore: newScore,
      updatedAt: new Date().toISOString()
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
      ...Object.entries(entry.extractedSkills).flatMap(([cat, skills]) =>
        skills.map(s => {
          const status = confidenceMap[s] ? `[${confidenceMap[s].toUpperCase()}]` : "[ ]";
          return `${status} ${s} (${cat})`;
        })
      ),
      ``,
      `7-DAY PREPARATION PLAN`,
      `----------------------`,
      ...entry.plan7Days.map(d => `Day ${d.day} (${d.focus}):\n` + d.tasks.map(t => `  - ${t}`).join('\n')),
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

  // Derived data for export helpers
  const planText = entry.plan7Days.map(d => `Day ${d.day} (${d.focus}):\n` + d.tasks.map(t => `- ${t}`).join('\n')).join('\n\n');
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
              <Copy className="h-3.5 w-3.5" /> Copy Plan
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

      {/* Company Intel Card */}
      {entry.companyIntel && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> Company Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-background p-2 rounded-md border text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Industry:</span>
                <span className="font-medium text-foreground">{entry.companyIntel.industry}</span>
              </div>
              <div className="flex items-center gap-2 bg-background p-2 rounded-md border text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Size:</span>
                <Badge variant={entry.companyIntel.size === "Enterprise" ? "default" : "secondary"}>
                  {entry.companyIntel.size}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Typical Hiring Focus:</p>
              <p className="text-sm text-muted-foreground">{entry.companyIntel.hiringFocus}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mt-2">
              <Info className="h-3 w-3" />
              <span>Demo Mode: Company intel generated heuristically based on name.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping Timeline */}
      {entry.roundMapping && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks className="h-5 w-5" /> Expected Interview Rounds
            </CardTitle>
            <p className="text-sm text-muted-foreground">Based on company size and your specific skill set.</p>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l-2 border-muted space-y-8 my-2">
              {entry.roundMapping.map((round) => (
                <div key={round.roundNumber} className="relative">
                  <span className="absolute -left-[31px] bg-background border-2 border-primary text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {round.roundNumber}
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground text-base">{round.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{round.desc}</p>
                    <p className="text-xs font-medium text-primary mt-1.5 uppercase tracking-wide">Why this round matters</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" /> Key Skills Assessment
          </CardTitle>
          <p className="text-sm text-muted-foreground">Mark skills you know (+2 score) or need to practice (-2 score).</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(entry.extractedSkills).map(([catName, skills]) => {
            if (skills.length === 0) return null;

            const displayNames: Record<string, string> = {
              coreCS: "Core CS",
              languages: "Languages",
              web: "Web Development",
              data: "Data Engineering",
              cloud: "Cloud & DevOps",
              testing: "Testing",
              other: "Other Skills"
            };

            return (
              <div key={catName}>
                <p className="text-sm font-medium text-muted-foreground mb-2">{displayNames[catName] || catName}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
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
            );
          })}
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
          {entry.plan7Days.map((day, i) => (
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
