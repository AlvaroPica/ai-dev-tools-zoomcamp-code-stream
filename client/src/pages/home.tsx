import { useState } from "react";
import { useLocation } from "wouter";
import { Code2, Users, Zap, Play, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { mockApi } from "@/api/mockClient";

const features = [
  {
    icon: Code2,
    title: "Real-Time Collaboration",
    description:
      "Code together in real-time with syntax highlighting for JavaScript and Python",
  },
  {
    icon: Users,
    title: "Multi-User Sessions",
    description:
      "See live cursors and changes from all participants instantly",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description:
      "Run code directly in the browser with Pyodide for Python and a safe JavaScript sandbox",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const session = await mockApi.createSession();
      setLocation(`/session/${session.id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">CodeCollab</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-online opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-online" />
            </span>
            <span className="text-sm text-muted-foreground">
              Ready to collaborate
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Real-Time Collaborative
            <br />
            <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
              Coding Interviews
            </span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Conduct technical interviews with a powerful collaborative code
            editor. Write, run, and evaluate code together in real-time with
            support for JavaScript and Python.
          </p>

          <Card className="mb-12 w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="mb-1 text-xl font-semibold">
                    Start a New Session
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Create a collaborative coding environment instantly
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  data-testid="button-create-session"
                  className="w-full"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Session...
                    </>
                  ) : (
                    <>
                      Create New Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid w-full gap-6 sm:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-left"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>Built for seamless technical interviews</p>
      </footer>
    </div>
  );
}
