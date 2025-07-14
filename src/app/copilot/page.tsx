"use client";

import { ChatInterface } from "@/components/copilot/chat-interface";
import { NavBar } from "@/components/shared/nav-bar";

import { Badge } from "@/components/ui/badge";
import { Brain, Zap } from "lucide-react";

export default function CopilotPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Brain className="w-8 h-8 text-supply-primary" />
                AI Copilot
              </h1>
              <p className="text-muted-foreground">
                Your intelligent supply chain assistant powered by advanced AI
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Powered by Groq
            </Badge>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="h-[calc(100vh-200px)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}