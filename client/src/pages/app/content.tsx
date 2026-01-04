import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ChevronLeft, ChevronRight, FileText, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function ContentPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026

  const handleCalendarView = () => {
    console.log("Calendar view clicked");
    // TODO: Implement calendar view functionality
  };

  const handleAddContent = () => {
    console.log("Add content clicked");
    // TODO: Implement add content functionality
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content</h1>
            <p className="text-muted-foreground">Plan and schedule content across all channels</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCalendarView}>
              <Calendar className="w-4 h-4 mr-2" /> Calendar View
            </Button>
            <Button onClick={handleAddContent}>
              <Plus className="w-4 h-4 mr-2" /> Add Content Item
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>January 2026</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-px bg-border border rounded-lg overflow-hidden">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                    <div key={d} className="bg-muted/50 p-2 text-center text-xs font-semibold text-muted-foreground">{d}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className="bg-background min-h-[100px] p-2 relative group hover:bg-muted/10 transition-colors">
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                      {[4, 12, 15, 22].includes(i) && (
                        <div className="mt-1 p-1 rounded bg-blue-100 text-[10px] font-medium text-blue-700 truncate cursor-pointer">
                          LinkedIn Post
                        </div>
                      )}
                      {[8, 25].includes(i) && (
                        <div className="mt-1 p-1 rounded bg-green-100 text-[10px] font-medium text-green-700 truncate cursor-pointer">
                          Blog Article
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { type: "LinkedIn", title: "Product Launch Teaser", date: "Jan 22", icon: FileText },
                  { type: "Blog", title: "Future of SaaS Marketing", date: "Jan 25", icon: FileText },
                  { type: "Instagram", title: "Office Culture Reel", date: "Jan 28", icon: ImageIcon }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 border rounded-lg">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.type} • {item.date}</p>
                    </div>
                  </div>
                ))}
                <Button variant="link" className="w-full text-xs">View all upcoming</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <span className="font-bold">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Scheduled</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Drafts</span>
                  <span className="font-bold">5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
