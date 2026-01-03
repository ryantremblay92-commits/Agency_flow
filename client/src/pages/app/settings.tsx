import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, CreditCard, Building } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your agency profile and account preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="agency">Agency</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and how others see you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold border">AD</div>
                   <Button variant="outline">Change Avatar</Button>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Alex" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Design" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="alex@agencyflow.com" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agency">
            <Card>
              <CardHeader>
                <CardTitle>Agency Profile</CardTitle>
                <CardDescription>Public information about your marketing agency.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input id="agencyName" defaultValue="AgencyFlow Creative" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencyWebsite">Website</Label>
                  <Input id="agencyWebsite" defaultValue="https://agencyflow.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
                </div>
                <div className="pt-4">
                  <Button>Update Agency Info</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Strategy Reports</Label>
                     <p className="text-sm text-muted-foreground">Receive a summary when a new strategy is generated.</p>
                   </div>
                   <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Client Activity</Label>
                     <p className="text-sm text-muted-foreground">Get notified when a client interacts with the workspace.</p>
                   </div>
                   <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Campaign Alerts</Label>
                     <p className="text-sm text-muted-foreground">Critical alerts regarding active campaign performance.</p>
                   </div>
                   <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
             <Card>
               <CardHeader>
                 <CardTitle>Current Plan</CardTitle>
                 <CardDescription>You are currently on the Pro Agency plan.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
                     <div>
                       <p className="font-bold text-lg">Pro Agency</p>
                       <p className="text-sm text-muted-foreground">$199 / month • Renews Feb 12, 2026</p>
                     </div>
                     <Button>Manage Subscription</Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Payment Method</h4>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="flex items-center gap-3">
                         <CreditCard className="h-5 w-5 text-muted-foreground" />
                         <span className="text-sm font-medium">•••• •••• •••• 4242</span>
                       </div>
                       <Button variant="ghost" size="sm">Update</Button>
                    </div>
                  </div>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
