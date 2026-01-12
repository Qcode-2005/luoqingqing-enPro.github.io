// enPro/index.js - 后端入口文件
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// 1. 解决跨域（前端调用后端接口不会报错）
const cors = require('cors');
app.use(cors());

// 2. 解析前端传的JSON/表单数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. 托管静态文件（让前端页面能被访问）
// 前端文件都在envPro目录下，所以托管envPro目录
app.use(express.static('envPro'));

// 4. 引入数据库配置和路由
const { pool } = require('./envPro/server/config/db.js');
const userRoutes = require('./envPro/server/config/routes/user.js');

// 5. 使用用户路由
app.use('/api/user', userRoutes);

// 6. 健康检查接口（验证后端是否启动）
app.get('/', (req, res) => {
  res.send('✅ 后端服务已启动！');
});

// 7. 启动后端服务
app.listen(port, () => {
  console.log(`✅ 后端服务运行在端口：${port}`);
  console.log(`🔗 本地访问地址：http://localhost:${port}`);
});