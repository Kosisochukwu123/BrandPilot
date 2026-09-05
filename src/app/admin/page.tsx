import { getAdminOverview, getRevenueEstimate } from "@/server/actions/admin-analytics";
import { 
  Users, 
  Crown, 
  User, 
  Sparkles, 
  FileText, 
  Image, 
  Ban, 
  Wallet,
  LayoutDashboard,
  CreditCard,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverview();
  const revenue = await getRevenueEstimate(29000);

  if (!overview) return null;

  const cards = [
    { 
      label: "Total users", 
      value: overview.totalUsers, 
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      label: "Pro subscribers", 
      value: overview.proUsers, 
      icon: Crown,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    { 
      label: "Free users", 
      value: overview.freeUsers, 
      icon: User,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    { 
      label: "Generations this month", 
      value: overview.generationsThisMonth, 
      icon: Sparkles,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    { 
      label: "Total saved content", 
      value: overview.totalContent, 
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    { 
      label: "Total posters", 
      value: overview.totalPosters, 
      icon: Image,
      color: "text-pink-500",
      bg: "bg-pink-500/10"
    },
    { 
      label: "Suspended accounts", 
      value: overview.suspendedUsers, 
      icon: Ban,
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    { 
      label: "Est. monthly revenue", 
      value: `₦${revenue?.estimatedMonthlyRevenue.toLocaleString() ?? 0}`,
      icon: Wallet, // Changed from Naira to Wallet
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">
          Quick snapshot across the whole platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group relative rounded-xl border border-border/70 bg-secondary/10 p-5 transition-all duration-200 hover:border-border hover:bg-secondary/20 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {card.value}
                </p>
              </div>
              <div className={cn(
                "rounded-lg p-2.5 transition-transform duration-200 group-hover:scale-110",
                card.bg
              )}>
                <card.icon className={cn("size-4", card.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border/70 bg-secondary/10 p-6">
        <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
        <p className="text-xs text-muted-foreground">Common administrative tasks</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <Users className="size-4" />
            Manage users
          </a>
          <a
            href="/admin/subscriptions"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/60 hover:shadow-md"
          >
            <CreditCard className="size-4" />
            View subscriptions
          </a>
          <a
            href="/admin/content"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/60 hover:shadow-md"
          >
            <ShieldAlert className="size-4" />
            Moderate content
          </a>
        </div>
      </div>
    </div>
  );
}