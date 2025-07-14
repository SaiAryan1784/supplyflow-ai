import { useEffect } from 'react';

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-muted rounded-full ${className}`}>
      <div
        className="bg-supply-primary h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}