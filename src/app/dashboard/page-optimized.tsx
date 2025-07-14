"use client";

import { Suspense, lazy } from "react";
import { NavBar } from "@/components/shared/nav-bar";
import { Loading } from "@/components/ui/loading";

// Lazy load heavy components
const DashboardMetrics = lazy(() => import("@/components/dashboard/metrics").then(m => ({ default: m.DashboardMetrics })));
const QuickActions = lazy(() => import("@/components/dashboard/quick-actions").then(m => ({ default: m.QuickActions })));
const AlertsPanel = lazy(() => import("@/components/dashboard/alerts-panel").then(m => ({ default: m.AlertsPanel })));
const NetworkOverview = lazy(() => import("@/components/dashboard/network-overview").then(m => ({ default: m.NetworkOverview })));

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Supply Chain Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage your supply chain operations in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <Suspense fallback={<Loading size="lg" text="Loading metrics..." className="py-8" />}>
          <DashboardMetrics />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Suspense fallback={<Loading size="md" text="Loading actions..." className="py-4" />}>
              <QuickActions />
            </Suspense>
          </div>

          {/* Alerts */}
          <Suspense fallback={<Loading size="md" text="Loading alerts..." className="py-4" />}>
            <AlertsPanel />
          </Suspense>
        </div>

        {/* Network Overview */}
        <div className="mt-8">
          <Suspense fallback={<Loading size="lg" text="Loading network overview..." className="py-8" />}>
            <NetworkOverview />
          </Suspense>
        </div>
      </div>
    </div>
  );
}