-- 创建工具使用统计表格
CREATE TABLE IF NOT EXISTS tool_usage (
  id SERIAL PRIMARY KEY,
  tool_path VARCHAR(255) UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_tool_path ON tool_usage(tool_path);
CREATE INDEX IF NOT EXISTS idx_usage_count ON tool_usage(usage_count DESC);
