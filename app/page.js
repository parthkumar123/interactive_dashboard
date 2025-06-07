"use client";

import DashboardHeader from "./components/DashboardHeader";
import DashboardGrid from "./components/DashboardGrid";
import WidgetList from "./components/WidgetList";
import ClientOnly from "./components/ClientOnly";
import StoreProvider from "./components/StoreProvider";
import { UserProvider } from "./contexts/UserContext";
import { NotificationProvider } from "./contexts/NotificationContext";

export default function Home() {
  return (
    <NotificationProvider>
      <UserProvider>
        <StoreProvider>
          <div className="min-h-screen bg-gray-50">
            <DashboardHeader />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <ClientOnly>
                <DashboardGrid />
                <WidgetList />
              </ClientOnly>
            </main>
          </div>
        </StoreProvider>
      </UserProvider>
    </NotificationProvider>
  );
}
