"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useSettings } from "@/components/SettingsContext";
import { APP_VERSION } from "@/config/version";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, clearAllData } = useSettings();

  const handleClearData = () => {
    if (confirm("这将清除所有本地存储的数据，包括主题设置、收藏和使用记录。\n\n确定要清除所有数据吗？此操作不可撤销。")) {
      clearAllData();
    }
  };

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">设置</h1>

        <div className="space-y-6">
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-4">外观</h2>
            <div>
              <label className="block text-sm font-medium mb-2">默认主题</label>
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      theme === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {t === "light" ? "浅色" : t === "dark" ? "深色" : "跟随系统"}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-4">功能</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">显示使用统计</div>
                  <div className="text-sm text-muted-foreground">在工具页面显示使用次数</div>
                </div>
                <button
                  onClick={() => updateSettings({ showUsageStats: !settings.showUsageStats })}
                  className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    settings.showUsageStats ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.showUsageStats ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">启用通知</div>
                  <div className="text-sm text-muted-foreground">接收工具更新通知</div>
                </div>
                <button
                  onClick={() => updateSettings({ enableNotifications: !settings.enableNotifications })}
                  className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    settings.enableNotifications ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.enableNotifications ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-4">数据</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">清除所有数据</div>
                <div className="text-sm text-muted-foreground">删除所有本地存储的设置和记录</div>
              </div>
              <button 
                onClick={handleClearData}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                清除
              </button>
            </div>
          </section>

          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-4">关于</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>版本: {APP_VERSION}</p>
              <p>个人工具箱 - 收集各种实用工具</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
