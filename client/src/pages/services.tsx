import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Target, PenTool, BarChart } from "lucide-react";

export default function Services() {
  return (
    <PublicLayout>
      <div className="container py-20 px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Platform Capabilities</h1>
          <p className="text-xl text-muted-foreground">Everything your agency needs to scale operations.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Zap,
              title: "Strategy Automation",
              desc: "Turn brief inputs into comprehensive go-to-market strategies.",
              features: ["Market Analysis", "Competitor Research", "SWOT Analysis", "Budget Planning"]
            },
            {
              icon: Target,
              title: "Campaign Planning",
              desc: "Plan multi-channel campaigns with predictive performance modeling.",
              features: ["Media Planning", "Ad Set Structure", "Budget Allocation", "Timeline Generation"]
            },
            {
              icon: PenTool,
              title: "Content Planning",
              desc: "Generate content calendars and briefs for creative teams.",
              features: ["Social Media Calendar", "Blog Topic Ideation", "Brief Generation", "Asset Management"]
            },
            {
              icon: BarChart,
              title: "Performance Reporting",
              desc: "Automated white-label reporting delivered to clients.",
              features: ["Live Dashboards", "PDF Exports", "ROI Tracking", "Attribution Modeling"]
            }
          ].map((service, i) => (
            <div key={i} className="bg-card border rounded-xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.desc}</p>
              <ul className="space-y-3">
                {service.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {feat}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t">
                <Button variant="outline" className="w-full">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
