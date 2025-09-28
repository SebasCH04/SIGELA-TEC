import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className,
  showHeader = true,
  headerContent,
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      "max-w-sm mx-auto", // Mobile-first responsive container
      "relative overflow-hidden",
      className
    )}>
      {showHeader && (
        <header className="bg-primary text-primary-foreground p-4 relative">
          {headerContent}
        </header>
      )}
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
};