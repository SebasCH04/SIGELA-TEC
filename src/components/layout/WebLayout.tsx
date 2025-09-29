import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/', { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore network errors, proceed to client-side cleanup
    }
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className={cn(
      "min-h-screen bg-background",
      "w-full", // Full width for web
      "relative",
      className
    )}>
      {showHeader && (
        <header className="bg-primary text-primary-foreground px-6 py-4 relative shadow-sm">
          <div className="w-full flex items-center justify-between">
            <div>{headerContent}</div>
            <div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
};