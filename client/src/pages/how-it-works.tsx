import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <PublicLayout>
      <div className="container py-20 px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">From Idea to Campaign in Minutes</h1>
          <p className="text-xl text-muted-foreground">Our AI-powered workflow automates the heavy lifting of agency work.</p>
        </div>

        <div className="space-y-24">
          {[
            {
              step: "01",
              title: "Onboard & Audit",
              description: "Input your client's website and our engine automatically extracts brand assets, tone of voice, and current performance metrics.",
              image: "https://placehold.co/600x400/f3f4f6/a3a3a3?text=Audit+Interface"
            },
            {
              step: "02",
              title: "Generate Strategy",
              description: "Get a comprehensive 50+ page strategy document including market analysis, persona development, and channel recommendations.",
              image: "https://placehold.co/600x400/f3f4f6/a3a3a3?text=Strategy+Doc"
            },
            {
              step: "03",
              title: "Launch & Optimize",
              description: "Push campaigns directly to ad platforms with one click. Our system monitors performance and suggests budget reallocations.",
              image: "https://placehold.co/600x400/f3f4f6/a3a3a3?text=Campaign+Dashboard"
            }
          ].map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-6">
                <span className="text-6xl font-bold text-primary/10">{item.step}</span>
                <h2 className="text-3xl font-bold">{item.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Automated data collection</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Human-in-the-loop editing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> White-label export</li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="rounded-xl overflow-hidden shadow-2xl border bg-muted aspect-video relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                  {/* Placeholder for visual step representation */}
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground">
                    Step {item.step} Visualization
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8">
              Start For Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
