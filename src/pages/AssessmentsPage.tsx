import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHistory, deleteEntry } from "@/lib/analysis-store";
import type { AnalysisEntry } from "@/lib/analysis-types";
import { Clock, Trash2, FileText, ArrowRight } from "lucide-react";

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AnalysisEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setHistory(getHistory());
  };

  const handleOpen = (id: string) => {
    navigate("/dashboard/resources", { state: { analysisId: id } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analysis History</h2>
        <p className="mt-1 text-muted-foreground">
          Review your past job description analyses.
        </p>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">
              No analyses yet. Start by analyzing a job description.
            </p>
            <Button onClick={() => navigate("/dashboard/practice")}>
              Go to Analyzer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <Card key={entry.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => handleOpen(entry.id)}>
              <CardContent className="flex items-center justify-between py-4 px-5">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {entry.readinessScore}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {entry.company || "Unknown Company"}
                      {entry.role && ` — ${entry.role}`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                      <span>•</span>
                      <span>{entry.extractedSkills.flatMap(s => s.skills).length} skills</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentsPage;
