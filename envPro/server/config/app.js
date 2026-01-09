const express = require('express');
const app = express();
// 关键修改1：使用Vercel的环境端口，本地默认3000
const port = process.env.PORT || 3000; 

// 引入数据库配置
const { poolPromise } = require('./db');

// 解决跨域问题（前端调用后端接口必须配置）
const cors = require('cors');
app.use(cors());

// 解析JSON请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 引入路由
const userRouter = require('./routes/user');

// 挂载路由
app.use('/api/user', userRouter);       // 前缀/api/user

// 等待数据库连接成功后再启动服务
(async () => {
  try {
    // 等待数据库连接
    const pool = await poolPromise;
    if (pool) {
      console.log('数据库连接成功！');
      // 启动服务
      // 新增：托管项目根目录下的静态文件（比如login.html、index.html）
app.use(express.static('.')); // 表示托管当前项目根目录下的所有文件
      app.listen(port, () => {
        // 关键修改2：日志输出适配Vercel，去掉localhost
        console.log(`后端服务运行在端口：${port}`);
      });
    } else {
      console.error('数据库连接失败，无法启动服务');
      process.exit(1);
    }
  } catch (error) {
    console.error('启动服务时发生错误:', error);
    process.exit(1);
  }
})();

// 新增：健康检查接口（方便测试Vercel部署是否成功）
app.get('/', (req, res) => {
  res.send('✅ 后端服务已正常启动！可访问 /api/user 测试接口');
});