import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, Search, Filter, MoreHorizontal, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const campaigns = [
  { id: 1, name: "LinkedIn Lead Gen", client: "TechNova Inc.", status: "Running", budget: "$1,200", performance: "+12.4%" },
  { id: 2, name: "Google Search Ads", client: "Alpha Finance", status: "Paused", budget: "$800", performance: "0.0%" },
  { id: 3, name: "Retargeting", client: "TechNova Inc.", status: "Running", budget: "$450", performance: "+5.2%" },
];

export default function CampaignsPage() {
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
              <div className="text-2xl font-bold">$4,250</div>
              <p className="text-xs text-muted-foreground">Total Ad Spend (MTD)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">Total Conversions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">3.2x</div>
              <p className="text-xs text-muted-foreground">Average ROAS</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active Campaigns</p>
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
             <div className="divide-y">
               {campaigns.map((camp) => (
                 <div key={camp.id} className="p-4 flex items-center justify-between hover:bg-muted/5">
                   <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-muted-foreground" />
                     </div>
                     <div>
                       <h4 className="font-semibold">{camp.name}</h4>
                       <p className="text-xs text-muted-foreground">{camp.client}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-12">
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium">{camp.budget}</p>
                        <p className="text-xs text-muted-foreground">Budget</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium text-green-600">{camp.performance}</p>
                        <p className="text-xs text-muted-foreground">ROI</p>
                      </div>
                      <Badge variant={camp.status === "Running" ? "default" : "outline"}>{camp.status}</Badge>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
