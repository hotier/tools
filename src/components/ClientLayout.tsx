"use client";

import { useEffect } from "react";
import { SidebarProvider } from "@/components/SidebarContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/components/SettingsContext";
import { SearchProvider } from "@/components/SearchContext";
import { RecentToolsProvider } from "@/components/RecentToolsContext";
import { ToastProvider } from "@/components/ToastContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import UpdateChecker from "@/components/UpdateChecker";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = (e: Event) => {
      const target = e.target;
      if (
        target === document ||
        target === document.documentElement ||
        target === document.body
      ) {
        document.documentElement.classList.add("is-scrolling");
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          document.documentElement.classList.remove("is-scrolling");
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, { capture: true });
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <ThemeProvider>
      <SettingsProvider>
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
                <UpdateChecker />
              </SidebarProvider>
            </RecentToolsProvider>
          </SearchProvider>
        </ToastProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
