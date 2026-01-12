$(document).ready(function() {
    // 模拟登录用户信息（实际项目中从后端获取）
    const currentUser = {
        id: 1,
        name: "环保先锋",
        avatar: "环" // 头像显示的文字
    };

    // 模拟其他用户的公开动态（实际项目中从后端获取）
    const otherUserDynamics = [
        {
            id: 1001,
            userId: 2,
            userName: "绿色使者",
            userAvatar: "绿",
            content: "今天骑自行车出行，既环保又健身，推荐大家尝试！",
            images: [],
            createTime: "2026/1/9 10:30:00",
            likeCount: 15,
            isLiked: false,
            privacy: "public"
        },
        {
            id: 1002,
            userId: 3,
            userName: "自然守护者",
            userAvatar: "自",
            content: "在家自制堆肥，把厨余垃圾变成养花的好肥料，超有成就感！",
            images: [],
            createTime: "2026/1/9 09:15:00",
            likeCount: 23,
            isLiked: true,
            privacy: "public"
        }
    ];

    // 存储当前用户的动态数据（实际项目中从后端获取/提交）
    let myDynamicList = [];

    // 当前激活的标签页
    let activeTab = "public";

    // 图片预览功能
    let selectedImages = []; // 存储选中的图片文件
    $('#dynamicImages').on('change', function(e) {
        const files = e.target.files;
        if (!files.length) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;

            // 添加到选中图片数组
            selectedImages.push(file);

            // 创建预览元素
            const reader = new FileReader();
            reader.onload = function(event) {
                const previewItem = `
                    <div class="preview-item" data-index="${selectedImages.length - 1}">
                        <img src="${event.target.result}" alt="预览图片">
                        <span class="remove-img" data-index="${selectedImages.length - 1}">×</span>
                    </div>
                `;
                $('#imagePreview').append(previewItem);
            };
            reader.readAsDataURL(file);
        }

        // 清空input值，允许重复选择相同文件
        $('#dynamicImages').val('');
    });

    // 删除预览图片
    $('#imagePreview').on('click', '.remove-img', function() {
        const index = $(this).data('index');
        // 从数组中移除
        selectedImages.splice(index, 1);
        // 从DOM中移除
        $(this).parent('.preview-item').remove();
        // 更新剩余图片的索引
        $('#imagePreview .preview-item').each(function(i) {
            $(this).data('index', i);
            $(this).find('.remove-img').data('index', i);
        });
    });

    // 发布动态表单提交
    $('#dynamicPostForm').on('submit', function(e) {
        e.preventDefault();
        
        // 获取动态内容
        const content = $('#dynamicContent').val().trim();
        if (!content) {
            alert('请输入动态内容！');
            return;
        }

        // 获取选中的权限
        const privacy = $('input[name="privacy"]:checked').val();

        // 构建动态数据
        const newDynamic = {
            id: Date.now(), // 用时间戳作为临时ID
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            content: content,
            images: selectedImages.map(img => URL.createObjectURL(img)), // 生成临时预览URL
            createTime: new Date().toLocaleString(),
            likeCount: 0,
            isLiked: false,
            privacy: privacy
        };

        // 添加到我的动态列表 - 最新的动态添加到数组开头（保证最新在顶部）
        myDynamicList.unshift(newDynamic); 
        
        // 重新渲染列表
        renderDynamicList();

        // 重置表单和预览
        $('#dynamicContent').val('');
        $('#imagePreview').empty();
        selectedImages = [];
        // 重置权限选择为公开
        $('input[name="privacy"][value="public"]').prop('checked', true);

        alert(`动态发布成功！${privacy === 'public' ? '该动态对所有用户可见' : '该动态仅你自己可见'}`);
    });

    // 切换标签页
    $('.tab-item').on('click', function() {
        // 更新标签页样式
        $('.tab-item').removeClass('active');
        $(this).addClass('active');
        // 更新激活标签
        activeTab = $(this).data('tab');
        // 重新渲染列表
        renderDynamicList();
    });

    // 删除动态功能
    $('#dynamicList').on('click', '.delete-btn', function() {
        const dynamicId = parseInt($(this).data('id'));
        
        // 二次确认删除
        if (!confirm('确定要删除这条动态吗？删除后无法恢复！')) {
            return;
        }

        // 从我的动态列表中删除对应动态
        myDynamicList = myDynamicList.filter(item => item.id !== dynamicId);
        
        // 重新渲染列表
        renderDynamicList();
        
        // 提示删除成功
        alert('动态删除成功！');
    });

    // 渲染动态列表
    function renderDynamicList() {
        const $dynamicList = $('#dynamicList');
        $dynamicList.empty();

        let displayList = [];

        if (activeTab === "public") {
            // 社区公开动态：其他用户的公开动态 + 当前用户的公开动态
            const myPublicDynamics = myDynamicList.filter(item => item.privacy === "public");
            // 合并后排序：最新的在顶部（时间戳大的在前）
            displayList = [...otherUserDynamics, ...myPublicDynamics].sort((a, b) => b.id - a.id);
        } else if (activeTab === "my-all") {
            // 我的所有动态：公开 + 私人（已经是最新在顶部的顺序）
            displayList = [...myDynamicList];
        }

        if (displayList.length === 0) {
            const emptyText = activeTab === "public" 
                ? "暂无社区公开动态，快来发布第一条环保动态吧！" 
                : "你还没有发布任何动态，快来分享你的环保行动吧！";
            $dynamicList.html(`
                <div class="text-center" id="emptyTip">
                    <i class="fa fa-leaf" style="font-size: 48px; color: #4CAF50; margin-bottom: 15px;"></i>
                    <p>${emptyText}</p>
                </div>
            `);
            return;
        }

        // 遍历生成动态项 - 保持最新在顶部的顺序
        displayList.forEach(dynamic => {
            // 判断是否是当前用户的动态
            const isMyDynamic = dynamic.userId === currentUser.id;
            
            // 构建图片HTML
            let imagesHtml = '';
            if (dynamic.images && dynamic.images.length > 0) {
                imagesHtml = '<div class="dynamic-images">';
                dynamic.images.forEach(imgUrl => {
                    imagesHtml += `<img src="${imgUrl}" alt="动态图片">`;
                });
                imagesHtml += '</div>';
            }

            // 构建权限标签
            const privacyTag = dynamic.privacy === "public" 
                ? `<span class="privacy-tag tag-public"><i class="fa fa-globe"></i> 公开</span>` 
                : `<span class="privacy-tag tag-private"><i class="fa fa-lock"></i> 私人</span>`;

            // 构建删除按钮（仅自己的动态显示）
            const deleteBtn = isMyDynamic 
                ? `<div class="delete-btn" data-id="${dynamic.id}"><i class="fa fa-trash-o"></i></div>` 
                : '';

            // 构建动态项HTML
            const dynamicItem = `
                <div class="dynamic-item" data-id="${dynamic.id}">
                    ${deleteBtn}
                    <div class="dynamic-header">
                        <div class="user-avatar">${dynamic.userAvatar}</div>
                        <div class="user-info">
                            <h4>${dynamic.userName} ${privacyTag}</h4>
                            <span class="post-time">${dynamic.createTime}</span>
                        </div>
                    </div>
                    <div class="dynamic-content">${dynamic.content}</div>
                    ${imagesHtml}
                    <div class="dynamic-footer">
                        <div class="like-btn" data-id="${dynamic.id}">
                            <i class="fa ${dynamic.isLiked ? 'fa-heart' : 'fa-heart-o'}"></i> 
                            点赞 (${dynamic.likeCount})
                        </div>
                    </div>
                </div>
            `;

            $dynamicList.append(dynamicItem);
        });
    }

    // 点赞功能
    $('#dynamicList').on('click', '.like-btn', function() {
        const dynamicId = parseInt($(this).data('id'));
        
        // 先检查是否是其他用户的动态
        let dynamic = otherUserDynamics.find(item => item.id === dynamicId);
        if (dynamic) {
            // 处理其他用户动态的点赞
            dynamic.isLiked = !dynamic.isLiked;
            dynamic.likeCount += dynamic.isLiked ? 1 : -1;
        } else {
            // 检查是否是当前用户的动态
            dynamic = myDynamicList.find(item => item.id === dynamicId);
            if (dynamic) {
                dynamic.isLiked = !dynamic.isLiked;
                dynamic.likeCount += dynamic.isLiked ? 1 : -1;
            }
        }
        
        // 重新渲染列表
        renderDynamicList();
    });

    // 初始化渲染
    renderDynamicList();
});