import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
// @ts-ignore - JS module without type defs
import { AuthProvider } from "./context/AuthContext";

import { FoodeliDesign } from "@/pages/FoodeliDesign";
import WhyMealMatch from "@/pages/WhyMealMatch";
import FAQ from "@/pages/FAQ";
// @ts-ignore - JS module without type defs
import AdminLogin from "./pages/admin/AdminLogin";
// @ts-ignore - JS module without type defs
import AdminDashboard from "./pages/admin/AdminDashboard";
// @ts-ignore - JS module without type defs
import LoginPage from "./pages/LoginPage";
// @ts-ignore - JS module without type defs
import StudentDashboard from "./pages/StudentDashboard";
// @ts-ignore - JS module without type defs
import CookDashboard from "./pages/CookDashboard";
// @ts-ignore - JS module without type defs
import CookProfilePage from "./pages/CookProfilePage";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={FoodeliDesign} />
      <Route path="/Homepage" component={FoodeliDesign} />
      <Route path="/login" component={LoginPage} />
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/cook/dashboard" component={CookDashboard} />
      <Route path="/cook/:id" component={CookProfilePage} />
      <Route path="/why-mealmatch" component={WhyMealMatch} />
      <Route path="/why-mealmatch/" component={WhyMealMatch} />
      <Route path="/why" component={WhyMealMatch} />
      <Route path="/WhyMealMatch" component={WhyMealMatch} />
      <Route path="/faq" component={FAQ} />
      <Route path="/faq/" component={FAQ} />
      <Route path="/faqs" component={FAQ} />
      <Route path="/FAQs" component={FAQ} />
      {/* Admin */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
