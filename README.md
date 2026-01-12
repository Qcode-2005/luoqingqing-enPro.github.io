# 用户注册登录系统

一个基于Node.js、Express和PostgreSQL的用户注册登录系统，支持本地开发和Vercel部署。

## 技术栈

- **后端**: Node.js + Express
- **数据库**: PostgreSQL (推荐) / SQLite (开发环境)
- **前端**: HTML + CSS + JavaScript
- **部署**: Vercel

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务

```bash
npm start
```

服务将运行在 `http://localhost:3000`

### 3. 开发环境说明

- 本地开发时，如果未配置PostgreSQL，系统将使用模拟模式运行
- 控制台会显示连接状态和提示信息
- 可以通过 `http://localhost:3000/api/user/test-db` 测试数据库连接

## Vercel部署

### 1. 创建PostgreSQL数据库

您可以选择以下服务之一创建PostgreSQL数据库：

- **Vercel PostgreSQL** (推荐): 直接在Vercel控制台创建
- **Supabase**: 免费的PostgreSQL服务
- **Neon**: 专为Serverless设计的PostgreSQL

### 2. 配置环境变量

在Vercel项目设置中添加以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| POSTGRES_URL | PostgreSQL连接字符串 | postgres://user:password@host:5432/database |

### 3. 部署项目

使用Vercel CLI部署：

```bash
vercel --prod
```

或者直接在Vercel控制台导入GitHub仓库进行部署。

## 数据库配置

### 表结构

系统会自动创建以下表：

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nickname TEXT DEFAULT '',
  email TEXT,
  phone TEXT
)
```

### 主要API

- **注册**: `POST /api/user/register`
- **登录**: `POST /api/user/login`
- **测试连接**: `GET /api/user/test-db`

## 常见问题

### 1. 为什么SQLite在Vercel上不能持久化数据？

Vercel使用无服务器架构，每个请求可能由不同的服务器实例处理，实例之间没有共享文件系统，导致SQLite数据无法持久化。

### 2. 如何获取PostgreSQL连接字符串？

- **Vercel PostgreSQL**: 在Vercel控制台的数据库设置中获取
- **Supabase**: 在项目设置的数据库页面获取
- **Neon**: 在项目控制台的连接页面获取

### 3. 部署后网站无法打开怎么办？

- 检查Vercel部署日志是否有错误
- 确保环境变量配置正确
- 检查数据库连接是否正常

## 许可证

MIT
