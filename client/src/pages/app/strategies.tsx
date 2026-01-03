import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, Search, Filter, MoreHorizontal, Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const strategies = [
  { id: 1, name: "Q1 Growth Push", client: "TechNova Inc.", status: "Active", type: "Lead Generation", date: "Jan 12, 2026" },
  { id: 2, name: "Brand Refresh 2026", client: "GreenEarth Cafe", status: "Review", type: "Awareness", date: "Jan 05, 2026" },
  { id: 3, name: "Market Entry Plan", client: "Alpha Finance", status: "Draft", type: "Expansion", date: "Jan 15, 2026" },
];

export default function StrategiesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strategies</h1>
            <p className="text-muted-foreground">Comprehensive marketing plans for your clients</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Generate New Strategy
          </Button>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6 border-b bg-muted/5">
             <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="Search strategies..." className="pl-9 bg-background" />
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {strategies.map((strat) => (
                <div key={strat.id} className="p-4 hover:bg-muted/5 flex items-center justify-between group cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{strat.name}</h3>
                      <p className="text-sm text-muted-foreground">{strat.client} • {strat.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge variant={strat.status === "Active" ? "default" : strat.status === "Review" ? "secondary" : "outline"}>
                      {strat.status}
                    </Badge>
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium">{strat.date}</p>
                      <p className="text-xs text-muted-foreground">Last modified</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
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
