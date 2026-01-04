import { type User, type InsertUser, type Client, type InsertClient, type Strategy, type InsertStrategy, type Campaign, type InsertCampaign, type Activity, type InsertActivity, type ClientAsset, type InsertClientAsset } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

// Path to the data file
const DATA_DIR = path.join(process.cwd(), "server", "data");
const DATA_FILE = path.join(DATA_DIR, "data.json");

// Initial mock data
const initialData = {
  users: [],
  clients: [],
  strategies: [],
  campaigns: [],
  activities: [],
  clientAssets: []
};

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;

  getStrategies(): Promise<Strategy[]>;
  getStrategy(id: string): Promise<Strategy | undefined>;
  createStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(id: string, updates: Partial<Strategy>): Promise<Strategy>;
  getStrategiesByClientId(clientId: string): Promise<Strategy[]>;

  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaignsByClientId(clientId: string): Promise<Campaign[]>;

  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  getClientAssets(clientId?: string): Promise<ClientAsset[]>;
  createClientAsset(asset: InsertClientAsset): Promise<ClientAsset>;
  deleteClientAsset(id: string): Promise<void>;
};

// Helper function to ensure data directory and file exist
function ensureDataFile() {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error("Error ensuring data file:", error);
  }
}

// Helper function to read data from file
function readData() {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    return initialData;
  }
}

// Helper function to write data to file
function writeData(data: any) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log("Data saved to", DATA_FILE);
  } catch (error) {
    console.error("Error writing data file:", error);
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private strategies: Map<string, Strategy>;
  private campaigns: Map<string, Campaign>;
  private activities: Map<string, Activity>;
  private clientAssets: Map<string, ClientAsset>;

  constructor() {
    // Load data from file on initialization
    const data = readData();

    this.users = new Map();
    this.clients = new Map();
    this.strategies = new Map();
    this.campaigns = new Map();
    this.activities = new Map();
    this.clientAssets = new Map();

    // Convert arrays to Maps
    data.users.forEach((user: User) => this.users.set(user.id, user));
    data.clients.forEach((client: Client) => this.clients.set(client.id, client));
    data.strategies.forEach((strategy: Strategy) => this.strategies.set(strategy.id, strategy));
    data.campaigns.forEach((campaign: Campaign) => this.campaigns.set(campaign.id, campaign));
    data.activities.forEach((activity: Activity) => this.activities.set(activity.id, activity));
    data.clientAssets.forEach((asset: ClientAsset) => this.clientAssets.set(asset.id, asset));

    console.log("Storage initialized with", {
      users: this.users.size,
      clients: this.clients.size,
      strategies: this.strategies.size,
      campaigns: this.campaigns.size,
      activities: this.activities.size,
      clientAssets: this.clientAssets.size
    });
  }

  // Helper function to save all data to file
  private saveAll() {
    const data = {
      users: Array.from(this.users.values()),
      clients: Array.from(this.clients.values()),
      strategies: Array.from(this.strategies.values()),
      campaigns: Array.from(this.campaigns.values()),
      activities: Array.from(this.activities.values()),
      clientAssets: Array.from(this.clientAssets.values())
    };
    writeData(data);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.saveAll();
    return user;
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const now = new Date();
    const client: Client = {
      ...insertClient,
      id,
      website: insertClient.website || null,
      industry: insertClient.industry || null,
      businessType: insertClient.businessType || null,
      logo: insertClient.logo || null,
      primaryObjective: insertClient.primaryObjective || null,
      monthlyBudget: insertClient.monthlyBudget || null,
      timeline: insertClient.timeline || null,
      icp: insertClient.icp || null,
      ageRange: insertClient.ageRange || null,
      location: insertClient.location || null,
      painPoints: insertClient.painPoints || null,
      status: insertClient.status || "Active",
      primaryColor: insertClient.primaryColor || "#2563EB",
      brandFont: insertClient.brandFont || "Inter",
      brandVoice: (insertClient.brandVoice || []) as string[],
      createdAt: now,
      updatedAt: now,
    };
    this.clients.set(id, client);
    this.saveAll();
    return client;
  }

  async getStrategies(): Promise<Strategy[]> {
    return Array.from(this.strategies.values());
  }

  async getStrategy(id: string): Promise<Strategy | undefined> {
    return this.strategies.get(id);
  }

  async createStrategy(insertStrategy: InsertStrategy): Promise<Strategy> {
    const id = randomUUID();
    const now = new Date();
    const strategy: Strategy = {
      ...insertStrategy,
      id,
      clientId: insertStrategy.clientId || null,
      description: insertStrategy.description || null,
      sections: insertStrategy.sections || null,
      status: insertStrategy.status || "Active",
      createdAt: now,
      updatedAt: now,
    };
    this.strategies.set(id, strategy);
    this.saveAll();
    return strategy;
  }

  async updateStrategy(id: string, updates: Partial<Strategy>): Promise<Strategy> {
    const existingStrategy = this.strategies.get(id);
    if (!existingStrategy) {
      throw new Error("Strategy not found");
    }

    const updatedStrategy: Strategy = {
      ...existingStrategy,
      ...updates,
      updatedAt: new Date(),
    };

    this.strategies.set(id, updatedStrategy);
    this.saveAll();
    return updatedStrategy;
  }

  async getStrategiesByClientId(clientId: string): Promise<Strategy[]> {
    const strategies = Array.from(this.strategies.values());
    return strategies.filter(strategy => strategy.clientId === clientId);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const now = new Date();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      platform: insertCampaign.platform || null,
      budget: insertCampaign.budget || null,
      startDate: insertCampaign.startDate || null,
      endDate: insertCampaign.endDate || null,
      status: insertCampaign.status || "Draft",
      clientId: insertCampaign.clientId || null,
      strategyId: insertCampaign.strategyId || null,
      createdAt: now,
      updatedAt: now,
    };
    this.campaigns.set(id, campaign);
    this.saveAll();
    return campaign;
  }

  async getCampaignsByClientId(clientId: string): Promise<Campaign[]> {
    const campaigns = Array.from(this.campaigns.values());
    return campaigns.filter(campaign => campaign.clientId === clientId);
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    const activities = Array.from(this.activities.values());
    // Sort by createdAt descending and limit
    return activities
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const now = new Date();
    const activity: Activity = {
      ...insertActivity,
      id,
      user: insertActivity.user || "System",
      clientId: insertActivity.clientId || null,
      targetName: insertActivity.targetName || null,
      targetId: insertActivity.targetId || null,
      details: insertActivity.details || null,
      createdAt: now,
    };
    this.activities.set(id, activity);
    this.saveAll();
    return activity;
  }

  async getClientAssets(clientId?: string): Promise<ClientAsset[]> {
    const assets = Array.from(this.clientAssets.values());
    if (clientId) {
      return assets.filter(asset => asset.clientId === clientId);
    }
    return assets;
  }

  async createClientAsset(insertAsset: InsertClientAsset): Promise<ClientAsset> {
    const id = randomUUID();
    const now = new Date();
    const asset: ClientAsset = {
      ...insertAsset,
      id,
      url: insertAsset.url || null,
      description: insertAsset.description || null,
      fileSize: insertAsset.fileSize || null,
      mimeType: insertAsset.mimeType || null,
      isUrl: insertAsset.isUrl || "false",
      createdAt: now,
      updatedAt: now,
    };
    this.clientAssets.set(id, asset);
    this.saveAll();
    return asset;
  }

  async deleteClientAsset(id: string): Promise<void> {
    this.clientAssets.delete(id);
    this.saveAll();
  }
}

export const storage = new MemStorage();
