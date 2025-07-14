"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { PageLoading } from "@/components/ui/loading";

interface RouteGuardProps {
  children: React.ReactNode;
}

const publicRoutes = ["/", "/auth/login", "/auth/register"];

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/auth/register");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoading text="Checking authentication..." />;
  }

  // Show loading while redirecting unauthenticated users
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return <PageLoading text="Redirecting to sign up..." />;
  }

  return <>{children}</>;
}