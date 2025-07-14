"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Activity,
  Network,
  AlertTriangle,
  TrendingUp,
  Globe,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Copilot",
    description: "Natural language supply chain assistant powered by Groq",
    color: "bg-supply-info/20 text-supply-info",
  },
  {
    icon: Activity,
    title: "Real-time Disruption Detection",
    description: "Live monitoring of weather, traffic, and global events",
    color: "bg-supply-error/20 text-supply-error",
  },
  {
    icon: Network,
    title: "Smart Routing",
    description: "Graph-based optimization for efficient supply paths",
    color: "bg-supply-success/20 text-supply-success",
  },
  {
    icon: TrendingUp,
    title: "Demand Forecasting",
    description: "ML-powered predictions with confidence intervals",
    color: "bg-supply-primary/20 text-supply-primary",
  },
  {
    icon: Globe,
    title: "Interactive Dashboard",
    description: "3D visualization of your entire supply network",
    color: "bg-supply-secondary/20 text-supply-secondary",
  },
  {
    icon: AlertTriangle,
    title: "Risk Management",
    description: "Proactive alerts and mitigation strategies",
    color: "bg-supply-warning/20 text-supply-warning",
  },
];

const stats = [
  { label: "Disruption Detection", value: "98%", icon: Shield },
  { label: "Cost Reduction", value: "25%", icon: TrendingUp },
  { label: "Response Time", value: "3min", icon: Zap },
  { label: "Accuracy", value: "94%", icon: BarChart3 },
];

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20"
      >
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 text-sm px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Powered by Latest AI Technology
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-supply-primary to-supply-secondary bg-clip-text text-transparent">
            SupplyFlow AI
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Revolutionary AI-powered supply chain management platform that
            predicts disruptions, optimizes routes, and provides intelligent
            insights in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-supply-primary to-supply-secondary hover:from-supply-primary/90 hover:to-supply-secondary/90"
            >
              <Link href="/dashboard">
                Launch Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/copilot">
                Try AI Copilot
                <Brain className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-16"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-card/50 border-border"
            >
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-supply-primary" />
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-16"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Intelligent Supply Chain Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leverage cutting-edge AI and machine learning to transform your
            supply chain operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card
                className={`h-full bg-card/50 border-border hover:border-supply-primary/50 transition-all duration-300 ${hoveredFeature === index ? "ring-2 ring-supply-primary" : ""}`}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-20 text-center"
      >
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-supply-primary/20 to-supply-secondary/20 border-supply-primary/20">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Ready to Transform Your Supply Chain?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Join the future of supply chain management with AI-powered
              insights and automation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <Link href="/dashboard">
                  Get Started Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
