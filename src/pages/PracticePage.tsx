import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { runAnalysis } from "@/lib/skill-extractor";
import { saveEntry } from "@/lib/analysis-store";
import { Search, FileText } from "lucide-react";

const SAMPLE_JD = `We are looking for a Software Engineer with strong skills in DSA, OOP, and DBMS. 
Experience with React, Node.js, and REST APIs is preferred. 
The candidate should know SQL, PostgreSQL, and have experience with Docker and AWS. 
Knowledge of Python or Java is a plus. CI/CD experience and Linux proficiency are valued.
Strong communication and problem-solving skills required.`;

const PracticePage = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setAnalyzing(true);
    // Small delay for UX feedback
    setTimeout(() => {
      const entry = runAnalysis(company, role, jdText);
      saveEntry(entry);
      setAnalyzing(false);
      navigate("/dashboard/resources", { state: { analysisId: entry.id } });
    }, 300);
  };

  const handleLoadSample = () => {
    setCompany("Google");
    setRole("Software Engineer");
    setJdText(SAMPLE_JD);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">JD Analyzer</h2>
        <p className="mt-1 text-muted-foreground">
          Paste a job description to get a personalized preparation plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" /> Job Description Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Company Name
              </label>
              <Input
                placeholder="e.g. Google, Infosys, TCS"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Role
              </label>
              <Input
                placeholder="e.g. Software Engineer, SDE-1"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Job Description
            </label>
            <Textarea
              placeholder="Paste the complete job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {jdText.length} characters {jdText.length > 800 && <Badge variant="secondary" className="ml-1 text-xs">Detailed JD ✓</Badge>}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLoadSample}>
                Load Sample JD
              </Button>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || analyzing}
            className="w-full gap-2"
          >
            <Search className="h-4 w-4" />
            {analyzing ? "Analyzing..." : "Analyze & Generate Plan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticePage;
