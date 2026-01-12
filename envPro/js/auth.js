// 登录拦截脚本
// 检查用户是否已登录，如果未登录且当前页面不是login.html，则跳转到login.html

(function() {
    // 添加调试信息
    console.log('登录拦截脚本开始执行');
    console.log('当前URL:', window.location.href);
    
    // 检查当前URL是否包含login.html，更可靠的页面检测
    const currentUrl = window.location.href;
    console.log('当前完整URL:', currentUrl);
    
    // 如果当前页面是login.html，则不需要拦截
    if (currentUrl.includes('login.html')) {
        console.log('当前是登录页面，不拦截');
        return;
    }
    
    // 检查用户是否已登录
    const currentUser = localStorage.getItem('currentUser');
    console.log('localStorage中的currentUser:', currentUser);
    console.log('用户是否已登录:', !!currentUser);
    
    // 如果用户未登录，跳转到登录页面
    if (!currentUser) {
        console.log('用户未登录，准备跳转到登录页面');
        alert('请先登录！');
        window.location.href = 'login.html';
        return;
    }
    
    // 尝试解析用户信息，确保格式正确
    console.log('开始解析用户信息');
    try {
        const user = JSON.parse(currentUser);
        console.log('解析后的用户信息:', user);
        
        // 如果用户信息不完整或无效，也跳转到登录页面
        if (!user || !user.id) {
            console.log('用户信息无效，准备跳转到登录页面');
            alert('登录信息无效，请重新登录！');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        } else {
            console.log('用户信息有效，登录拦截通过');
        }
    } catch (e) {
        // 解析失败，说明localStorage中的数据格式有问题
        console.log('用户信息解析失败:', e.message);
        alert('登录信息已损坏，请重新登录！');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
})();
