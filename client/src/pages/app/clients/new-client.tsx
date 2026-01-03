import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";

export default function NewClientWizard() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const finish = () => setLocation("/app/clients/1"); // Redirect to mock ID 1

  const ProgressStep = ({ num, title, isActive, isCompleted }: any) => (
    <div className={`flex flex-col items-center gap-2 relative z-10 w-24`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {isCompleted ? <Check className="w-4 h-4" /> : num}
      </div>
      <span className={`text-xs font-medium text-center ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</span>
    </div>
  );

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Onboard New Client</h1>
          <p className="text-muted-foreground">Setup your client's workspace and brand profile</p>
        </div>

        {/* Progress Bar */}
        <div className="relative flex justify-between mb-12 px-4">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-0 mx-12">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out" 
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
          </div>
          <ProgressStep num={1} title="Business Info" isActive={step === 1} isCompleted={step > 1} />
          <ProgressStep num={2} title="Brand Kit" isActive={step === 2} isCompleted={step > 2} />
          <ProgressStep num={3} title="Goals & Budget" isActive={step === 3} isCompleted={step > 3} />
          <ProgressStep num={4} title="Target Audience" isActive={step === 4} isCompleted={step > 4} />
          <ProgressStep num={5} title="Review" isActive={step === 5} isCompleted={step > 5} />
        </div>

        <Card className="border shadow-md">
          {/* STEP 1: BUSINESS INFO */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Tell us about the company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input id="website" placeholder="https://..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology / SaaS</SelectItem>
                      <SelectItem value="retail">Retail / E-commerce</SelectItem>
                      <SelectItem value="health">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label>Business Type</Label>
                   <RadioGroup defaultValue="b2b" className="flex gap-4">
                     <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 hover:bg-muted/5 cursor-pointer">
                       <RadioGroupItem value="b2b" id="b2b" />
                       <Label htmlFor="b2b" className="cursor-pointer font-normal">B2B (Business to Business)</Label>
                     </div>
                     <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 hover:bg-muted/5 cursor-pointer">
                       <RadioGroupItem value="b2c" id="b2c" />
                       <Label htmlFor="b2c" className="cursor-pointer font-normal">B2C (Business to Consumer)</Label>
                     </div>
                   </RadioGroup>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 2: BRAND KIT */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Brand Kit</CardTitle>
                <CardDescription>Upload assets and define style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/5 transition-colors">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max 2MB)</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                   <div className="space-y-2">
                     <Label>Primary Color</Label>
                     <div className="flex gap-2">
                       <div className="h-10 w-10 rounded border bg-blue-600"></div>
                       <Input placeholder="#000000" defaultValue="#2563EB" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label>Brand Font</Label>
                     <Select defaultValue="inter">
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="inter">Inter</SelectItem>
                         <SelectItem value="roboto">Roboto</SelectItem>
                         <SelectItem value="poppins">Poppins</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                </div>
                <div className="space-y-3">
                   <Label>Brand Voice (Select all that apply)</Label>
                   <div className="grid grid-cols-2 gap-3">
                      {["Professional", "Playful", "Authoritative", "Friendly", "Technical", "Luxury"].map((voice) => (
                        <div key={voice} className="flex items-center space-x-2">
                          <Checkbox id={voice} />
                          <Label htmlFor={voice} className="font-normal cursor-pointer">{voice}</Label>
                        </div>
                      ))}
                   </div>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 3: GOALS */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Goals & Budget</CardTitle>
                <CardDescription>Define what success looks like</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <Label>Primary Objective</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select primary goal" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leads">Lead Generation</SelectItem>
                      <SelectItem value="sales">Online Sales</SelectItem>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                      <SelectItem value="traffic">Website Traffic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between">
                     <Label>Monthly Ad Budget</Label>
                     <span className="text-sm font-bold text-primary">$5,000</span>
                  </div>
                  <Slider defaultValue={[5000]} max={50000} step={500} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$500</span>
                    <span>$50,000+</span>
                  </div>
                </div>
                <div className="space-y-2">
                   <Label>Campaign Timeline</Label>
                   <Select>
                    <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months (Quarterly)</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months (Annual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {/* STEP 4: AUDIENCE */}
          {step === 4 && (
             <>
               <CardHeader>
                 <CardTitle>Target Audience</CardTitle>
                 <CardDescription>Who are we trying to reach?</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="space-y-2">
                   <Label>Ideal Customer Profile (ICP)</Label>
                   <Textarea placeholder="Describe the ideal customer e.g. CTOs of Series A startups..." className="min-h-[100px]" />
                 </div>
                 <div className="grid gap-4 md:grid-cols-2">
                   <div className="space-y-2">
                     <Label>Age Range</Label>
                     <Input placeholder="e.g. 25-45" />
                   </div>
                   <div className="space-y-2">
                     <Label>Location</Label>
                     <Input placeholder="e.g. United States, UK" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label>Pain Points</Label>
                   <Textarea placeholder="What problems are they facing?" />
                 </div>
               </CardContent>
             </>
          )}

           {/* STEP 5: REVIEW */}
           {step === 5 && (
             <>
               <CardHeader>
                 <CardTitle>Review Details</CardTitle>
                 <CardDescription>Confirm everything is correct before creating the workspace.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4 space-y-4 bg-muted/5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="text-muted-foreground block mb-1">Company</span>
                         <span className="font-medium">Acme Corp</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block mb-1">Industry</span>
                         <span className="font-medium">Technology / SaaS</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block mb-1">Budget</span>
                         <span className="font-medium">$5,000 / month</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground block mb-1">Goal</span>
                         <span className="font-medium">Lead Generation</span>
                       </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                    <strong>Ready to go?</strong> Clicking "Confirm & Create" will generate the workspace and initialize the strategy engine.
                  </div>
               </CardContent>
             </>
           )}

          <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {step < 5 ? (
               <Button onClick={nextStep}>
                 Next Step <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            ) : (
               <Button onClick={finish} className="bg-green-600 hover:bg-green-700">
                 Confirm & Create Client <Check className="w-4 h-4 ml-2" />
               </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
