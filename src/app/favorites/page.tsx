export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">我的收藏</h1>
      <p className="text-muted-foreground mb-6">你收藏的工具将显示在这里</p>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 text-muted-foreground mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        <p className="text-muted-foreground mb-4">还没有收藏任何工具</p>
        <p className="text-sm text-muted-foreground">
          点击工具页面上的收藏按钮，将工具添加到这里
        </p>
      </div>
    </div>
  );
}
