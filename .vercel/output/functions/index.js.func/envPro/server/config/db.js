// 检查是否配置了POSTGRES_URL环境变量
if (process.env.POSTGRES_URL) {
  // 生产环境：使用真实的PostgreSQL连接池
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  // 测试连接并创建表
  pool.connect((err, client, release) => {
    if (err) {
      console.error('❌ PostgreSQL连接失败：', err.message);
      console.info('💡 请确保PostgreSQL服务器已启动，并且连接字符串正确。');
      return; // 不再抛出错误，允许服务继续运行
    }
    console.log('✅ PostgreSQL连接成功！');

    // 创建用户表（首次启动自动创建）
    const createUserTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT DEFAULT '',
        email TEXT,
        phone TEXT
      )
    `;
    client.query(createUserTable, (err) => {
      release(); // 释放连接
      if (err) console.warn('⚠️ 用户表已存在或创建失败：', err.message);
      else console.log('✅ 用户表创建/验证成功！');
    });
  });
  
  // 导出真实连接池
  module.exports = { pool };
} else {
  // 开发环境：使用模拟的连接池
  console.warn('⚠️ 未配置POSTGRES_URL环境变量，将使用模拟数据进行开发。');
  console.info('💡 在生产环境部署时，请设置POSTGRES_URL环境变量以连接真实的PostgreSQL数据库。');
  
  // 模拟数据存储
  let mockUsers = [];
  let nextId = 1;
  
  // 模拟连接池
  const mockPool = {
    async query(sql, params) {
      // 模拟SELECT 1 + 1
      if (sql === 'SELECT 1 + 1 AS result') {
        return { rows: [{ result: 2 }] };
      }
      
      // 模拟注册用户
      if (sql.includes('INSERT INTO users')) {
        const [username, password, nickname, email, phone] = params;
        
        // 检查用户名是否已存在
        if (mockUsers.some(user => user.username === username)) {
          throw new Error('duplicate key value violates unique constraint "users_username_key"');
        }
        
        // 创建新用户
        const newUser = {
          id: nextId++,
          username,
          password,
          nickname,
          email,
          phone
        };
        
        mockUsers.push(newUser);
        
        return { 
          rows: [{ 
            id: newUser.id, 
            username: newUser.username, 
            nickname: newUser.nickname, 
            email: newUser.email, 
            phone: newUser.phone 
          }] 
        };
      }
      
      // 模拟查询用户
      if (sql.includes('SELECT * FROM users WHERE username = $1')) {
        const [username] = params;
        const user = mockUsers.find(user => user.username === username);
        
        return { rows: user ? [user] : [] };
      }
      
      // 模拟检查用户名是否存在
      if (sql.includes('SELECT * FROM users WHERE username = $1')) {
        const [username] = params;
        const exists = mockUsers.some(user => user.username === username);
        
        return { rows: exists ? [{}] : [] };
      }
      
      // 模拟检查邮箱是否存在
      if (sql.includes('SELECT * FROM users WHERE email = $1')) {
        const [email] = params;
        const exists = mockUsers.some(user => user.email === email);
        
        return { rows: exists ? [{}] : [] };
      }
      
      // 模拟检查手机号是否存在
      if (sql.includes('SELECT * FROM users WHERE phone = $1')) {
        const [phone] = params;
        const exists = mockUsers.some(user => user.phone === phone);
        
        return { rows: exists ? [{}] : [] };
      }
      
      throw new Error(`未实现的SQL查询: ${sql}`);
    }
  };
  
  // 导出模拟连接池
  module.exports = { pool: mockPool };
}