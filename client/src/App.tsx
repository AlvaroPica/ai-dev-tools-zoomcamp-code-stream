import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Session from "@/pages/session";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/session/:id" component={Session} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeInitializer />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
