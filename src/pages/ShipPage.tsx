
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, CheckCircle2, ArrowLeft } from "lucide-react";
import { CHECKLIST_ITEMS, STORAGE_KEY, isChecklistComplete } from "@/lib/checklist-logic";

const ShipPage = () => {
    const navigate = useNavigate();
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const checkedItems = JSON.parse(saved);
            if (isChecklistComplete(checkedItems)) {
                setIsLocked(false);
            } else {
                setIsLocked(true);
            }
        } else {
            setIsLocked(true);
        }
    }, []);

    if (isLocked) {
        return (
            <div className="container max-w-lg py-20 text-center space-y-6">
                <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center">
                    <Rocket className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
                <h1 className="text-3xl font-bold">Ship Locked</h1>
                <p className="text-muted-foreground">
                    You haven't completed the pre-flight checklist yet.
                    Please verify all tests before shipping.
                </p>
                <Button onClick={() => navigate("/prp/07-test")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Checklist
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-20 text-center space-y-8">
            <div className="mx-auto h-32 w-32 bg-success/10 rounded-full flex items-center justify-center animate-pulse">
                <Rocket className="h-16 w-16 text-success" />
            </div>

            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">Ready for Takeoff!</h1>
                <p className="text-xl text-muted-foreground">
                    All systems verified. You are clear to ship.
                </p>
            </div>

            <Card className="border-success/50 bg-success/5">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center gap-2 text-success font-medium">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Platform Hardening Complete</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Validation, Schema, and history persistence are verified.
                    </p>
                </CardContent>
            </Card>

            <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
            </Button>
        </div>
    );
};

export default ShipPage;
