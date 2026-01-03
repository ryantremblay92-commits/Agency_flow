import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, BarChart3, Rocket, LayoutTemplate, Users, Target, FileText } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container px-4 md:px-6 mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 border-primary/20 hover:bg-primary/20">
            Now available for agencies worldwide
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Create marketing strategies <br className="hidden md:block" />
            <span className="text-primary">in minutes — not weeks.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one operating system for agencies. Onboard clients, generate comprehensive strategies, and launch multi-channel campaigns with AI-driven precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25">
                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur">
                Book a Demo
              </Button>
            </Link>
          </div>
          
          <div className="mt-20 mx-auto max-w-5xl rounded-xl border bg-background/50 backdrop-blur shadow-2xl overflow-hidden aspect-[16/9] relative group">
             <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
               <span className="text-muted-foreground font-medium">Dashboard Preview Image</span>
             </div>
             {/* Decorative UI elements representing the app interface */}
             <div className="absolute inset-0 p-8 grid grid-cols-12 gap-6 opacity-80 pointer-events-none">
                <div className="col-span-3 bg-white shadow-sm rounded-lg h-full border"></div>
                <div className="col-span-9 flex flex-col gap-6">
                   <div className="h-16 bg-white shadow-sm rounded-lg border w-full"></div>
                   <div className="flex-1 bg-white shadow-sm rounded-lg border w-full p-6 space-y-4">
                      <div className="h-8 w-1/3 bg-muted rounded"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-32 bg-primary/5 rounded-lg border border-primary/10"></div>
                        <div className="h-32 bg-muted/30 rounded-lg border"></div>
                        <div className="h-32 bg-muted/30 rounded-lg border"></div>
                      </div>
                      <div className="h-4 w-full bg-muted/30 rounded mt-8"></div>
                      <div className="h-4 w-5/6 bg-muted/30 rounded"></div>
                      <div className="h-4 w-4/6 bg-muted/30 rounded"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">Trusted by 2,000+ fast-growing agencies</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {["Acme Corp", "GlobalScale", "NextGen", "Starlight", "Umbrella"].map((brand) => (
               <div key={brand} className="text-xl font-bold">{brand}</div>
             ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Streamline your workflow</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">From onboarding to execution, everything happens in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Users,
                title: "1. Add Client",
                description: "Input client details, brand assets, and business goals in a guided wizard."
              },
              {
                icon: Zap,
                title: "2. Generate Strategy",
                description: "Our engine creates a tailored marketing plan based on industry benchmarks."
              },
              {
                icon: Rocket,
                title: "3. Launch Campaigns",
                description: "Push campaigns to ad platforms and track real-time performance."
              }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="col-span-full mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
              <p className="text-lg text-muted-foreground">Powerful tools built for modern agency teams.</p>
            </div>
            {[
               { icon: LayoutTemplate, title: "Brand Management", desc: "Store and apply client brand kits automatically." },
               { icon: BarChart3, title: "Automated Reporting", desc: "Send white-labeled reports to clients every week." },
               { icon: Target, title: "Audience Targeting", desc: "Deep dive into demographics and psychographics." },
               { icon: FileText, title: "Content Calendar", desc: "Plan social posts and blog content visually." },
               { icon: Users, title: "Team Collaboration", desc: "Assign tasks and approve strategies internally." },
               { icon: Zap, title: "AI Strategy", desc: "Generate 50-page strategy documents in seconds." }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 rounded-xl border hover:shadow-lg transition-all duration-300">
                <feature.icon className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
         <div className="container px-4 md:px-6 mx-auto">
           <div className="bg-primary rounded-3xl p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear]"></div>
             <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to transform your agency?</h2>
             <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 relative z-10">Join thousands of agencies delivering better results in less time.</p>
             <Link href="/login">
               <Button size="lg" variant="secondary" className="h-14 px-10 text-lg shadow-xl relative z-10">
                 Start Your Free Trial
               </Button>
             </Link>
           </div>
         </div>
      </section>
    </PublicLayout>
  );
}
