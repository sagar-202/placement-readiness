
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, RotateCcw, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { CHECKLIST_ITEMS, STORAGE_KEY, getPassedCount, isChecklistComplete } from "@/lib/checklist-logic";

const TestChecklistPage = () => {
    const navigate = useNavigate();
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
    }, []);

    const handleCheck = (id: string, checked: boolean) => {
        const newItems = { ...checkedItems, [id]: checked };
        setCheckedItems(newItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the checklist?")) {
            setCheckedItems({});
            localStorage.removeItem(STORAGE_KEY);
            toast.info("Checklist reset.");
        }
    };

    const checkedCount = getPassedCount(checkedItems);
    const totalCount = CHECKLIST_ITEMS.length;
    const allPassed = isChecklistComplete(checkedItems);

    return (
        <div className="container max-w-3xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Test Checklist</h1>
                    <p className="text-muted-foreground mt-2">
                        Verify all features before shipping.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {allPassed ? (
                        <Badge className="bg-success text-success-foreground text-lg py-1 px-4">
                            Ready to Ship
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-lg py-1 px-4 border-destructive text-destructive">
                            {checkedCount} / {totalCount} Passed
                        </Badge>
                    )}
                </div>
            </div>

            {!allPassed ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Shipping Locked</AlertTitle>
                    <AlertDescription>
                        You must pass all {totalCount} tests to unlock the shipping route.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert className="border-success/50 bg-success/10 text-success-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <AlertTitle>All Systems Go</AlertTitle>
                    <AlertDescription>
                        Great job! You can now proceed to the shipping phase.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Verification Items</span>
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                            <RotateCcw className="h-4 w-4 mr-2" /> Reset
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {CHECKLIST_ITEMS.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                            <Checkbox
                                id={item.id}
                                checked={!!checkedItems[item.id]}
                                onCheckedChange={(checked) => handleCheck(item.id, checked as boolean)}
                                className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor={item.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {item.label}
                                </label>
                                {item.hint && (
                                    <p className="text-xs text-muted-foreground">
                                        {item.hint}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex justify-end pt-6">
                    <Button
                        size="lg"
                        disabled={!allPassed}
                        onClick={() => navigate("/prp/08-ship")}
                        className={allPassed ? "bg-success hover:bg-success/90 text-white" : ""}
                    >
                        {allPassed ? <ArrowRight className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                        {allPassed ? "Proceed to Ship" : "Locked"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TestChecklistPage;
