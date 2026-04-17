import { APP_VERSION } from "@/config/version";

export function Footer() {
  return (
    <footer className="border-t py-3 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <span>个人工具箱 - 让工作更高效</span>
          <span className="px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
            v{APP_VERSION}
          </span>
        </p>
      </div>
    </footer>
  );
}
