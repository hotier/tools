"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useSettings } from "@/components/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { APP_VERSION } from "@/config/version";

type NotificationPermission = "default" | "granted" | "denied";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, clearAllData, clearRecentTools } = useSettings();
  const { toast } = useToast();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [recentToolsCount, setRecentToolsCount] = useState(0);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    const handlePermissionChange = () => {
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    document.addEventListener("visibilitychange", handlePermissionChange);

    const stored = localStorage.getItem("recent-tools");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentToolsCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch {
        setRecentToolsCount(0);
      }
    }

    return () => {
      document.removeEventListener("visibilitychange", handlePermissionChange);
    };
  }, []);

  const handleClearData = () => {
    if (confirm("这将清除所有本地存储的数据，包括主题设置、收藏和使用记录。\n\n确定要清除所有数据吗？此操作不可撤销。")) {
      clearAllData();
    }
  };

  const handleClearRecentTools = () => {
    if (confirm(`确定要清除最近使用记录吗？共 ${recentToolsCount} 条记录。`)) {
      clearRecentTools();
      setRecentToolsCount(0);
    }
  };

  const getPermissionStatusText = () => {
    switch (notificationPermission) {
      case "granted":
        return "已授权";
      case "denied":
        return "已拒绝";
      default:
        return "未授权";
    }
  };

  const getPermissionStatusColor = () => {
    switch (notificationPermission) {
      case "granted":
        return "text-green-600";
      case "denied":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">设置</h1>

        <div className="space-y-6">
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-base font-semibold mb-4">外观</h2>
            <div>
              <label className="block text-sm font-medium mb-2">默认主题</label>
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <Button
                    key={t}
                    onClick={() => setTheme(t)}
                    variant={theme === t ? "default" : "secondary"}
                  >
                    {t === "light" ? "浅色" : t === "dark" ? "深色" : "跟随系统"}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-base font-semibold mb-4">功能</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">显示使用统计</div>
                  <div className="text-sm text-muted-foreground">在工具页面显示使用次数</div>
                </div>
                <button
                  onClick={() => updateSettings({ showUsageStats: !settings.showUsageStats })}
                  className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${settings.showUsageStats ? "bg-primary" : "bg-muted"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.showUsageStats ? "translate-x-6" : "translate-x-0.5"}`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">启用通知</div>
                  <div className="text-sm text-muted-foreground">接收工具更新通知</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${getPermissionStatusColor()}`}>
                    {getPermissionStatusText()}
                  </span>
                  <button
                    onClick={async () => {
                      if (notificationPermission === "default") {
                        const permission = await Notification.requestPermission();
                        setNotificationPermission(permission);
                        if (permission === "granted") {
                          updateSettings({ enableNotifications: true });
                        }
                      } else if (notificationPermission === "granted") {
                        updateSettings({ enableNotifications: !settings.enableNotifications });
                      } else if (notificationPermission === "denied") {
                        toast.info("通知已被浏览器拒绝，请在浏览器设置中开启通知权限");
                      }
                    }}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${notificationPermission === "granted" && settings.enableNotifications ? "bg-primary" : "bg-muted"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${notificationPermission === "granted" && settings.enableNotifications ? "translate-x-6" : "translate-x-0.5"}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-base font-semibold mb-4">数据</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">清除使用记录</div>
                  <div className="text-sm text-muted-foreground">最近使用记录 {recentToolsCount} 条</div>
                </div>
                <Button
                  onClick={handleClearRecentTools}
                  variant="destructive"
                  size="sm"
                >
                  清除
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">清除所有数据</div>
                  <div className="text-sm text-muted-foreground">删除所有本地存储的设置和记录</div>
                </div>
                <Button
                  onClick={handleClearData}
                  variant="destructive"
                  size="sm"
                >
                  清除
                </Button>
              </div>
            </div>
          </section>

          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-base font-semibold mb-4">关于</h2>
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