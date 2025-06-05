//src\App.jsx
import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout"; // header & footer
import DashboardLayout from "./layouts/DashboardLayout"; //for sidebar
import SimpleLayout from "./layouts/SimpleLayout";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LandlordDashboard from './pages/LandlordDashboard';
import CaretakerDashboard from './pages/CaretakerDashboard';
import CreatePropertyPage from "./pages/CreatePropertyPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import CreateTenantPage from "./pages/CreateTenantPage";
import TenantsPage from "./pages/TenantsPage";
import TenantProfilePage from "./pages/TenantProfilePage";
import Users from "./pages/UsersPage";
import SellingPage from "./pages/SellingPage";

// Lazy load tabs
const OverviewTab = lazy(() => import("./pages/tabs/OverviewTab"));
const EditPropertyTab = lazy(() => import("./pages/tabs/EditPropertyTab"));
const UnitsTab = lazy(() => import("./pages/tabs/UnitsTab"));
const WaterReadingsTab = lazy(() => import("./pages/tabs/WaterReadingsTab"));
const TenantsTab = lazy(() => import("./pages/tabs/TenantsTab"));
const PaymentsTab = lazy(() => import("./pages/tabs/PaymentsTab"));
const ExpensesTab = lazy(() => import("./pages/tabs/ExpensesTab"));
const InvoicesTab = lazy(() => import("./pages/tabs/InvoicesTab"));
const BillingsTab = lazy(() => import("./pages/tabs/BillingsTab"));
const ReportsTab = lazy(() => import("./pages/tabs/ReportsTab"));
const RequestsTab = lazy(() => import("./pages/tabs/RequestsTab"));
const MessagesTab = lazy(() => import("./pages/tabs/MessagesTab"));
const UsersTab = lazy(() => import("./pages/tabs/UsersTab"));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="p-4">Loading tab...</div>}>
        <Routes>
          {/* Public Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="home" element={<Home />} />
            <Route path="selling" element={<SellingPage />} />
          </Route>

          {/* Dashboard Layout for authenticated routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create-property" element={<CreatePropertyPage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="users" element={<Users />} />
            <Route path="assign-tenant" element={<CreateTenantPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="tenants/:id" element={<TenantProfilePage />} />

            {/* Property details + tabs */}
            <Route path="properties/:id" element={<PropertyDetailsPage />}>
              <Route path="overview" element={<OverviewTab />} />
              <Route path="edit" element={<EditPropertyTab />} />
              <Route path="units" element={<UnitsTab />} />
              <Route path="water-readings" element={<WaterReadingsTab />} />
              <Route path="tenants" element={<TenantsTab />} />
              <Route path="payments" element={<PaymentsTab />} />
              <Route path="invoices" element={<InvoicesTab />} />
              <Route path="billings" element={<BillingsTab />} />
              <Route path="reports" element={<ReportsTab />} />
              <Route path="expenses" element={<ExpensesTab />} />
              <Route path="requests" element={<RequestsTab />} />
              <Route path="messages" element={<MessagesTab />} />
              <Route path="users" element={<UsersTab />} />
            </Route>
          </Route>

          {/* Landlord Dashboard */}
          <Route element={<SimpleLayout />}>
            <Route path="landlord/properties/:propertyId/dashboard/:tab" element={<LandlordDashboard />} />
            <Route path="reports" element={<ReportsTab />} />
            <Route path="expenses" element={<ExpensesTab />} />
          </Route>

          {/* Caretaker Dashboard */}
          <Route element={<SimpleLayout />}>
            <Route path="caretaker/properties/:propertyId/dashboard/:tab" element={<CaretakerDashboard />} />
            {/* <Route path="water-readings" element={<WaterReadingsTab />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
