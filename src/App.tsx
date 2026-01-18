import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EquipmentProvider } from "@/contexts/EquipmentContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import AddSupplier from "./pages/AddSupplier";
import ViewAll from "./pages/ViewAll";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EquipmentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/add-supplier" element={<AddSupplier />} />
              <Route path="/view-all" element={<ViewAll />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </EquipmentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
