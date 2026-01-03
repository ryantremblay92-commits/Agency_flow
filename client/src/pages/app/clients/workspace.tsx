import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Settings, 
  Download, 
  Share2, 
  FileText, 
  Megaphone, 
  Calendar, 
  RefreshCw,
  MoreHorizontal,
  Plus,
  Target,
  BarChart,
  Users
} from "lucide-react";
import { Link, useRoute } from "wouter";
import { useState } from "react";

export default function ClientWorkspace() {
  const [match, params] = useRoute("/app/clients/:id");
  const id = params?.id || "1";
  
  // Mock data based on ID (simplified)
  const client = {
    name: "TechNova Inc.",
    industry: "SaaS",
    status: "Active",
    budget: "$5,000 / mo",
    logo: "TN"
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
            <Link href="/app/clients">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                {client.logo}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="rounded-sm font-normal text-xs px-2 py-0.5">{client.industry}</Badge>
                  <span>•</span>
                  <span>{client.status}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              {isGenerating ? "Generating..." : "New Campaign"}
            </Button>
          </div>
        </div>

        {/* Main Workspace Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <TabsList className="w-full justify-start h-11 bg-transparent border-b rounded-none p-0 space-x-6 overflow-x-auto">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 pt-2 font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="strategy" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 pt-2 font-medium"
              >
                Strategy Doc
              </TabsTrigger>
              <TabsTrigger 
                value="campaigns" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 pt-2 font-medium"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 pt-2 font-medium"
              >
                Content Calendar
              </TabsTrigger>
               <TabsTrigger 
                value="files" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 pt-2 font-medium"
              >
                Files & Exports
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto py-6">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="m-0 h-full">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Performance Snapshot</CardTitle>
                    <CardDescription>Last 30 days vs previous period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full bg-muted/10 rounded-lg flex items-center justify-center border border-dashed">
                      <span className="text-muted-foreground flex items-center">
                        <BarChart className="mr-2 w-4 h-4" /> Chart Visualization Placeholder
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Usage</CardTitle>
                    <CardDescription>Monthly cap: $5,000</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <div className="flex items-center justify-between text-sm">
                         <span>Spent</span>
                         <span className="font-bold">$3,240</span>
                       </div>
                       <Progress value={65} className="h-2" />
                       <p className="text-xs text-muted-foreground text-right">65% used</p>
                     </div>
                     <div className="pt-4 border-t space-y-2">
                       <h4 className="text-sm font-medium mb-2">Top Spending Channels</h4>
                       <div className="flex justify-between text-sm">
                         <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div> Facebook Ads</span>
                         <span>$1,200</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div> Instagram</span>
                         <span>$950</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-sky-500 mr-2"></div> LinkedIn</span>
                         <span>$890</span>
                       </div>
                     </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Active Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                       {[
                         { title: "Q1 Lead Gen Push", status: "Active", progress: 45, date: "Ends Mar 31" },
                         { title: "Brand Awareness Reload", status: "Review", progress: 90, date: "Ends Feb 15" },
                         { title: "Competitor Displacement", status: "Draft", progress: 10, date: "Starts Apr 1" },
                       ].map((item, i) => (
                         <div key={i} className="border rounded-lg p-4 hover:bg-muted/5 cursor-pointer transition-colors">
                           <div className="flex justify-between items-start mb-2">
                             <div className="font-semibold">{item.title}</div>
                             <Badge variant={item.status === "Active" ? "default" : "outline"}>{item.status}</Badge>
                           </div>
                           <div className="space-y-1 mb-3">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{item.progress}%</span>
                              </div>
                              <Progress value={item.progress} className="h-1.5" />
                           </div>
                           <p className="text-xs text-muted-foreground">{item.date}</p>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* STRATEGY TAB */}
            <TabsContent value="strategy" className="m-0 h-full">
              <div className="grid grid-cols-12 gap-6 h-full">
                <div className="col-span-3 hidden xl:block space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Strategy Sections</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-1 p-2">
                      {["Executive Summary", "Market Analysis", "Target Audience", "Value Proposition", "Channel Strategy", "Content Pillars", "Budget Allocation", "KPIs & Measurement"].map((section, i) => (
                        <Button key={i} variant="ghost" className="justify-start h-8 text-sm font-normal">
                          {i + 1}. {section}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">AI Assistant</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-4">Select any text to rewrite or expand it using our Strategy Engine.</p>
                      <Button variant="outline" className="w-full text-xs" size="sm">
                        <RefreshCw className="w-3 h-3 mr-2" /> Regenerate Section
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="col-span-12 xl:col-span-9">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between border-b py-4">
                       <div>
                         <CardTitle>Q1 2026 Growth Strategy</CardTitle>
                         <CardDescription>Last edited 2 hours ago by Sarah J.</CardDescription>
                       </div>
                       <div className="flex gap-2">
                         <Button variant="outline" size="sm">
                           <Download className="w-4 h-4 mr-2" /> PDF
                         </Button>
                         <Button size="sm">
                           Edit Document
                         </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-8 max-w-[800px] mx-auto w-full bg-white text-slate-900 leading-relaxed space-y-8">
                       {/* Mock Document Content */}
                       <div className="space-y-4">
                         <h1 className="text-3xl font-bold text-slate-900">Executive Summary</h1>
                         <p>TechNova Inc. is positioned to capture a significant market share in the mid-market SaaS sector. Our primary objective for Q1 2026 is to increase qualified leads by 25% while reducing CAC by 10%. This strategy outlines a multi-channel approach leveraging LinkedIn organic reach, targeted paid search, and high-value content syndication.</p>
                       </div>
                       
                       <div className="space-y-4">
                         <h2 className="text-2xl font-bold text-slate-900">1. Market Analysis</h2>
                         <p>The current landscape indicates a shift towards AI-integrated workflow tools. Competitors X and Y have recently raised prices, creating an opportunity for TechNova to capture price-sensitive yet feature-hungry users.</p>
                         <ul className="list-disc pl-5 space-y-2">
                           <li><strong>Opportunity:</strong> Mid-market dissatisfaction with enterprise tools.</li>
                           <li><strong>Threat:</strong> Rapid AI feature deployment by startups.</li>
                           <li><strong>Strength:</strong> Robust API and integration ecosystem.</li>
                         </ul>
                       </div>

                       <div className="space-y-4">
                         <h2 className="text-2xl font-bold text-slate-900">2. Target Audience (ICP)</h2>
                         <p>Our focus remains on CTOs and VP of Engineering at Series A-B funded companies.</p>
                         <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <h3 className="font-bold mb-2">Persona: Technical Tom</h3>
                            <p className="text-sm">Tom cares about scalability, security compliance, and ease of developer onboarding. He is resistant to "marketing fluff" and responds to technical deep dives and documentation.</p>
                         </div>
                       </div>
                       
                       <div className="h-64"></div> {/* Spacer for scroll */}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* CAMPAIGNS TAB */}
            <TabsContent value="campaigns" className="m-0">
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Campaigns</CardTitle>
                      <CardDescription>Manage active and scheduled campaigns</CardDescription>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> Create Campaign
                    </Button>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                      {[
                        { name: "LinkedIn Cold Outreach", platform: "LinkedIn", status: "Active", spend: "$1,200", conversions: 45, roi: "3.2x" },
                        { name: "Google Search - Intent", platform: "Google Ads", status: "Active", spend: "$850", conversions: 120, roi: "4.5x" },
                        { name: "Retargeting Display", platform: "Display", status: "Paused", spend: "$300", conversions: 12, roi: "1.1x" },
                        { name: "Newsletter Sponsorship", platform: "Email", status: "Scheduled", spend: "$500", conversions: 0, roi: "-" },
                      ].map((camp, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/5 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                 <Megaphone className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div>
                                 <h4 className="font-semibold">{camp.name}</h4>
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{camp.platform}</span>
                                    <span>•</span>
                                    <Badge variant={camp.status === "Active" ? "default" : "outline"} className="h-5 px-1.5 text-[10px] uppercase">{camp.status}</Badge>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-8 text-sm">
                              <div className="text-center">
                                 <span className="block text-muted-foreground text-xs">Spend</span>
                                 <span className="font-medium">{camp.spend}</span>
                              </div>
                              <div className="text-center">
                                 <span className="block text-muted-foreground text-xs">Conv.</span>
                                 <span className="font-medium">{camp.conversions}</span>
                              </div>
                              <div className="text-center hidden sm:block">
                                 <span className="block text-muted-foreground text-xs">ROI</span>
                                 <span className="font-medium text-green-600">{camp.roi}</span>
                              </div>
                              <Button variant="ghost" size="icon">
                                 <MoreHorizontal className="w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                      ))}
                   </div>
                 </CardContent>
               </Card>
            </TabsContent>

             {/* CONTENT TAB */}
             <TabsContent value="content" className="m-0">
               <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Content Calendar</CardTitle>
                        <CardDescription>Scheduled posts and articles</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">List View</Button>
                        <Button>Calendar View</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-4 min-h-[500px]">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2 border-b">
                          {day}
                        </div>
                      ))}
                      
                      {/* Mock Calendar Grid - simple version */}
                      {Array.from({ length: 35 }).map((_, i) => {
                        const hasContent = [4, 8, 12, 15, 22, 28].includes(i);
                        return (
                          <div key={i} className="min-h-[100px] border rounded-md p-2 relative hover:bg-muted/5 transition-colors">
                             <span className="text-xs text-muted-foreground">{i + 1}</span>
                             {hasContent && (
                               <div className="mt-2 p-1.5 rounded bg-primary/10 border border-primary/20 text-xs font-medium text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                                 LinkedIn Post
                               </div>
                             )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
               </Card>
             </TabsContent>
             
             {/* EXPORTS TAB */}
             <TabsContent value="files" className="m-0">
               <Card>
                 <CardHeader>
                   <CardTitle>Files & Exports</CardTitle>
                   <CardDescription>Download strategies, reports, and assets.</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/5 cursor-pointer group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-red-100 text-red-600 flex items-center justify-center">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="font-medium group-hover:text-primary transition-colors">Q1 Strategy Document.pdf</h4>
                               <p className="text-xs text-muted-foreground">Generated 2 days ago • 2.4 MB</p>
                            </div>
                         </div>
                         <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                         </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/5 cursor-pointer group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-green-100 text-green-600 flex items-center justify-center">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="font-medium group-hover:text-primary transition-colors">Campaign Performance.xlsx</h4>
                               <p className="text-xs text-muted-foreground">Updated yesterday • 145 KB</p>
                            </div>
                         </div>
                         <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                         </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/5 cursor-pointer group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="font-medium group-hover:text-primary transition-colors">Brand Assets Bundle.zip</h4>
                               <p className="text-xs text-muted-foreground">Brand Kit • 12 MB</p>
                            </div>
                         </div>
                         <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                         </Button>
                      </div>
                   </div>
                 </CardContent>
               </Card>
             </TabsContent>

          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
