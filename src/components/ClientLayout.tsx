"use client";

import { SidebarProvider } from "@/components/SidebarContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SearchProvider } from "@/components/SearchContext";
import { RecentToolsProvider } from "@/components/RecentToolsContext";
import { ToastProvider } from "@/components/ToastContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SearchProvider>
          <RecentToolsProvider>
            <SidebarProvider>
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </div>
            </SidebarProvider>
          </RecentToolsProvider>
        </SearchProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
