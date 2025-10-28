import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { FoodeliDesign } from "@/pages/FoodeliDesign";
import WhyMealMatch from "@/pages/WhyMealMatch";
import FAQ from "@/pages/FAQ";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={FoodeliDesign} />
      <Route path="/Homepage" component={FoodeliDesign} />
      <Route path="/why-mealmatch" component={WhyMealMatch} />
      <Route path="/why-mealmatch/" component={WhyMealMatch} />
      <Route path="/why" component={WhyMealMatch} />
      <Route path="/WhyMealMatch" component={WhyMealMatch} />
      <Route path="/faq" component={FAQ} />
      <Route path="/faq/" component={FAQ} />
      <Route path="/faqs" component={FAQ} />
      <Route path="/FAQs" component={FAQ} />
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
