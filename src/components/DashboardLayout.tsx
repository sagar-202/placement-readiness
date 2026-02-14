import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User, ListChecks, Rocket } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Practice", path: "/dashboard/practice", icon: BookOpen },
  { label: "Assessments", path: "/dashboard/assessments", icon: ClipboardCheck },
  { label: "Resources", path: "/dashboard/resources", icon: FolderOpen },
  { label: "Profile", path: "/dashboard/profile", icon: User },
  { label: "Checklist", path: "/prp/07-test", icon: ListChecks }, // New
  { label: "Ship", path: "/prp/08-ship", icon: Rocket }, // New
];

const DashboardLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="px-5 py-5 text-lg font-bold text-sidebar-primary-foreground">
          Placement Prep
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b bg-card px-6">
          <span className="font-semibold text-foreground">Placement Prep</span>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
          </Avatar>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
