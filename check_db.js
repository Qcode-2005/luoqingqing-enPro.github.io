// 检查数据库内容的脚本
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 连接数据库
const dbPath = path.resolve(__dirname, './envPro/server/config/database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ 连接数据库失败：', err.message);
    process.exit(1);
  }
  console.log('✅ 连接数据库成功！');
});

// 查询用户表内容
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    console.error('❌ 查询用户表失败：', err.message);
    db.close();
    return;
  }
  
  console.log('\n📋 用户表内容：');
  console.log('=========================');
  if (rows.length === 0) {
    console.log('❌ 用户表为空！');
  } else {
    rows.forEach((row, index) => {
      console.log(`\n用户 ${index + 1}:`);
      console.log(`- ID: ${row.id}`);
      console.log(`- 用户名: ${row.username}`);
      console.log(`- 密码: ${row.password}`);
    });
  }
  console.log('=========================');
  
  // 关闭数据库连接
  db.close();
});
