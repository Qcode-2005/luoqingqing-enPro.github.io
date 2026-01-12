// Netlify Functions 后端入口文件
const dotenv = require('dotenv');
// 调整.env文件路径，适配当前文件位置
const result = dotenv.config({ path: '../../envPro/server/config/.env' });

// 输出环境变量信息用于调试
console.log('Netlify Functions - Environment variables:', process.env);
console.log('Netlify Functions - dotenv result:', result);
console.log('Netlify Functions - POSTGRES_URL:', process.env.POSTGRES_URL);

const express = require('express');
const serverless = require('serverless-http');
const app = express();

// 1. 解决跨域
const cors = require('cors');
app.use(cors());

// 2. 解析请求数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. 引入数据库配置和路由
const { pool } = require('../../envPro/server/config/db.js');
const userRoutes = require('../../envPro/server/config/routes/user.js');

// 4. 使用用户路由 - 适配Netlify Functions的路径转发
app.use('/api/user', userRoutes);

// 5. 备选路由（确保通过Netlify Functions转发的请求能正确匹配）
app.use('/.netlify/functions/server/api/user', userRoutes);

// 5. 健康检查接口
app.get('/', (req, res) => {
  res.send('✅ Netlify 后端服务已启动！');
});

// 6. 导出使用serverless-http包装的Express应用作为Netlify Functions处理函数
exports.handler = serverless(app);

// 注意：在Netlify环境中不需要app.listen()，由平台管理端口和请求