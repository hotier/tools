import { NextResponse } from "next/server";
import { APP_VERSION } from "@/utils/version";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/hotier/tools/releases/latest",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "tools-app",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({
        version: APP_VERSION,
        timestamp: new Date().toISOString(),
      });
    }

    const release = await res.json();

    return NextResponse.json({
      version: release.tag_name?.replace(/^v/, "") || APP_VERSION,
      releaseNotes: release.body || "",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
    });
  }
}