"use client";

import { motion } from "framer-motion";
import { Loader2, Package2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "brand";
  text?: string;
  className?: string;
}

export function Loading({ 
  size = "md", 
  variant = "spinner", 
  text,
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <Loader2 className={cn("animate-spin text-supply-primary", sizeClasses[size])} />
        {text && (
          <p className={cn("text-muted-foreground animate-pulse", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-supply-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <motion.div
          className={cn("bg-supply-primary rounded-full", sizeClasses[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "brand") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Package2 className={cn("text-supply-primary", sizeClasses[size])} />
        </motion.div>
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// Full page loading overlay
export function LoadingOverlay({ 
  isVisible, 
  text = "Loading...",
  variant = "brand" 
}: { 
  isVisible: boolean; 
  text?: string;
  variant?: LoadingProps["variant"];
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-card border border-border rounded-lg p-8 shadow-lg"
      >
        <Loading size="xl" variant={variant} text={text} />
      </motion.div>
    </motion.div>
  );
}

// Page loading component
export function PageLoading({ text = "Loading page..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loading size="xl" variant="brand" text={text} />
    </div>
  );
}