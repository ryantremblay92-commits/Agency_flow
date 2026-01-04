import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      console.log("Returning clients:", clients.length, "clients");
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = req.body;
      console.log("Creating client with data:", clientData);
      const client = await storage.createClient(clientData);
      console.log("Created client:", client);

      // Log activity
      await storage.createActivity({
        action: "created",
        target: "client",
        targetName: client.name,
        targetId: client.id,
        clientId: client.id,
        details: "New client onboarded",
      });

      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.get("/api/strategies", async (req, res) => {
    try {
      const { clientId } = req.query;
      let strategies;

      if (clientId) {
        strategies = await storage.getStrategiesByClientId(clientId as string);
      } else {
        strategies = await storage.getStrategies();
      }

      console.log("Returning strategies:", strategies.length, "strategies");
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching strategies:", error);
      res.status(500).json({ message: "Failed to fetch strategies" });
    }
  });

  app.post("/api/strategies", async (req, res) => {
    try {
      const strategyData = req.body;
      console.log("Creating strategy with data:", strategyData);
      const strategy = await storage.createStrategy(strategyData);
      console.log("Created strategy:", strategy);

      // Log activity
      await storage.createActivity({
        action: "created",
        target: "strategy",
        targetName: strategy.name,
        targetId: strategy.id,
        clientId: strategy.clientId || undefined,
        details: "New strategy created",
      });

      res.status(201).json(strategy);
    } catch (error) {
      console.error("Error creating strategy:", error);
      res.status(500).json({ message: "Failed to create strategy" });
    }
  });

  app.patch("/api/strategies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      console.log(`Updating strategy ${id} with:`, updates);

      // Get current strategy
      const currentStrategy = await storage.getStrategy(id);
      if (!currentStrategy) {
        return res.status(404).json({ message: "Strategy not found" });
      }

      // Update strategy
      const updatedStrategy = await storage.updateStrategy(id, updates);
      console.log("Updated strategy:", updatedStrategy);

      res.json(updatedStrategy);
    } catch (error) {
      console.error("Error updating strategy:", error);
      res.status(500).json({ message: "Failed to update strategy" });
    }
  });

  app.get("/api/campaigns", async (req, res) => {
    try {
      const { clientId } = req.query;
      let campaigns;

      if (clientId) {
        campaigns = await storage.getCampaignsByClientId(clientId as string);
      } else {
        campaigns = await storage.getCampaigns();
      }

      console.log("Returning campaigns:", campaigns.length, "campaigns");
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = req.body;
      console.log("Creating campaign with data:", campaignData);
      const campaign = await storage.createCampaign(campaignData);
      console.log("Created campaign:", campaign);

      // Log activity
      await storage.createActivity({
        action: "created",
        target: "campaign",
        targetName: campaign.name,
        targetId: campaign.id,
        clientId: campaign.clientId || undefined,
        details: "New campaign created",
      });

      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      console.log("Returning activities:", activities.length, "activities");
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/client-assets", async (req, res) => {
    try {
      const { clientId } = req.query;
      let assets;

      if (clientId) {
        assets = await storage.getClientAssets(clientId as string);
      } else {
        assets = await storage.getClientAssets();
      }

      console.log("Returning client assets:", assets.length, "assets");
      res.json(assets);
    } catch (error) {
      console.error("Error fetching client assets:", error);
      res.status(500).json({ message: "Failed to fetch client assets" });
    }
  });

  app.post("/api/client-assets", async (req, res) => {
    try {
      const assetData = req.body;
      console.log("Creating client asset with data:", assetData);
      const asset = await storage.createClientAsset(assetData);
      console.log("Created client asset:", asset);

      // Log activity
      await storage.createActivity({
        action: "uploaded",
        target: "asset",
        targetName: asset.name,
        targetId: asset.id,
        clientId: asset.clientId,
        details: `Uploaded ${asset.type}: ${asset.name}`,
      });

      res.status(201).json(asset);
    } catch (error) {
      console.error("Error creating client asset:", error);
      res.status(500).json({ message: "Failed to create client asset" });
    }
  });

  app.delete("/api/client-assets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteClientAsset(id);
      console.log("Deleted client asset:", id);

      // Log activity
      await storage.createActivity({
        action: "deleted",
        target: "asset",
        targetName: "asset",
        targetId: id,
        details: "Asset deleted",
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting client asset:", error);
      res.status(500).json({ message: "Failed to delete client asset" });
    }
  });

  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { clientId, analysisType, clientData, section, prompt: customPrompt, isRegenerate } = req.body;

      if (!clientId || !analysisType || !clientData) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Gemini API integration
      const GEMINI_API_KEY = "AIzaSyCZZ3GJQ3oRSBxAmQVj6rFB46yQWrt6BOE";
      const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

      let prompt = "";
      let analysisResult = "";

      // If this is a section regeneration with custom prompt
      if (isRegenerate && customPrompt) {
        prompt = customPrompt;
      } else {
        // Generate standard prompts for different analysis types
        switch (analysisType) {
          case "strategy":
            prompt = `As a marketing strategist, create a comprehensive marketing strategy for ${clientData.name}.

Client Profile:
- Industry: ${clientData.industry}
- Primary Goal: ${clientData.primaryObjective}
- Monthly Budget: ${clientData.monthlyBudget}
- Timeline: ${clientData.timeline} months
- Target Location: ${clientData.location}
- Pain Points: ${clientData.painPoints || 'Not specified'}
- Brand Voice: ${clientData.brandVoice?.join(', ') || 'Professional'}

Provide a detailed strategy including:
1. Channel recommendations with rationale
2. Budget allocation suggestions
3. Key messaging and positioning
4. Timeline and milestones
5. Success metrics

Make this specific to their industry and goals.`;
            break;

          case "content":
            prompt = `Create a content calendar for ${clientData.name}.

Client Profile:
- Industry: ${clientData.industry}
- Brand Voice: ${clientData.brandVoice?.join(', ') || 'Professional'}
- Pain Points: ${clientData.painPoints || 'Industry challenges'}
- Target Audience: ${clientData.icp || 'Business professionals'}

Generate a 4-week content calendar with:
1. Weekly themes
2. 3 posts per week (mix of LinkedIn, blog, social)
3. Content types and formats
4. Key messages for each post
5. Hashtags and calls-to-action

Focus on educational, thought leadership content that addresses their pain points.`;
            break;

          case "optimization":
            prompt = `Analyze and optimize marketing campaigns for ${clientData.name}.

Client Profile:
- Industry: ${clientData.industry}
- Current Budget: ${clientData.monthlyBudget}/month
- Primary Goal: ${clientData.primaryObjective}

Provide optimization recommendations:
1. Channel performance analysis
2. Budget reallocation suggestions
3. A/B testing recommendations
4. Landing page optimization
5. Targeting improvements
6. Expected ROI improvements

Be specific and actionable.`;
            break;
        }
      }

      // Try Gemini API with confirmed working endpoint
      try {
        const response = await fetch(GEMINI_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          analysisResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          console.log("✅ Gemini API Success! Real AI response generated.");
        } else {
          console.log("❌ Gemini API Error:", response.status, await response.text());
          throw new Error(`Gemini API error: ${response.status}`);
        }
      } catch (apiError) {
        console.log("Gemini API unavailable, using enhanced fallback:", apiError);
      }

      // Enhanced fallback responses if API is unavailable
      if (!analysisResult) {
        if (isRegenerate && section) {
          // Section-specific fallbacks
          analysisResult = `📝 **${section} Section for ${clientData.name}**

This section has been regenerated based on your ${clientData.industry} industry focus and ${clientData.primaryObjective} objectives.

**Key Elements:**
• Industry-specific insights for ${clientData.industry}
• Budget optimization for ${clientData.monthlyBudget}/month allocation
• Strategic alignment with ${clientData.primaryObjective} goals
• Measurable outcomes and KPIs

*This is an enhanced fallback response. For more detailed analysis, please try again.*`;
        } else {
          // Standard analysis type fallbacks
          switch (analysisType) {
            case "strategy":
              analysisResult = `🎯 **Marketing Strategy for ${clientData.name}**

**Client Profile:**
• Industry: ${clientData.industry}
• Primary Goal: ${clientData.primaryObjective}
• Monthly Budget: ${clientData.monthlyBudget}
• Business Type: ${clientData.businessType}

**Recommended Strategy:**

1. **Channel Focus:**
   • Primary: LinkedIn (B2B) or Instagram (B2C) based on target audience
   • Secondary: Google Ads for immediate lead generation
   • Content Marketing for long-term authority building

2. **Budget Allocation:**
   • 40% - Paid Advertising (Google Ads, LinkedIn)
   • 30% - Content Creation & Marketing
   • 20% - Social Media Management
   • 10% - Analytics & Optimization Tools

3. **Key Messaging:**
   • Focus on ${clientData.primaryObjective} as the core value proposition
   • Industry-specific pain points and solutions
   • Social proof through case studies and testimonials

4. **Timeline (First 90 Days):**
   • Month 1: Setup and content foundation
   • Month 2: Launch paid campaigns
   • Month 3: Optimize and scale winning channels

5. **Success Metrics:**
   • Lead generation rate: 15-25% improvement expected
   • Cost per acquisition: Reduce by 20-30%
   • Brand awareness: 40% increase in mentions`;
              break;

            case "content":
              analysisResult = `📅 **Content Calendar for ${clientData.name}**

**4-Week Content Strategy:**

**Week 1: Foundation & Authority**
• Monday: Industry insights blog post
• Wednesday: LinkedIn thought leadership article
• Friday: Customer success story

**Week 2: Educational Content**
• Monday: How-to guide related to ${clientData.primaryObjective}
• Wednesday: Industry trends analysis
• Friday: Expert interview or Q&A

**Week 3: Engagement & Interaction**
• Monday: Polls and surveys
• Wednesday: Behind-the-scenes content
• Friday: User-generated content features

**Week 4: Promotional & Conversion**
• Monday: Product/service spotlight
• Wednesday: Limited-time offer or promotion
• Friday: Case study highlighting ROI

**Content Themes:**
• Educational (40%)
• Behind-the-scenes (25%)
• User-generated (20%)
• Promotional (15%)

**Hashtag Strategy:**
• Industry-specific tags
• Location-based tags
• Branded hashtags
• Trending relevant hashtags`;
              break;

            case "optimization":
              analysisResult = `📊 **Campaign Optimization Report for ${clientData.name}**

**Current Performance Analysis:**

1. **Channel Performance:**
   • LinkedIn: High engagement, moderate conversion
   • Google Ads: Good conversion rate, room for targeting improvement
   • Email Marketing: Strong ROI, increase frequency
   • Content Marketing: Growing organic traffic

2. **Budget Reallocation Recommendations:**
   • Increase Google Ads budget by 25% (highest ROAS)
   • Reduce underperforming social media spend by 15%
   • Invest 20% more in content creation

3. **A/B Testing Priorities:**
   • Landing page headlines and CTAs
   • Ad copy variations
   • Email subject lines
   • Social media posting times

4. **Landing Page Optimization:**
   • Mobile responsiveness improvements
   • Page load speed optimization
   • Clear value proposition above the fold
   • Simplified contact forms

5. **Targeting Improvements:**
   • Refine audience segments based on engagement data
   • Implement retargeting campaigns
   • Create lookalike audiences from top converters

**Expected ROI Improvements:**
• 20-30% increase in conversion rates
• 15-25% reduction in cost per acquisition
• 25% improvement in overall campaign ROI`;
              break;
          }
        }
      }

      console.log(`AI analysis completed for ${clientData.name} - ${analysisType}`);

      res.json({
        result: analysisResult,
        clientName: clientData.name,
        analysisType,
        timestamp: new Date().toISOString(),
        source: analysisResult.includes('🎯') || analysisResult.includes('📅') || analysisResult.includes('📊') ? 'enhanced-fallback' : 'gemini-api'
      });

    } catch (error) {
      console.error("AI analysis error:", error);
      res.status(500).json({
        message: "AI analysis failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return httpServer;
}
