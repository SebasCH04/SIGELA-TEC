import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/auth/LoginForm";
import { LabDashboard } from "./components/dashboard/LabDashboard";
import { UserDashboard } from "./components/dashboard/UserDashboard";
import { TechnicianDashboard } from "./components/dashboard/TechnicianDashboard";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/dashboard/estudiante" element={<UserDashboard />} />
          <Route path="/dashboard/profesor" element={<UserDashboard />} />
          <Route path="/dashboard/tecnico" element={<TechnicianDashboard />} />
          <Route path="/dashboard/encargado" element={<LabDashboard />} />
          <Route path="/dashboard/administrador" element={<AdminDashboard />} />
          <Route path="/dashboard/departamento" element={<LabDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
