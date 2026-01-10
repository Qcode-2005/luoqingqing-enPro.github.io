$(document).ready(function() {
    // 模拟用户发布的动态数量（实际项目中从后端获取）
    let dynamicNumber = 5; // 示例：已发5条动态
    $('#dynamicNumber').text(dynamicNumber);

    // 初始状态：隐藏所有编辑相关元素
    let isEditMode = false;
    let selectedAvatar = 'girl.png'; // 默认头像

    // 编辑个人资料按钮点击事件
    $('#editProfileBtn').click(function() {
        if (isEditMode) return;
        
        // 切换到编辑模式
        isEditMode = true;
        
        // 显示修改按钮、输入框、保存按钮、头像选择器
        $('.edit-btn').addClass('visible');
        $('.edit-input').addClass('visible');
        $('.value-text').addClass('hidden');
        $('#saveProfileBtn').addClass('visible');
        $('#avatarSelector').show();
        $(this).hide(); // 隐藏编辑按钮
        
        // 高亮选中当前头像
        $('.avatar-option').removeClass('selected');
        $(`.avatar-option[data-avatar="${selectedAvatar}"]`).addClass('selected');
    });

    // 头像选择事件
    $('.avatar-option').click(function() {
        // 移除其他选中状态
        $('.avatar-option').removeClass('selected');
        // 添加当前选中状态
        $(this).addClass('selected');
        // 更新选中的头像
        selectedAvatar = $(this).data('avatar');
        // 预览头像
        $('#currentAvatar').attr('src', `images/${selectedAvatar}`);
    });

    // 保存修改按钮点击事件
    $('#saveProfileBtn').click(function() {
        if (!isEditMode) return;
        
        // 1. 更新头像
        $('#currentAvatar').attr('src', `images/${selectedAvatar}`);
        
        // 2. 更新个人信息
        $('#usernameText').text($('#usernameInput').val().trim() || '绿色践行者');
        $('#emailText').text($('#emailInput').val().trim() || 'green_life@example.com');
        
        // 处理手机号脱敏显示
        let phoneVal = $('#phoneInput').val().trim();
        if (phoneVal && phoneVal.length === 11) {
            $('#phoneText').text(phoneVal.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
        }
        
        $('#genderText').text($('#genderInput').val());
        $('#birthdayText').text($('#birthdayInput').val() || '1990-01-01');
        $('#cityText').text($('#cityInput').val().trim() || '北京市 朝阳区');

        // 3. 退出编辑模式
        isEditMode = false;
        
        // 隐藏编辑相关元素，恢复只读状态
        $('.edit-btn').removeClass('visible');
        $('.edit-input').removeClass('visible');
        $('.value-text').removeClass('hidden');
        $('#saveProfileBtn').removeClass('visible');
        $('#avatarSelector').hide();
        $('#editProfileBtn').show(); // 显示编辑按钮

        // 提示修改成功
        alert('个人信息修改成功！');
    });

    // 点击修改按钮聚焦对应输入框（可选优化）
    $('.edit-btn').click(function() {
        const $input = $(this).siblings('.edit-input');
        if ($input.length) {
            $input.focus();
        }
    });
});