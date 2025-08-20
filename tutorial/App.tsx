
import React from 'react';
// import TutorialPage from "./pages/tutorial";
import TestAlphaData from "./pages/testAlphaData";
import { SplashPage } from "./pages/SplashPage";
import { StrategyMasteryTest } from "./pages/StrategyMasteryTest";
import { AuthRedirect } from "./components/auth/AuthRedirect";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PortfolioScreen } from "@/components/portfolio/PortfolioScreen";
import { LeagueScreen } from "@/components/leagues/LeagueScreen";
import { UnifiedCollectionScreen } from "@/components/collection/UnifiedCollectionScreen";
import { StoreScreen } from "@/components/store/StoreScreen";
import { FusionWorkbench } from "@/components/fusion/FusionWorkbench";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { LeaguesListScreen } from "@/components/leagues/LeaguesListScreen";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { HelpScreen } from "@/components/help/HelpScreen";
import { AuthScreen } from "@/components/auth/AuthScreen";
import CardsShowcase from "@/pages/CardsShowcase";
import GlobalErrorBoundary from "@/components/shared/GlobalErrorBoundary";
import { AdminPanel } from "@/components/admin/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalErrorBoundary>
          <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Root - Smart redirect based on auth */}
              <Route path="/" element={<AuthRedirect />} />
              
              {/* Splash Page */}
              <Route path="/splash" element={<SplashPage />} />
              
              {/* Auth */}
              <Route path="/auth" element={<AuthScreen />} />
              
              {/* Tutorial hub (optional) - disabled
              <Route path="/tutorial" element={<TutorialPage />} />

              {/* Specific tutorial by ID - disabled
              <Route path="/tutorial/:id" element={<TutorialPage />} /> */}

              
              {/* Dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <LayoutWrapper currentView="dashboard">
                    <Dashboard />
                  </LayoutWrapper>
                } 
              />

              {/* Profile */}
              <Route 
                path="/profile" 
                element={
                  <LayoutWrapper currentView="profile">
                    <ProfileScreen />
                  </LayoutWrapper>
                } 
              />

              {/* Portfolio - standalone */}
              <Route 
                path="/portfolio" 
                element={<Navigate to="/leagues" replace />} 
              />
              
              {/* Leagues */}
              <Route 
                path="/leagues" 
                element={
                  <LayoutWrapper currentView="leagues">
                    <LeaguesListScreen />
                  </LayoutWrapper>
                } 
              />
              <Route 
                path="/leagues/:leagueId/portfolio" 
                element={
                  <LayoutWrapper currentView="leagues">
                    <PortfolioScreen />
                  </LayoutWrapper>
                } 
              />
              <Route 
                path="/leagues/:leagueId/portfolio/edit" 
                element={
                  <LayoutWrapper currentView="leagues">
                    <PortfolioScreen />
                  </LayoutWrapper>
                } 
              />
              <Route 
                path="/leagues/:leagueId" 
                element={
                  <LayoutWrapper currentView="leagues">
                    <LeagueScreen />
                  </LayoutWrapper>
                } 
              />
              
              {/* Store */}
              <Route 
                path="/store" 
                element={
                  <LayoutWrapper currentView="store">
                    <StoreScreen />
                  </LayoutWrapper>
                } 
              />
              
              {/* Cards Showcase (redirect to Collection) */}
              <Route 
                path="/cards" 
                element={<Navigate to="/collection" replace />} 
              />
              
              {/* Collection - Now using UnifiedCollectionScreen */}
              <Route 
                path="/collection" 
                element={
                  <LayoutWrapper currentView="collection">
                    <UnifiedCollectionScreen />
                  </LayoutWrapper>
                } 
              />
              
              {/* Fusion */}
              <Route 
                path="/fusion" 
                element={
                  <LayoutWrapper currentView="fusion">
                    <FusionWorkbench />
                  </LayoutWrapper>
                } 
              />
              
              {/* Help */}
              <Route 
                path="/help" 
                element={
                  <LayoutWrapper currentView="help">
                    <HelpScreen />
                  </LayoutWrapper>
                } 
              />
              
              {/* Admin - Protected Route */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true} redirectTo="/dashboard">
                    <LayoutWrapper currentView="admin">
                      <AdminPanel />
                    </LayoutWrapper>
                  </ProtectedRoute>
                } 
              />
              
              {/* Test page */}
              <Route 
                path="/test-alpha-data" 
                element={<TestAlphaData />} 
              />
              
              {/* Strategy Mastery Test */}
              <Route 
                path="/strategy-mastery-test" 
                element={<StrategyMasteryTest />} 
              />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          </TooltipProvider>
        </GlobalErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
