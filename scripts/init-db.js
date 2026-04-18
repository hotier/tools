const { neon } = require('@neondatabase/serverless');

const connectionString = 'postgresql://neondb_owner:npg_Hkrmnpb0K9Ms@ep-sparkling-dream-a1kgnxmz-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const sql = neon(connectionString);

async function initDatabase() {
  console.log('正在连接数据库...');

  try {
    console.log('创建表...');
    await sql`
      CREATE TABLE IF NOT EXISTS tool_usage (
        id SERIAL PRIMARY KEY,
        tool_path VARCHAR(255) UNIQUE NOT NULL,
        usage_count INTEGER DEFAULT 0,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('表创建成功！');

    console.log('创建索引...');
    await sql`CREATE INDEX IF NOT EXISTS idx_tool_path ON tool_usage(tool_path)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_usage_count ON tool_usage(usage_count DESC)`;
    console.log('索引创建成功！');

    console.log('\n数据库初始化完成！');
  } catch (error) {
    console.error('错误:', error);
  }
}

initDatabase();
