$(document).ready(function() {
    // ===================== 左侧图片自动切换逻辑（保留不变） =====================
    const imageSet = [
        'images/slider/1.jpg',
        'images/slider/2.jpg',
        'images/slider/3.jpg',
        'images/slider/4.jpg',
        'images/slider/5.jpg',
        'images/slider/6.jpg',
        'images/slider/7.jpg'
    ];
    let currentImageIndex = 0;
    const bgContainer = $('#bgImageContainer');
    const autoSwitchInterval = 5000;
    let autoSwitchTimer;

    function switchToImage(index) {
        currentImageIndex = index;
        bgContainer.css({
            'background-image': `url(${imageSet[currentImageIndex]})`,
            'background-size': 'cover',
            'background-position': 'center'
        });
        console.log(`当前显示第 ${currentImageIndex + 1} 张图：${imageSet[currentImageIndex]}`);
    }

    function autoSwitchNextImage() {
        const nextIndex = (currentImageIndex + 1) % imageSet.length;
        switchToImage(nextIndex);
    }

    function startAutoSwitch() {
        stopAutoSwitch();
        autoSwitchTimer = setInterval(autoSwitchNextImage, autoSwitchInterval);
    }

    function stopAutoSwitch() {
        if (autoSwitchTimer) {
            clearInterval(autoSwitchTimer);
            autoSwitchTimer = null;
        }
    }

    switchToImage(currentImageIndex);
    startAutoSwitch();

    // ===================== 标签切换核心逻辑（保留不变） =====================
    $('.tab-menu a').on('click', function(e) {
        e.preventDefault();
        var tab = $(this).attr('data-tab');
        $('.tab-menu li').removeClass('active');
        $('.tab-content-inner').removeClass('active');
        $(this).parent('li').addClass('active');
        $('.tab-content-inner[data-content="' + tab + '"]').addClass('active');
    });

    // ===================== 找回密码按钮逻辑（保留不变） =====================
    $('.find-pwd-btn').on('click', function() {
        $('.tab-menu li:has(a[data-tab="refind"])').show();
        $('.tab-menu a[data-tab="refind"]').trigger('click');
    });

    // ===================== 手机号验证工具函数（保留不变） =====================
    function validatePhone(phone) {
        const phoneReg = /^1\d{10}$/;
        return phoneReg.test(phone);
    }

    // ===================== 注册表单逻辑（修改接口适配） =====================
    let signupCountdown = 60;
    let signupTimer = null;
    let signupCode = '';

    // 【修改1】注册提交：适配后端返回格式（code/msg 而非 success/message）+ 修正端口
    $('#signupForm').on('submit', async function(e) { 
        e.preventDefault();
        const username = $('#signup-username').val().trim();
        const phone = $('#signup-phone').val().trim();
        const email = $('#signup-email').val().trim();
        const pwd = $('#signup-password').val().trim();
        const pwd2 = $('#signup-password2').val().trim();

        // 前端校验（保留原有逻辑）
        if (!username) { alert('请填写用户名！'); return; }
        if (!phone) { alert('请填写手机号！'); return; }
        if (!validatePhone(phone)) {
            alert('请输入有效的11位手机号！'); return;
            $('#signup-phone').focus();
            return;
        }
        if (!email) { alert('请填写邮箱！'); return; }
        const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailReg.test(email)) { alert('邮箱格式错误！'); return; }
        if (!pwd) { alert('请填写密码！'); return; }
        if (pwd !== pwd2) { alert('两次密码不一致！'); return; }


        try {
            // 根据当前环境自动切换API地址
            const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:3001/api/user/register' 
                : '/api/user/register';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username,
                    password: pwd, // 后端接收的参数名是password，不是pwd
                    phone: phone,
                    email: email
                })
            });

            // 【关键】适配后端返回格式（code/msg）
            const result = await response.json();
            if (result.code === 200) { // 后端成功返回code=200
                alert(`注册成功！用户名：${username}，手机号：${phone}`);
                $('.tab-menu a[data-tab="login"]').trigger('click');
                $(this)[0].reset();
            } else { // 后端失败返回错误信息
                alert('注册失败：' + result.msg);
            }
        } catch (error) {
            console.error('注册请求失败详细信息：', error);
            console.error('注册请求错误对象：', JSON.stringify(error, null, 2));
            let errorMsg = '注册失败！';
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                errorMsg += '网络请求失败，请检查后端服务是否正常运行';
            } else if (error.message.includes('404')) {
                errorMsg += '接口地址错误，请检查后端接口路径';
            } else if (error.message.includes('CORS')) {
                errorMsg += '跨域问题，请确认后端已配置cors';
            } else if (error.message.includes('500')) {
                errorMsg += '后端服务内部错误，请查看服务器日志';
            } else {
                errorMsg += '错误原因：' + error.message;
            }
            alert(errorMsg);
        }
    });

    // ===================== 登录表单逻辑（修改接口适配） =====================
    // 【修改2】登录提交：适配后端返回格式 + 修正端口
    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();
        const username = $('#login-username').val().trim();
        const pwd = $('#login-password').val().trim();

        if (!username || !pwd) {
            alert('请填写用户名和密码！'); return;
            return;
        }


        try {
            // 根据当前环境自动切换API地址
            const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:3001/api/user/login' 
                : '/api/user/login';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: pwd // 后端接收的参数名是password，不是pwd
                })
            });

            // 【关键】适配后端返回格式（code/msg/data）
            const result = await response.json();
            if (result.code === 200) { // 后端成功返回code=200
                alert('登录成功！即将跳转到首页');
                // 保存登录状态到localStorage
                localStorage.setItem('userInfo', JSON.stringify({
                    username: username,
                    isLoggedIn: true
                }));
                window.location.href = 'index.html';
            } else { // 后端失败返回错误信息
                alert('登录失败：' + result.msg);
                $('#login-password').val('');
            }
        } catch (error) {
            console.error('登录请求失败详细信息：', error);
            console.error('登录请求错误对象：', JSON.stringify(error, null, 2));
            let errorMsg = '登录失败！';
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                errorMsg += '网络请求失败，请检查后端服务是否正常运行';
            } else if (error.message.includes('404')) {
                errorMsg += '接口地址错误，请检查后端接口路径';
            } else if (error.message.includes('CORS')) {
                errorMsg += '跨域问题，请确认后端已配置cors';
            } else if (error.message.includes('500')) {
                errorMsg += '后端服务内部错误，请查看服务器日志';
            } else {
                errorMsg += '错误原因：' + error.message;
            }
            alert(errorMsg);
        }
    });

    // ===================== 找回密码表单逻辑（保留不变） =====================
    $('#refindForm').on('submit', function(e) {
        e.preventDefault();
        const username = $('#refind-username').val();
        const email = $('#refind-email').val();
        const code = $('#refind-captcha').val();

        if (!code) { alert('请填写验证码！'); return; }
        if (code !== '8888') {
            alert('验证码错误（测试专用：8888）！');
            $('#refind-captcha').val('');
            return;
        }

        alert(`admin用户密码找回成功！新密码已发送至邮箱${email}（测试提示：新密码为admin888）`);
        $('.tab-menu a[data-tab="login"]').trigger('click');
        $(this)[0].reset();
    });
});