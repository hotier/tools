"use client";

import { useEffect } from "react";
import { APP_VERSION } from "@/utils/version";

export default function UpdateChecker() {
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const res = await fetch("/api/version?t=" + Date.now());
        const { version: serverVersion } = await res.json();

        if (serverVersion && serverVersion !== APP_VERSION) {
          if (confirm(`🎉 发现新版本 ${serverVersion}，包含新功能更新，立即刷新？`)) {
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Version check failed:", error);
      }
    };

    checkUpdate();

    document.addEventListener("visibilitychange", checkUpdate);

    return () => {
      document.removeEventListener("visibilitychange", checkUpdate);
    };
  }, []);

  return null;
}
