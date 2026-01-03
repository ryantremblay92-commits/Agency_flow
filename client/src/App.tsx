import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Login from "@/pages/login";
import HowItWorks from "@/pages/how-it-works";
import Services from "@/pages/services";
import CaseStudies from "@/pages/case-studies";
import Dashboard from "@/pages/app/dashboard";
import ClientsList from "@/pages/app/clients/index";
import NewClientWizard from "@/pages/app/clients/new-client";
import ClientWorkspace from "@/pages/app/clients/workspace";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/services" component={Services} />
      <Route path="/case-studies" component={CaseStudies} />
      
      {/* App Routes */}
      <Route path="/app/dashboard" component={Dashboard} />
      <Route path="/app/clients" component={ClientsList} />
      <Route path="/app/clients/new" component={NewClientWizard} />
      <Route path="/app/clients/:id" component={ClientWorkspace} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
