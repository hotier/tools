"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    defaultTheme: "system" as "light" | "dark" | "system",
    showUsageStats: true,
    enableNotifications: false,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">设置</h1>

      <div className="max-w-2xl space-y-6">
        <section className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">外观</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">默认主题</label>
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings({ ...settings, defaultTheme: theme })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      settings.defaultTheme === theme
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统"}
                  </button>
                ))}
              </div>
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
                onClick={() => setSettings({ ...settings, showUsageStats: !settings.showUsageStats })}
                className={`w-12 h-6 rounded-full transition-colors ${
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
                onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                className={`w-12 h-6 rounded-full transition-colors ${
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
          <div className="space-y-4">
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              清除所有数据
            </button>
            <p className="text-sm text-muted-foreground">
              这将清除所有本地存储的数据，包括收藏和使用记录
            </p>
          </div>
        </section>

        <section className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">关于</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>版本: 1.0.0</p>
            <p>个人工具箱 - 收集各种实用工具</p>
          </div>
        </section>
      </div>
    </div>
  );
}
