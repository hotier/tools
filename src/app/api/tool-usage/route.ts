import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { toolPath } = await request.json();

    if (!toolPath) {
      return NextResponse.json({ error: 'Tool path is required' }, { status: 400 });
    }

    await db`
      INSERT INTO tool_usage (tool_path, usage_count)
      VALUES (${toolPath}, 1)
      ON CONFLICT (tool_path) DO UPDATE
      SET usage_count = tool_usage.usage_count + 1, last_used = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tool usage:', error);
    return NextResponse.json({ error: 'Failed to update tool usage' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'popular';

    if (type === 'new') {
      // 获取最新添加的工具（按 created_at 排序）
      const tools = await db`
        SELECT tool_path, usage_count, created_at
        FROM tool_usage
        ORDER BY created_at DESC
      `;
      return NextResponse.json(tools);
    } else {
      // 获取使用次数最多的工具
      const tools = await db`
        SELECT tool_path, usage_count, created_at
        FROM tool_usage
        ORDER BY usage_count DESC
        LIMIT 10
      `;
      return NextResponse.json(tools);
    }
  } catch (error) {
    console.error('Error fetching tool usage:', error);
    return NextResponse.json({ error: 'Failed to fetch tool usage' }, { status: 500 });
  }
}
