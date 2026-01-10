const express = require('express');
const app = express();
// 使用Vercel的环境端口，本地默认3000
const port = process.env.PORT || 3000; 

// 引入数据库配置（适配你的db.js导出的pool）
const { pool } = require('./db'); // 关键修改：用pool而非poolPromise

// 解决跨域问题（前端调用后端接口必须配置）
const cors = require('cors');
app.use(cors());

// 解析JSON请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 引入路由
const userRouter = require('./routes/user');

// 挂载路由（前缀/api/user，前端调用时要加这个前缀）
app.use('/api/user', userRouter);      

// 托管项目根目录下的静态文件（比如login.html、index.html）
app.use(express.static('.')); 

// 启动服务（无需等待poolPromise，适配原db.js的连接逻辑）
// 先验证数据库是否能正常查询，再启动服务
pool.query('SELECT 1 + 1 AS result')
  .then(() => {
    console.log('✅ 数据库连接成功！');
    // 启动服务
    app.listen(port, () => {
      console.log(`✅ 后端服务运行在端口：${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ 数据库连接失败，无法启动服务:', err.message);
    // 不强制退出，允许用模拟数据运行（保留原db.js的友好特性）
    console.warn('⚠️ 将使用模拟数据启动服务（仅开发环境）');
    app.listen(port, () => {
      console.log(`✅ 后端服务运行在端口：${port}（模拟数据模式）`);
    });
  });

// 健康检查接口（方便测试部署是否成功）
app.get('/', (req, res) => {
  res.send('✅ 后端服务已正常启动！可访问 /api/user/register 测试注册接口');
});