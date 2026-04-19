import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "CHANGELOG.md");
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error reading changelog:", error);
    return NextResponse.json({ content: "" });
  }
}