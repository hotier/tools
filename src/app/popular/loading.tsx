export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner" />
        <p className="text-muted-foreground text-sm">加载中...</p>
      </div>
    </div>
  );
}
