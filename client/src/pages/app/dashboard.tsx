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

export default function Dashboard() {
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
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +4 new this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground mt-1">Across 8 platforms</p>
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
                {[
                  { user: "Sarah J.", action: "generated a new strategy for", target: "TechNova Inc.", time: "2 hours ago", avatar: "SJ" },
                  { user: "Mike T.", action: "published 3 campaigns for", target: "GreenEarth Cafe", time: "5 hours ago", avatar: "MT" },
                  { user: "Alex D.", action: "added a new client", target: "Starlight Logistics", time: "1 day ago", avatar: "AD" },
                  { user: "Sarah J.", action: "updated brand kit for", target: "BlueSky Retail", time: "1 day ago", avatar: "SJ" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold mr-4 border border-primary/20">
                      {item.avatar}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.user} <span className="text-muted-foreground font-normal">{item.action}</span> <span className="font-semibold">{item.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
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
                 {[
                   { task: "Review strategy draft", client: "TechNova", urgency: "high" },
                   { task: "Approve ad spend", client: "GreenEarth", urgency: "medium" },
                   { task: "Connect FB Ad Account", client: "Starlight", urgency: "high" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-muted/5">
                     <div className="space-y-1">
                       <p className="text-sm font-medium">{item.task}</p>
                       <p className="text-xs text-muted-foreground">{item.client}</p>
                     </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                       <ArrowUpRight className="w-4 h-4" />
                     </Button>
                   </div>
                 ))}
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
