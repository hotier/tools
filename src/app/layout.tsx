import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "简序",
  description: "常用工具集合",
  icons: [
    {
      url: "/favicon.ico",
      sizes: "32x32",
      type: "image/x-icon",
    },
    {
      url: "/favicon.ico",
      sizes: "16x16",
      type: "image/x-icon",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="font-sans">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = false;
                  
                  if (theme === 'dark') {
                    isDark = true;
                  } else if (theme === 'light') {
                    isDark = false;
                  } else {
                    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.addEventListener('load', function() {
                  var loader = document.getElementById('initial-loader');
                  if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(function() {
                      loader.style.display = 'none';
                    }, 300);
                  }
                });
              })();
            `,
          }}
        />
        <div
          id="initial-loader"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background)',
            zIndex: 9999,
            transition: 'opacity 0.3s ease-out',
            opacity: 1
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--muted)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>加载中...</span>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
