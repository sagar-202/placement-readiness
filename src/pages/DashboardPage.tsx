import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const radarData = [
  { subject: "DSA", score: 75 },
  { subject: "System Design", score: 60 },
  { subject: "Communication", score: 80 },
  { subject: "Resume", score: 85 },
  { subject: "Aptitude", score: 70 },
];

const assessments = [
  { title: "DSA Mock Test", date: "Tomorrow", time: "10:00 AM" },
  { title: "System Design Review", date: "Wed", time: "2:00 PM" },
  { title: "HR Interview Prep", date: "Friday", time: "11:00 AM" },
];

const weekDays = [
  { day: "M", active: true },
  { day: "T", active: true },
  { day: "W", active: false },
  { day: "T", active: true },
  { day: "F", active: true },
  { day: "S", active: false },
  { day: "S", active: false },
];

const ReadinessCircle = ({ score }: { score: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="12"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          className="transition-all duration-700 ease-in-out"
        />
        <text
          x="90"
          y="82"
          textAnchor="middle"
          className="fill-foreground text-4xl font-bold"
          fontSize="36"
          fontWeight="700"
        >
          {score}
        </text>
        <text
          x="90"
          y="106"
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize="13"
        >
          Readiness Score
        </text>
      </svg>
    </div>
  );
};

const DashboardPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
      <p className="mt-1 text-muted-foreground">
        Welcome back! Here's your placement prep overview.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Overall Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadinessCircle score={72} />
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skill Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continue Practice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Continue Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-foreground">Dynamic Programming</p>
            <p className="text-sm text-muted-foreground">3 of 10 completed</p>
          </div>
          <Progress value={30} className="h-2" />
          <Button className="gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">Problems Solved</span>
              <span className="text-muted-foreground">12 / 20 this week</span>
            </div>
            <Progress value={60} className="mt-2 h-2" />
          </div>
          <div className="flex justify-between pt-2">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    d.active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assessments — full width */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {assessments.map((a, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="font-medium text-foreground">{a.title}</span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {a.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {a.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default DashboardPage;
