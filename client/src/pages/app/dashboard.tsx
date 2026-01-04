import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Megaphone, ArrowUpRight, Plus, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { type Client, type Strategy, type Campaign, type Activity } from "@shared/schema";

export default function Dashboard() {
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: strategies = [] } = useQuery<Strategy[]>({
    queryKey: ["/api/strategies"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const activeClients = clients.filter(client => client.status === "Active").length;
  const activeStrategies = strategies.filter(strategy => strategy.status === "Active").length;
  const activeCampaigns = campaigns.filter(campaign => campaign.status === "Active").length;

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "unknown";
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMs = now.getTime() - activityDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${diffInDays} days ago`;
  };

  // Generate pending actions from data
  const pendingActions = (() => {
    // Find clients without strategies
    const clientsWithoutStrategies = clients.filter(client =>
      !strategies.some(strategy => strategy.clientId === client.id)
    );

    // Find clients without campaigns
    const clientsWithoutCampaigns = clients.filter(client =>
      !campaigns.some(campaign => campaign.clientId === client.id)
    );

    // Create pending actions array with proper typing
    const actions: Array<{
      task: string;
      client: string;
      urgency: string;
      link: string;
    }> = [];

    // Add actions for clients without strategies
    clientsWithoutStrategies.forEach(client => {
      actions.push({
        task: "Generate strategy",
        client: client.name,
        urgency: "high",
        link: `/app/clients/${client.id}`
      });
    });

    // Add actions for clients without campaigns
    clientsWithoutCampaigns.forEach(client => {
      actions.push({
        task: "Create campaign",
        client: client.name,
        urgency: "medium",
        link: `/app/clients/${client.id}`
      });
    });

    return actions;
  })();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your agency performance</p>
          </div>
          <div className="flex gap-2">
            <Link href="/app/clients/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Client
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClients}</div>
              <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> Real-time data
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStrategies}</div>
              <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> Real-time data
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> Real-time data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-8 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold mr-4 border border-primary/20">
                      {activity.user?.substring(0, 2).toUpperCase() || "SY"}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user || "System"} <span className="text-muted-foreground font-normal">{activity.action}</span> <span className="font-semibold">{activity.target}</span> <span className="font-normal">{activity.targetName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.createdAt)}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activities yet.</p>
                    <p className="text-sm">Activities will appear here when you create clients and perform other actions.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingActions.length > 0 ? pendingActions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/5">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{item.task}</p>
                      <p className="text-xs text-muted-foreground">{item.client}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={item.link}>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>All caught up!</p>
                    <p className="text-sm">No pending actions at this time.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
