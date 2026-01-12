const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const bcrypt = require('bcryptjs');

// 测试数据库连接的路由
router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 + 1 AS result');
    res.json({ code: 200, msg: '数据库连接成功' });
  } catch (err) {
    console.error('数据库连接失败:', err);
    res.status(500).json({ 
      code: 500, 
      msg: '数据库连接失败', 
      error: err.message,
      info: '请确保PostgreSQL服务器已启动，并且连接字符串正确。在开发环境中，您可以使用模拟数据进行测试。'
    });
  }
});

// 用户注册路由
router.post('/register', async (req, res) => {
  try {
    const { username, password, nickname, email, phone } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ code: 400, msg: '用户名和密码是必填项' });
    }
    
    // 验证用户名长度
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ code: 400, msg: '用户名长度必须在3-50个字符之间' });
    }
    
    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({ code: 400, msg: '密码长度不能少于6个字符' });
    }
    
    // 检查用户名是否已存在
    const usernameCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ code: 400, msg: '用户名已被使用' });
    }
    
    // 检查邮箱是否已存在（如果提供了邮箱）
    if (email) {
      const emailCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ code: 400, msg: '邮箱已被注册' });
      }
    }
    
    // 检查手机号是否已存在（如果提供了手机号）
    if (phone) {
      const phoneCheck = await pool.query(
        'SELECT * FROM users WHERE phone = $1',
        [phone]
      );
      
      if (phoneCheck.rows.length > 0) {
        return res.status(400).json({ code: 400, msg: '手机号已被注册' });
      }
    }
    
    // 对密码进行加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 插入用户数据到数据库
    const result = await pool.query(
      `
        INSERT INTO users (username, password, nickname, email, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, nickname, email, phone
      `,
      [username, hashedPassword, nickname || '', email || null, phone || null]
    );
    
    const newUser = result.rows[0];
    
    res.json({
      code: 200,
      msg: '注册成功'
    });
    
  } catch (err) {
        console.error('注册失败详细错误:', JSON.stringify(err, null, 2));
        res.status(500).json({ 
            code: 500, 
            msg: '注册失败', 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// 用户登录路由
router.post('/login', async (req, res) => {
  try {
    // 1. 接收前端传递的登录参数
    const { username, password } = req.body;
    
    // 2. 基础参数校验
    if (!username || !password) {
      return res.status(400).json({ 
        code: 400, 
        msg: '用户名和密码不能为空' 
      });
    }
    
    // 3. 查询用户是否存在
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    // 4. 检查用户是否存在
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ 
        code: 400, 
        msg: '用户名不存在' 
      });
    }
    
    // 5. 验证密码（对比加密后的密码）
    const user = userQuery.rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ 
        code: 400, 
        msg: '密码错误' 
      });
    }
    
    // 6. 登录成功，只返回成功信息
    res.json({
      code: 200,
      msg: '登录成功'
    });
    
  } catch (err) {
    console.error('登录失败详细错误:', JSON.stringify(err, null, 2));
    res.status(500).json({ 
      code: 500, 
      msg: '登录接口内部错误', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;