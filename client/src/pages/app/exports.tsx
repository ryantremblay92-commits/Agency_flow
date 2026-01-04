import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, Filter, MoreHorizontal, FileSpreadsheet, FileJson } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const exports = [
  { name: "Full Strategy PDF", client: "TechNova Inc.", type: "PDF", size: "2.4 MB", date: "Jan 12, 2026" },
  { name: "Content Calendar Q1", client: "Alpha Finance", type: "XLSX", size: "145 KB", date: "Jan 10, 2026" },
  { name: "Campaign Performance", client: "GreenEarth Cafe", type: "CSV", size: "85 KB", date: "Jan 08, 2026" },
  { name: "Brand Assets Bundle", client: "TechNova Inc.", type: "ZIP", size: "12.8 MB", date: "Jan 05, 2026" },
];

export default function ExportsPage() {
  const [exports] = useState([
    { name: "Full Strategy PDF", client: "TechNova Inc.", type: "PDF", size: "2.4 MB", date: "Jan 12, 2026" },
    { name: "Content Calendar Q1", client: "Alpha Finance", type: "XLSX", size: "145 KB", date: "Jan 10, 2026" },
    { name: "Campaign Performance", client: "GreenEarth Cafe", type: "CSV", size: "85 KB", date: "Jan 08, 2026" },
    { name: "Brand Assets Bundle", client: "TechNova Inc.", type: "ZIP", size: "12.8 MB", date: "Jan 05, 2026" },
  ]);

  const handleRequestCustomData = () => {
    console.log("Request custom data clicked");
    // TODO: Implement custom data request functionality
  };

  const handleExportAll = () => {
    console.log("Export all data clicked");
    // TODO: Implement export all functionality
  };

  const handleDownloadItem = (item: any) => {
    console.log("Download item:", item.name);
    // TODO: Implement individual download functionality
  };

  const handleMoreOptions = (item: any) => {
    console.log("More options for:", item.name);
    // TODO: Implement more options functionality
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exports</h1>
            <p className="text-muted-foreground">Download and manage your generated documents and data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRequestCustomData}>
              Request Custom Data
            </Button>
            <Button onClick={handleExportAll}>
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6 border-b bg-muted/5">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search exports..." className="pl-9 bg-background" />
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {exports.map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/5 group transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'PDF' ? 'bg-red-50 text-red-600' :
                        item.type === 'XLSX' ? 'bg-green-50 text-green-600' :
                          item.type === 'ZIP' ? 'bg-blue-50 text-blue-600' : 'bg-muted text-muted-foreground'
                      }`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.client} • {item.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium">{item.date}</p>
                      <p className="text-xs text-muted-foreground">Exported on</p>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">{item.type}</Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadItem(item)}><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoreOptions(item)}><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
