
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AuthCard from "./components/auth/AuthCard";
import Dashboard from "./pages/Dashboard";
import BudgetList from "./pages/BudgetList";
import BudgetDetail from "./pages/BudgetDetail";
import WorkOrderList from "./pages/WorkOrderList";
import WorkOrderDetail from "./pages/WorkOrderDetail";
import Warehouse from "./pages/Warehouse";
import Alerts from "./pages/Alerts";
import AdminImport from "./pages/AdminImport";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";
import RouteGuard from "./components/RouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<RouteGuard><AppLayout /></RouteGuard>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="presupuestos" element={<BudgetList />} />
            <Route path="presupuesto/:id" element={<BudgetDetail />} />
            <Route path="wo" element={<WorkOrderList />} />
            <Route path="wo/:id" element={<WorkOrderDetail />} />
            <Route path="warehouse" element={<Warehouse />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="admin-import" element={<AdminImport />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
