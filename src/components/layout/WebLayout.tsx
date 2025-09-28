import React from 'react';
import { cn } from '@/lib/utils';

interface WebLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
}

export const WebLayout: React.FC<WebLayoutProps> = ({
  children,
  className,
  showHeader = true,
  headerContent,
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      "w-full", // Full width for web
      "relative",
      className
    )}>
      {showHeader && (
        <header className="bg-primary text-primary-foreground px-6 py-4 relative shadow-sm">
          {headerContent}
        </header>
      )}
      <main className="flex-1 relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
};