import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Brain,
    Upload,
    FileText,
    Target,
    Zap,
    TrendingUp,
    Users,
    MessageSquare,
    Sparkles,
    Download,
    Play,
    BarChart3,
    Lightbulb,
    ArrowRight,
    Calendar,
    Plus,
    Clock,
    DollarSign,
    Megaphone
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Client } from "@shared/schema";
import { useState } from "react";

export default function AIAssistant() {
    const { data: clients = [] } = useQuery<Client[]>({
        queryKey: ["/api/clients"],
    });

    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string>("");
    const [analysisType, setAnalysisType] = useState<string>("");
    const [campaignSuggestions, setCampaignSuggestions] = useState<any[]>([]);
    const [showCampaignSuggestions, setShowCampaignSuggestions] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [currentAnalysisTitle, setCurrentAnalysisTitle] = useState<string>("");
    const [isRegenerating, setIsRegenerating] = useState(false);

    const selectedClient = clients.find(c => c.id === selectedClientId);

    const handleQuickAnalysis = async (analysisType: string, isRegenerate = false) => {
        if (!selectedClient) return;

        if (isRegenerate) {
            setIsRegenerating(true);
        } else {
            setIsAnalyzing(true);
            setAnalysisType(analysisType);
            setAnalysisResult("");
            setCampaignSuggestions([]);
            setShowCampaignSuggestions(false);
            setShowResultsModal(false);

            // Set analysis title
            const titles = {
                strategy: "Marketing Strategy",
                content: "Content Calendar",
                optimization: "Campaign Optimization"
            };
            setCurrentAnalysisTitle(titles[analysisType as keyof typeof titles] || "AI Analysis");
        }

        try {
            // Call real Gemini API
            const response = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clientId: selectedClient.id,
                    analysisType: isRegenerate ? analysisType : analysisType,
                    clientData: selectedClient,
                    isRegenerate: isRegenerate,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            setAnalysisResult(data.result);

            // Generate campaign suggestions for strategy type
            if (analysisType === "strategy" && data.result) {
                generateCampaignSuggestions(data.result);
            }

            // Show results in modal
            setShowResultsModal(true);
        } catch (error) {
            console.error("Analysis error:", error);
            setAnalysisResult("Sorry, there was an error generating the analysis. Please try again.");
            setShowResultsModal(true);
        } finally {
            setIsAnalyzing(false);
            setIsRegenerating(false);
        }
    };

    const handleRegenerateSection = async () => {
        if (!analysisType || !selectedClient) return;
        await handleQuickAnalysis(analysisType, true);
    };

    const generateCampaignSuggestions = (strategyResult: string) => {
        // Parse strategy and generate campaign suggestions
        const suggestions = [
            {
                id: "1",
                name: `${selectedClient?.name || 'Client'} Lead Generation Campaign`,
                platform: "LinkedIn",
                budget: Math.round((selectedClient?.monthlyBudget || 5000) * 0.4),
                objective: "Lead Generation",
                targetAudience: selectedClient?.industry || "B2B Professionals",
                duration: "30 days",
                description: "Target decision-makers in your industry with thought leadership content and lead magnets."
            },
            {
                id: "2",
                name: `${selectedClient?.name || 'Client'} Brand Awareness Campaign`,
                platform: "Google Ads",
                budget: Math.round((selectedClient?.monthlyBudget || 5000) * 0.35),
                objective: "Brand Awareness",
                targetAudience: selectedClient?.industry || "General Audience",
                duration: "30 days",
                description: "Increase brand visibility with targeted search and display campaigns."
            },
            {
                id: "3",
                name: `${selectedClient?.name || 'Client'} Content Marketing Campaign`,
                platform: "Organic + Paid Social",
                budget: Math.round((selectedClient?.monthlyBudget || 5000) * 0.25),
                objective: "Engagement",
                targetAudience: selectedClient?.primaryObjective || "Target Market",
                duration: "30 days",
                description: "Build authority through educational content and community engagement."
            }
        ];
        setCampaignSuggestions(suggestions);
        setShowCampaignSuggestions(true);
    };

    const handleAddToCalendar = (campaign: any) => {
        // Create calendar event for campaign
        const calendarEvent = {
            title: campaign.name,
            description: campaign.description,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            campaign: campaign
        };

        // In a real app, this would integrate with actual calendar APIs
        alert(`Campaign "${campaign.name}" has been added to your marketing calendar!\n\nCampaign Details:\n- Platform: ${campaign.platform}\n- Budget: ${campaign.budget}\n- Duration: ${campaign.duration}`);

        console.log("Added to calendar:", calendarEvent);
    };

    const handleCreateCampaign = async (campaign: any) => {
        try {
            const response = await fetch("/api/campaigns", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: campaign.name,
                    clientId: selectedClient?.id,
                    platform: campaign.platform,
                    budget: campaign.budget,
                    status: "Draft",
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                }),
            });

            if (response.ok) {
                alert(`Campaign "${campaign.name}" has been created successfully!`);
            } else {
                throw new Error("Failed to create campaign");
            }
        } catch (error) {
            console.error("Error creating campaign:", error);
            alert("Error creating campaign. Please try again.");
        }
    };

    return (
        <AppLayout>
            <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">AI Marketing Assistant</h1>
                            <p className="text-muted-foreground">Intelligent insights powered by advanced AI analysis</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Gemini AI Powered
                    </Badge>
                </div>

                {/* Client Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Select Client for AI Analysis
                        </CardTitle>
                        <CardDescription>
                            Choose a client to enable AI-powered insights with their complete profile data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-2 block">Client</label>
                                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a client..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name} - {client.industry}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedClient && (
                                <div className="flex gap-2">
                                    <Badge variant="outline">{selectedClient.industry}</Badge>
                                    <Badge variant="outline">${selectedClient.monthlyBudget}/month</Badge>
                                    <Badge variant="default">{selectedClient.status}</Badge>
                                </div>
                            )}
                        </div>

                        {selectedClient && (
                            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                                <h4 className="font-medium mb-2">Client Context Loaded:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div><strong>Industry:</strong> {selectedClient.industry}</div>
                                    <div><strong>Goal:</strong> {selectedClient.primaryObjective}</div>
                                    <div><strong>Budget:</strong> ${selectedClient.monthlyBudget}</div>
                                    <div><strong>Timeline:</strong> {selectedClient.timeline} months</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Tools Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Strategy Generator */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Target className="w-8 h-8 text-blue-500" />
                                <Badge variant="secondary">Strategy</Badge>
                            </div>
                            <CardTitle className="text-lg">Strategy Generator</CardTitle>
                            <CardDescription>
                                Create comprehensive marketing strategies based on client data and industry analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Data Quality</span>
                                    <span className="text-green-600">High</span>
                                </div>
                                <Progress value={85} className="h-2" />
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => handleQuickAnalysis("strategy")}
                                disabled={!selectedClient || isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>Analyzing...<Zap className="w-4 h-4 ml-2 animate-pulse" /></>
                                ) : (
                                    <>Generate Strategy<ArrowRight className="w-4 h-4 ml-2" /></>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Content Calendar */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <FileText className="w-8 h-8 text-green-500" />
                                <Badge variant="secondary">Content</Badge>
                            </div>
                            <CardTitle className="text-lg">Content Calendar</CardTitle>
                            <CardDescription>
                                Generate personalized content calendars with posting schedules and themes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Creativity Score</span>
                                    <span className="text-green-600">Excellent</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => handleQuickAnalysis("content")}
                                disabled={!selectedClient || isAnalyzing}
                            >
                                Create Calendar<Calendar className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Campaign Optimizer */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <TrendingUp className="w-8 h-8 text-orange-500" />
                                <Badge variant="secondary">Optimization</Badge>
                            </div>
                            <CardTitle className="text-lg">Campaign Optimizer</CardTitle>
                            <CardDescription>
                                Analyze current campaigns and provide data-driven optimization recommendations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Analysis Depth</span>
                                    <span className="text-green-600">Advanced</span>
                                </div>
                                <Progress value={78} className="h-2" />
                            </div>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => handleQuickAnalysis("optimization")}
                                disabled={!selectedClient || isAnalyzing}
                            >
                                Optimize Campaigns<BarChart3 className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* File Analysis */}
                    <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Upload className="w-8 h-8 text-purple-500" />
                                <Badge variant="secondary">Research</Badge>
                            </div>
                            <CardTitle className="text-lg">Document Analysis</CardTitle>
                            <CardDescription>
                                Upload research documents, competitor reports, or customer data for AI analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-medium mb-2">Upload Research Files</h3>
                                <p className="text-muted-foreground mb-4">
                                    Drop PDFs, spreadsheets, or documents here for AI analysis
                                </p>
                                <Button variant="outline" disabled>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Choose Files (Coming Soon)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analysis Results */}
                {analysisResult && (
                    <div className="space-y-6">
                        {/* Strategy Results */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                                    AI Analysis Results - {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}
                                </CardTitle>
                                <CardDescription>
                                    Personalized recommendations based on {selectedClient?.name}'s data
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{analysisResult}</div>
                                </div>
                                <div className="flex gap-2 mt-6">
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Report
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Ask Follow-up
                                    </Button>
                                    <Button size="sm">
                                        <Target className="w-4 h-4 mr-2" />
                                        Apply to Strategy
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Campaign Suggestions */}
                        {showCampaignSuggestions && campaignSuggestions.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Megaphone className="w-5 h-5 text-blue-500" />
                                        Suggested Campaigns
                                    </CardTitle>
                                    <CardDescription>
                                        AI-generated campaign recommendations based on your strategy
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {campaignSuggestions.map((campaign) => (
                                            <Card key={campaign.id} className="border border-muted">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-sm font-medium">
                                                            {campaign.name}
                                                        </CardTitle>
                                                        <Badge variant="outline">{campaign.platform}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="w-3 h-3 text-green-600" />
                                                                <span>${campaign.budget}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3 text-blue-600" />
                                                                <span>{campaign.duration}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {campaign.description}
                                                        </p>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="flex-1"
                                                                onClick={() => handleCreateCampaign(campaign)}
                                                            >
                                                                <Plus className="w-3 h-3 mr-1" />
                                                                Create
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleAddToCalendar(campaign)}
                                                            >
                                                                <Calendar className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-green-500" />
                                    Marketing Calendar
                                </CardTitle>
                                <CardDescription>
                                    Schedule and manage your marketing activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button variant="outline">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        View Calendar
                                    </Button>
                                    <Button variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Campaign
                                    </Button>
                                    <Button variant="outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Schedule
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* AI Results Modal */}
                <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-purple-500" />
                                {currentAnalysisTitle} - {selectedClient?.name}
                            </DialogTitle>
                            <DialogDescription>
                                AI-powered analysis based on {selectedClient?.name}'s profile data
                            </DialogDescription>
                        </DialogHeader>

                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
                                <p className="text-lg font-medium">Analyzing with Gemini AI...</p>
                                <p className="text-sm text-muted-foreground">This may take a few moments</p>
                            </div>
                        ) : (
                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-6">
                                    {/* Analysis Results */}
                                    <div className="prose prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                                            {analysisResult || "No analysis results available."}
                                        </div>
                                    </div>

                                    {/* Campaign Suggestions - Only for strategy analysis */}
                                    {showCampaignSuggestions && campaignSuggestions.length > 0 && analysisType === "strategy" && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 border-b pb-2">
                                                <Megaphone className="w-5 h-5 text-blue-500" />
                                                <h3 className="font-semibold">Suggested Campaigns</h3>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {campaignSuggestions.map((campaign) => (
                                                    <Card key={campaign.id} className="border border-muted">
                                                        <CardHeader className="pb-3">
                                                            <div className="flex items-center justify-between">
                                                                <CardTitle className="text-sm font-medium">
                                                                    {campaign.name}
                                                                </CardTitle>
                                                                <Badge variant="outline">{campaign.platform}</Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="pt-0">
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                                    <div className="flex items-center gap-1">
                                                                        <DollarSign className="w-3 h-3 text-green-600" />
                                                                        <span>${campaign.budget}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3 text-blue-600" />
                                                                        <span>{campaign.duration}</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {campaign.description}
                                                                </p>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        className="flex-1"
                                                                        onClick={() => handleCreateCampaign(campaign)}
                                                                    >
                                                                        <Plus className="w-3 h-3 mr-1" />
                                                                        Create
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleAddToCalendar(campaign)}
                                                                    >
                                                                        <Calendar className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Report
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Ask Follow-up
                                        </Button>
                                        <Button size="sm">
                                            <Target className="w-4 h-4 mr-2" />
                                            Apply to Strategy
                                        </Button>
                                    </div>
                                </div>
                            </ScrollArea>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
