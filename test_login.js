// 测试登录功能的脚本
const fetch = require('node-fetch');

async function testLogin(username, password) {
  console.log(`\n🔍 测试登录：用户名=${username}, 密码=${password}`);
  
  try {
    const response = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    
    const result = await response.json();
    console.log('📡 响应结果：', result);
    
    if (result.code === 200) {
      console.log('✅ 登录成功！');
    } else {
      console.log('❌ 登录失败：', result.msg);
    }
    
    return result;
  } catch (error) {
    console.error('💥 请求错误：', error.message);
    return null;
  }
}

// 先启动服务器，然后测试登录
async function runTests() {
  console.log('🚀 开始测试登录功能...');
  console.log('请确保服务器已经在 http://localhost:3000 启动！');
  
  // 测试正确的用户名和密码
  await testLogin('admin', 'admin123');
  await testLogin('test002', '654321');
  
  // 测试错误的密码
  await testLogin('admin', 'wrongpassword');
  
  console.log('\n📋 测试完成！');
}

runTests();
