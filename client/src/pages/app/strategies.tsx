import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, Search, Filter, MoreHorizontal, Download, FileText, Check, ArrowRight, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";

const strategies = [
  { id: 1, name: "Q1 Growth Push", client: "TechNova Inc.", status: "Active", type: "Lead Generation", date: "Jan 12, 2026" },
  { id: 2, name: "Brand Refresh 2026", client: "GreenEarth Cafe", status: "Review", type: "Awareness", date: "Jan 05, 2026" },
  { id: 3, name: "Market Entry Plan", client: "Alpha Finance", status: "Draft", type: "Expansion", date: "Jan 15, 2026" },
];

export default function StrategiesPage() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const handleCreate = () => {
    setOpen(false);
    setLocation("/app/clients/1"); // Redirect to a workspace to see the strategy
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Strategies</h1>
            <p className="text-muted-foreground">Comprehensive marketing plans for your clients</p>
          </div>
          
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setStep(1); }}>
            <DialogTrigger asChild>
              <Button data-testid="button-generate-strategy">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Strategy
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate Marketing Strategy</DialogTitle>
                <DialogDescription>
                  Our AI engine will create a tailored strategy based on client data.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Client</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">TechNova Inc.</SelectItem>
                          <SelectItem value="2">GreenEarth Cafe</SelectItem>
                          <SelectItem value="3">Alpha Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Strategy Name</Label>
                      <Input placeholder="e.g. Q2 Performance Push" />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Focus</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select focus area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leads">Lead Generation</SelectItem>
                          <SelectItem value="brand">Brand Awareness</SelectItem>
                          <SelectItem value="retention">Customer Retention</SelectItem>
                          <SelectItem value="launch">Product Launch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 flex flex-col items-center py-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                      <Target className="w-8 h-8" />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="font-semibold text-lg">Ready to Generate</h4>
                      <p className="text-sm text-muted-foreground">We've gathered all necessary brand assets and market data for TechNova Inc. The generation process takes about 30 seconds.</p>
                    </div>
                    <div className="w-full space-y-2">
                       <div className="flex justify-between text-xs">
                         <span>Data Preparation</span>
                         <span className="text-green-600 flex items-center"><Check className="w-3 h-3 mr-1" /> Ready</span>
                       </div>
                       <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                         <div className="h-full bg-green-500 w-full"></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                {step === 1 ? (
                  <Button onClick={() => setStep(2)} className="w-full">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button onClick={handleCreate} className="flex-1">Generate Strategy</Button>
                  </div>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-download-strat-${strat.id}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-more-strat-${strat.id}`}>
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
