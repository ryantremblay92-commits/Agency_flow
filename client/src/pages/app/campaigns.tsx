import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, Search, Filter, MoreHorizontal, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { type Campaign, type Client } from "@shared/schema";

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading: isCampaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Helper function to get client name by ID
  const getClientName = (clientId: string | null): string => {
    if (!clientId) return "Unknown Client";
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  // Calculate summary statistics
  const totalBudget = campaigns.reduce((sum, campaign) => sum + (campaign.budget || 0), 0);
  const activeCampaignsCount = campaigns.filter(campaign => campaign.status === "Active").length;

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">Manage and track your active marketing campaigns</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Launch New Campaign
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">Total Campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{activeCampaignsCount}</div>
              <p className="text-xs text-muted-foreground">Active Campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{new Set(campaigns.map(c => c.platform)).size}</div>
              <p className="text-xs text-muted-foreground">Platforms Used</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search campaigns..." className="pl-9 bg-background" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isCampaignsLoading ? (
              <div className="p-8 text-center">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No campaigns found</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Launch New Campaign
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="p-4 flex items-center justify-between hover:bg-muted/5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{camp.name}</h4>
                        <p className="text-xs text-muted-foreground">{getClientName(camp.clientId)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium">${(camp.budget || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Budget</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium text-muted-foreground">{camp.platform || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">Platform</p>
                      </div>
                      <Badge variant={camp.status === "Active" ? "default" : "outline"}>{camp.status || "Unknown"}</Badge>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
