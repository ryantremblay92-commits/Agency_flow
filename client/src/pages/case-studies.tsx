import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function CaseStudies() {
  return (
    <PublicLayout>
      <div className="container py-20 px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h1>
          <p className="text-xl text-muted-foreground">See how leading agencies use our platform to deliver results.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              company: "GrowthX Agency",
              industry: "SaaS",
              result: "+240% Leads",
              desc: "How GrowthX used automated strategy to scale a Series B startup.",
              tags: ["B2B", "Lead Gen"]
            },
            {
              company: "Starlight Digital",
              industry: "E-commerce",
              result: "3.5x ROAS",
              desc: "Scaling a DTC fashion brand from $1M to $5M ARR in 6 months.",
              tags: ["DTC", "Paid Social"]
            },
            {
              company: "Neon Marketing",
              industry: "Local Services",
              result: "-40% CAC",
              desc: "Optimizing local lead gen for a national franchise network.",
              tags: ["Local SEO", "PPC"]
            },
            {
              company: "BluePeak",
              industry: "FinTech",
              result: "50% Time Saved",
              desc: "Reducing strategy planning time from 2 weeks to 2 days.",
              tags: ["Efficiency", "Strategy"]
            },
             {
              company: "Apex Media",
              industry: "Healthcare",
              result: "+180% Patient Vol",
              desc: "Compliance-ready marketing automation for healthcare providers.",
              tags: ["Healthcare", "Automation"]
            },
             {
              company: "Zenith Creative",
              industry: "Consumer Tech",
              result: "Viral Launch",
              desc: "Coordinating a multi-channel product launch for a new wearable.",
              tags: ["Launch", "Influencer"]
            }
          ].map((study, i) => (
            <div key={i} className="group bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="h-48 bg-muted relative">
                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-4xl uppercase tracking-widest">
                    {study.company.substring(0, 2)}
                 </div>
                 <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-black hover:bg-white">{study.result}</Badge>
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{study.company}</h3>
                  <p className="text-sm text-muted-foreground">{study.industry}</p>
                </div>
                <p className="text-muted-foreground mb-6 flex-1">{study.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                  ))}
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground border-primary/20">
                  Read Case Study <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
