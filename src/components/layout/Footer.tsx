"use client";

import Link from "next/link";
import { APP_VERSION } from "@/config/version";

export function Footer() {
  return (
    <footer className="border-t py-3 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <span>简序 - 让工作更高效</span>
          <Link
            href="/changelog"
            className="px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded transition-colors hover:bg-primary/20 dark:hover:bg-primary/30"
          >
            v{APP_VERSION}
          </Link>
        </p>
      </div>
    </footer>
  );
}