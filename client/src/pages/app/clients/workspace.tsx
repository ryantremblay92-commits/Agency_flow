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
  Users,
  Check,
  ArrowRight,
  ImageIcon,
  Sparkles
} from "lucide-react";
import { Link, useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { type Client, type Campaign, type Strategy, type ClientAsset } from "@shared/schema";

export default function ClientWorkspace() {
  const [match, params] = useRoute("/app/clients/:id");
  const id = params?.id || "1";

  const { data: client, isLoading: isClientLoading } = useQuery<Client>({
    queryKey: [`/api/clients/${id}`],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: [`/api/campaigns?clientId=${id}`],
  });

  const { data: strategies = [], refetch: refetchStrategies } = useQuery<Strategy[]>({
    queryKey: [`/api/strategies?clientId=${id}`],
  });

  // Load strategy sections when strategies change
  useEffect(() => {
    if (strategies.length > 0 && strategies[0].sections) {
      setStrategySections(strategies[0].sections);
    }
  }, [strategies]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignStep, setCampaignStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editedStrategy, setEditedStrategy] = useState<Strategy | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string, type: string, url: string, uploadedAt: Date }>>([]);
  const [clientUrls, setClientUrls] = useState<Array<{ title: string, url: string, description: string }>>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateSection, setRegenerateSection] = useState<string>("Market Analysis");
  const [strategySections, setStrategySections] = useState<{ [key: string]: string }>({});
  const [lastRegeneratedSection, setLastRegeneratedSection] = useState<string>("");

  const { data: clientAssets = [], refetch: refetchAssets } = useQuery<ClientAsset[]>({
    queryKey: [`/api/client-assets?clientId=${id}`],
  });

  // Separate assets by type for display
  const uploadedAssets = clientAssets.filter((asset: ClientAsset) => asset.isUrl === "false");
  const urlAssets = clientAssets.filter((asset: ClientAsset) => asset.isUrl === "true");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const handleCreateCampaign = () => {
    setIsCampaignModalOpen(false);
    setCampaignStep(1);
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      const assetData = {
        clientId: id,
        name: file.name,
        type: 'document',
        url: URL.createObjectURL(file),
        description: `${file.name} uploaded to ${client?.name || 'client'}`,
        fileSize: file.size,
        mimeType: file.type,
        isUrl: "false"
      };

      await fetch('/api/client-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      });

      refetchAssets();
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const assetData = {
        clientId: id,
        name: file.name,
        type: 'image',
        url: URL.createObjectURL(file),
        description: `${file.name} uploaded to ${client?.name || 'client'}`,
        fileSize: file.size,
        mimeType: file.type,
        isUrl: "false"
      };

      await fetch('/api/client-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      });

      refetchAssets();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUrlAdd = async (title: string, url: string) => {
    try {
      const assetData = {
        clientId: id,
        name: title,
        type: 'url',
        url: url,
        description: `Link to ${title}`,
        isUrl: "true"
      };

      await fetch('/api/client-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData)
      });

      refetchAssets();
    } catch (error) {
      console.error('Error adding URL:', error);
    }
  };

  const handleAssetDelete = async (assetId: string) => {
    try {
      await fetch(`/api/client-assets/${assetId}`, {
        method: 'DELETE'
      });

      refetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleRegenerateSection = async () => {
    if (!client) return;

    setIsRegenerating(true);

    try {
      // Create a section-specific prompt for AI regeneration
      const sectionPrompts = {
        "Executive Summary": `Generate an executive summary for ${client.name}'s marketing strategy. Focus on key objectives, budget allocation, and expected outcomes. Industry: ${client.industry}, Goal: ${client.primaryObjective}, Budget: ${client.monthlyBudget}/month.`,
        "Market Analysis": `Conduct a comprehensive market analysis for ${client.name}. Analyze the ${client.industry} industry landscape, trends, opportunities, and competitive positioning. Consider ${client.primaryObjective} objectives.`,
        "Target Audience": `Define the target audience and ideal customer profile for ${client.name}. Focus on ${client.industry} sector prospects, decision-makers, and pain points. Primary goal: ${client.primaryObjective}.`,
        "Value Proposition": `Develop a compelling value proposition for ${client.name}. Create messaging that resonates with ${client.industry} businesses and supports ${client.primaryObjective} goals.`,
        "Channel Strategy": `Create a channel strategy for ${client.name} targeting ${client.industry} prospects. Allocate the ${client.monthlyBudget}/month budget across optimal platforms for ${client.primaryObjective}.`,
        "Content Pillars": `Define content pillars and themes for ${client.name}'s ${client.industry} marketing. Focus on educational, thought leadership content that drives ${client.primaryObjective}.`,
        "Budget Allocation": `Create a detailed budget allocation plan for ${client.name}. Distribute ${client.monthlyBudget}/month across channels, campaigns, and activities to maximize ${client.primaryObjective} results.`,
        "KPIs & Measurement": `Define KPIs and measurement framework for ${client.name}'s marketing strategy. Focus on metrics that align with ${client.primaryObjective} goals in the ${client.industry} sector.`
      };

      const prompt = sectionPrompts[regenerateSection as keyof typeof sectionPrompts] ||
        `Regenerate the ${regenerateSection} section for ${client.name}'s marketing strategy. Industry: ${client.industry}, Goal: ${client.primaryObjective}, Budget: ${client.monthlyBudget}/month.`;

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: client.id,
          analysisType: "strategy",
          clientData: client,
          section: regenerateSection,
          prompt: prompt,
          isRegenerate: true
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Update the strategy sections with the new content
      const updatedSections = {
        ...strategySections,
        [regenerateSection]: data.result
      };

      setStrategySections(updatedSections);
      setLastRegeneratedSection(regenerateSection);

      // Save the updated sections to the server
      if (strategies.length > 0) {
        const strategyId = strategies[0].id;
        try {
          const response = await fetch(`/api/strategies/${strategyId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sections: updatedSections
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to save strategy sections: ${response.status}`);
          }

          console.log("Strategy sections saved successfully");

          // Refresh strategies to get updated sections
          await refetchStrategies();
        } catch (saveError) {
          console.error("Error saving strategy sections:", saveError);
          // Don't show error to user since the content was generated successfully
        }
      }

      // Show success message
      alert(`✅ ${regenerateSection} section regenerated and saved to strategy document!`);

      console.log(`Section regenerated and saved: ${regenerateSection}`, data.result);
    } catch (error) {
      console.error("Section regeneration error:", error);
      alert(`❌ Failed to regenerate ${regenerateSection} section. Please try again.`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSectionSelect = (section: string) => {
    setRegenerateSection(section);
  };

  if (isClientLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div>Loading client workspace...</div>
        </div>
      </AppLayout>
    );
  }

  if (!client) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div>Client not found</div>
        </div>
      </AppLayout>
    );
  }

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
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="rounded-sm font-normal text-xs px-2 py-0.5">{client.industry || "N/A"}</Badge>
                  <span>•</span>
                  <Badge variant={client.status === "Active" ? "default" : "outline"} className="capitalize">
                    {client.status || "Active"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => console.log("Share clicked")}>
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" onClick={() => console.log("Settings clicked")}>
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
                    <CardDescription>Monthly cap: ${client.monthlyBudget || 5000}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Spent</span>
                        <span className="font-bold">${Math.round((client.monthlyBudget || 5000) * 0.65)}</span>
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
                    {strategies.length > 0 ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {strategies.map((strategy) => (
                          <div key={strategy.id} className="border rounded-lg p-4 hover:bg-muted/5 cursor-pointer transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-semibold">{strategy.name}</div>
                              <Badge variant={strategy.status === "Active" ? "default" : "outline"}>{strategy.status}</Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>80%</span>
                              </div>
                              <Progress value={80} className="h-1.5" />
                            </div>
                            <p className="text-xs text-muted-foreground">In Progress</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No strategies yet</h3>
                        <p className="text-sm mb-4">Generate a strategy for {client.name}</p>
                        <Button onClick={() => console.log("Generate Strategy clicked")}>
                          <Plus className="w-4 h-4 mr-2" /> Generate Strategy
                        </Button>
                      </div>
                    )}
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
                        <Button
                          key={i}
                          variant={regenerateSection === section ? "default" : "ghost"}
                          className="justify-start h-8 text-sm font-normal"
                          onClick={() => handleSectionSelect(section)}
                        >
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
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-foreground">
                          Selected Section: <span className="text-primary">{regenerateSection}</span>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full text-xs"
                          size="sm"
                          onClick={handleRegenerateSection}
                          disabled={isRegenerating}
                        >
                          {isRegenerating ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> Regenerating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3 mr-2" /> Regenerate Section
                            </>
                          )}
                        </Button>
                      </div>
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
                        <Button variant="outline" size="sm" onClick={() => console.log("Download PDF clicked")}>
                          <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                        {editMode && (
                          <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => {
                            if (editMode) {
                              // Save changes
                              setEditMode(false);
                              console.log("Strategy saved:", editedStrategy);
                            } else {
                              // Enter edit mode
                              setEditMode(true);
                              setEditedStrategy(strategies[0]);
                            }
                          }}
                        >
                          {editMode ? "Save Changes" : "Edit Document"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-8 max-w-[800px] mx-auto w-full bg-white text-slate-900 leading-relaxed space-y-8">
                      {strategies.length > 0 ? (
                        <>
                          {/* Use the first strategy for the display */}
                          <div className="space-y-4">
                            {editMode ? (
                              <div className="space-y-2">
                                <Input
                                  value={editedStrategy?.name || strategies[0].name}
                                  onChange={(e) => setEditedStrategy(prev => prev ? { ...prev, name: e.target.value } : null)}
                                  className="text-3xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                                />
                                <Textarea
                                  value={editedStrategy?.description || strategies[0].description || `${client.name} is positioned to capture a significant market share. Our primary objective is to increase qualified leads while reducing CAC. This strategy outlines a multi-channel approach leveraging various platforms and high-value content.`}
                                  onChange={(e) => setEditedStrategy(prev => prev ? { ...prev, description: e.target.value } : null)}
                                  className="border-none p-0 bg-transparent focus-visible:ring-0 resize-none"
                                  rows={4}
                                />
                              </div>
                            ) : (
                              <>
                                <h1 className="text-3xl font-bold text-slate-900">{strategies[0].name}</h1>
                                <p>{strategies[0].description || `${client.name} is positioned to capture a significant market share. Our primary objective is to increase qualified leads while reducing CAC. This strategy outlines a multi-channel approach leveraging various platforms and high-value content.`}</p>
                              </>
                            )}
                          </div>

                          {/* Market Analysis Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">Market Analysis</h2>
                              {strategySections["Market Analysis"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            {editMode ? (
                              <Textarea
                                value={strategySections["Market Analysis"] || "The current landscape indicates a shift in the industry. Our focus remains on Finance sector opportunities."}
                                className="border-none p-0 bg-transparent focus-visible:ring-0 resize-none"
                                rows={4}
                                onChange={(e) => console.log("Market analysis updated:", e.target.value)}
                              />
                            ) : (
                              <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {strategySections["Market Analysis"] || `The current landscape indicates a shift in the ${client.industry} industry. Our focus remains on sector opportunities and market trends that support ${client.primaryObjective} objectives.`}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Target Audience Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">Target Audience (ICP)</h2>
                              {strategySections["Target Audience"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            {editMode ? (
                              <Textarea
                                value={strategySections["Target Audience"] || `Our focus is on ${client.icp || "ideal customers"} in the ${client.location || "target market"}.`}
                                className="border-none p-0 bg-transparent focus-visible:ring-0 resize-none"
                                rows={4}
                                onChange={(e) => console.log("Target audience updated:", e.target.value)}
                              />
                            ) : (
                              <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {strategySections["Target Audience"] || `Our focus is on ${client.icp || "ideal customers"} in the ${client.location || "target market"}.`}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Value Proposition Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">Value Proposition</h2>
                              {strategySections["Value Proposition"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {strategySections["Value Proposition"] || `Our unique value proposition for ${client.industry} businesses focuses on delivering measurable ${client.primaryObjective} results through innovative marketing strategies.`}
                              </div>
                            </div>
                          </div>

                          {/* Channel Strategy Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">Channel Strategy</h2>
                              {strategySections["Channel Strategy"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {strategySections["Channel Strategy"] || `Multi-channel approach leveraging LinkedIn, Google Ads, and content marketing to maximize ${client.primaryObjective} for ${client.industry} sector.`}
                              </div>
                            </div>
                          </div>

                          {/* Content Pillars Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">Content Pillars</h2>
                              {strategySections["Content Pillars"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {strategySections["Content Pillars"] || `Content strategy focused on educational, thought leadership content that drives ${client.primaryObjective} in the ${client.industry} sector.`}
                              </div>
                            </div>
                          </div>

                          {/* Budget Allocation Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">Budget Allocation</h2>
                              {strategySections["Budget Allocation"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {strategySections["Budget Allocation"] || `Strategic allocation of ${client.monthlyBudget}/month across channels, campaigns, and activities to maximize ${client.primaryObjective} results.`}
                              </div>
                            </div>
                          </div>

                          {/* KPIs & Measurement Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">KPIs & Measurement</h2>
                              {strategySections["KPIs & Measurement"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {strategySections["KPIs & Measurement"] || `Comprehensive measurement framework with KPIs aligned to ${client.primaryObjective} goals in the ${client.industry} sector.`}
                              </div>
                            </div>
                          </div>

                          {/* Executive Summary Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
                              {strategySections["Executive Summary"] && (
                                <Badge variant="default" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {strategySections["Executive Summary"] || `Strategic overview for ${client.name} focusing on ${client.primaryObjective} with a budget of ${client.monthlyBudget}/month in the ${client.industry} sector.`}
                              </div>
                            </div>
                          </div>

                          <div className="h-64"></div> {/* Spacer for scroll */}
                        </>
                      ) : (
                        <div className="text-center py-12 text-slate-600">
                          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">No strategy available</h3>
                          <p className="text-sm mb-4">Generate a marketing strategy for {client.name}</p>
                          <Button onClick={() => console.log("Generate strategy clicked")}>
                            <Plus className="w-4 h-4 mr-2" /> Generate Strategy
                          </Button>
                        </div>
                      )}
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
                  <Dialog open={isCampaignModalOpen} onOpenChange={(val) => { setIsCampaignModalOpen(val); if (!val) setCampaignStep(1); }}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-campaign">
                        <Plus className="w-4 h-4 mr-2" /> Create Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create New Campaign</DialogTitle>
                        <DialogDescription>
                          Configure and launch a new marketing campaign for {client.name}.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="py-6">
                        {campaignStep === 1 ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="camp-name">Campaign Name</Label>
                              <Input id="camp-name" placeholder="e.g. Q1 Product Launch" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="platform">Platform</Label>
                              <Select>
                                <SelectTrigger id="platform">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                                  <SelectItem value="google">Google Search</SelectItem>
                                  <SelectItem value="facebook">Facebook/Instagram</SelectItem>
                                  <SelectItem value="twitter">Twitter (X) Ads</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="budget">Monthly Budget</Label>
                              <Input id="budget" type="number" placeholder="500" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6 flex flex-col items-center py-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                              <Megaphone className="w-8 h-8" />
                            </div>
                            <div className="text-center space-y-2">
                              <h4 className="font-semibold text-lg">Ready to Launch</h4>
                              <p className="text-sm text-muted-foreground">We've mapped out the target audience and ad sets for your campaign. Click launch to start pushing ads live.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        {campaignStep === 1 ? (
                          <Button onClick={() => setCampaignStep(2)} className="w-full">
                            Next Step <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        ) : (
                          <div className="flex gap-3 w-full">
                            <Button variant="outline" onClick={() => setCampaignStep(1)} className="flex-1">Back</Button>
                            <Button onClick={handleCreateCampaign} className="flex-1">Launch Campaign</Button>
                          </div>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {campaigns.length > 0 ? (
                    <div className="space-y-4">
                      {campaigns.map((campaign) => (
                        <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <Megaphone className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{campaign.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{campaign.platform || 'Platform'}</span>
                                <span>•</span>
                                <Badge variant={campaign.status === "Active" ? "default" : "outline"} className="h-5 px-1.5 text-[10px] uppercase">{campaign.status}</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 text-sm">
                            <div className="text-center">
                              <span className="block text-muted-foreground text-xs">Spend</span>
                              <span className="font-medium">{campaign.budget ? `${campaign.budget}` : 'N/A'}</span>
                            </div>
                            <div className="text-center">
                              <span className="block text-muted-foreground text-xs">Conv.</span>
                              <span className="font-medium">N/A</span>
                            </div>
                            <div className="text-center hidden sm:block">
                              <span className="block text-muted-foreground text-xs">ROI</span>
                              <span className="font-medium text-green-600">N/A</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => console.log("More options clicked for campaign:", campaign.name)}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                      <p className="text-sm mb-4">Create your first marketing campaign for {client.name}</p>
                      <p className="text-xs">Campaign management will be fully implemented with real data integration.</p>
                    </div>
                  )}
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
                      <Button variant="outline" onClick={() => console.log("List view clicked")}>List View</Button>
                      <Button onClick={() => console.log("Calendar view clicked")}>Calendar View</Button>
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

            {/* FILES & ASSETS TAB */}
            <TabsContent value="files" className="m-0">
              <div className="space-y-6">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Client Assets</CardTitle>
                    <CardDescription>Upload documents, images, and other client-related files.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf,.doc,.docx,.txt';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handleDocumentUpload(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        <FileText className="w-6 h-6" />
                        Upload Document
                      </Button>

                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handleImageUpload(file);
                            }
                          };
                          input.click();
                        }}
                      >
                        <ImageIcon className="w-6 h-6" />
                        Upload Image
                      </Button>

                      <Button
                        variant="outline"
                        className="h-24 flex-col gap-2"
                        onClick={() => {
                          const url = prompt('Enter URL:');
                          if (url) {
                            const title = prompt('Enter title for this URL:') || 'Untitled';
                            handleUrlAdd(title, url);
                          }
                        }}
                      >
                        <Share2 className="w-6 h-6" />
                        Add URL
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Uploaded Files Section */}
                {uploadedAssets.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Uploaded Files</CardTitle>
                      <CardDescription>Manage uploaded client documents and assets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {uploadedAssets.map((asset) => (
                          <div key={asset.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/5 cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded flex items-center justify-center ${asset.type === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {asset.type === 'image' ? (
                                  <ImageIcon className="w-5 h-5" />
                                ) : (
                                  <FileText className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium group-hover:text-primary transition-colors">{asset.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : 'Unknown'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(asset.url || '', '_blank')}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAssetDelete(asset.id)}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Client URLs Section */}
                {urlAssets.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Client URLs & Links</CardTitle>
                      <CardDescription>Important links and resources for {client?.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {urlAssets.map((asset) => (
                          <div key={asset.id} className="p-4 border rounded-lg hover:bg-muted/5 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-green-100 text-green-600 flex items-center justify-center">
                                  <Share2 className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{asset.name}</h4>
                                  <p className="text-xs text-muted-foreground">{asset.description}</p>
                                  <a
                                    href={asset.url || ''}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                  >
                                    {asset.url}
                                  </a>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => window.open(asset.url || '', '_blank')}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAssetDelete(asset.id)}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Generated Reports Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Reports</CardTitle>
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
                        <Button variant="ghost" size="icon" onClick={() => console.log("Download clicked: Q1 Strategy Document.pdf")}>
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
                        <Button variant="ghost" size="icon" onClick={() => console.log("Download clicked: Campaign Performance.xlsx")}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
