const materialsData = [
        // 第1页
        [
            {
                img: "images/recycle/paper.jpg",
                name: "废纸",
                category: "可回收物-纸类",
                intro: "废纸是指使用过的纸张，包括报纸、办公用纸、纸箱等，不包括受污染的纸巾和卫生纸。废纸回收后可重新制浆生产新纸，节约木材资源。",
                method: "1. 去除纸张中的非纸类杂质；2. 分类打包避免污染；3. 送至造纸厂进行脱墨、制浆；4. 生产再生纸产品。"
            },
            {
                img: "images/recycle/plastic.jpg",
                name: "塑料瓶",
                category: "可回收物-塑料类",
                intro: "PET塑料瓶是最常见的饮料包装，具有质轻、耐用、透明的特点，回收后可加工成纤维、塑料制品等。",
                method: "1. 清空瓶内液体并压扁；2. 去除瓶盖和标签；3. 分类投放至塑料回收箱；4. 回收后破碎、清洗、造粒再利用。"
            },
            {
                img: "images/recycle/glass.jpg",
                name: "玻璃瓶",
                category: "可回收物-玻璃类",
                intro: "玻璃瓶具有高透明度、耐腐蚀的特点，主要用于食品、饮料包装，玻璃可无限次回收利用且质量不下降。",
                method: "1. 清空瓶内残留物并清洗；2. 按颜色分类（白、棕、绿）；3. 避免破碎后划伤；4. 回收后破碎、熔融重制成新玻璃制品。"
            }
        ],
        // 第2页
        [
            {
                img: "images/recycle/metal.jpg",
                name: "易拉罐",
                category: "可回收物-金属类",
                intro: "铝制易拉罐重量轻、易回收，回收1吨铝可节约4吨铝土矿，减少95%的能源消耗。",
                method: "1. 压扁减少体积；2. 去除罐内残留物；3. 分类投放；4. 回炉熔炼制成新铝制品。"
            },
            {
                img: "images/recycle/cloth.jpg",
                name: "旧衣物",
                category: "可回收物-纺织类",
                intro: "废旧衣物包括棉质、化纤、羊毛等各类服装，成色较好的可捐赠，破损的可回收加工成再生纤维。",
                method: "1. 分类整理，区分材质；2. 清洗消毒；3. 成色好的捐赠，破损的破碎加工；4. 制成再生棉、隔音材料等。"
            },
            {
                img: "images/recycle/battery.jpg",
                name: "锂电池",
                category: "有害垃圾-电池类",
                intro: "锂电池广泛应用于手机、电动车等设备，含有钴、锂等重金属，随意丢弃会污染土壤和水源。",
                method: "1. 单独存放避免短路；2. 送至专门的电池回收点；3. 专业拆解提取有价金属；4. 无害化处理废旧电解液。"
            }
        ],
        // 第3-8页（简化模拟，结构同上）
        [/* 第3页数据 */], [/* 第4页数据 */], [/* 第5页数据 */],
        [/* 第6页数据 */], [/* 第7页数据 */], [/* 第8页数据 */]
    ];
    
    // 补充分页数据（模拟8页内容）
    for(let i=2; i<8; i++) {
        materialsData[i] = [
            {
                img: `images/recycle/material${i+1}-1.jpg`,
                name: `回收材料${i+1}-1`,
                category: "可回收物",
                intro: `这是第${i+1}页的第一个材料介绍，详细说明该材料的特性和应用场景。`,
                method: `这是第${i+1}页的第一个材料回收方法，包含具体的操作步骤和注意事项。`
            },
            {
                img: `images/recycle/material${i+1}-2.jpg`,
                name: `回收材料${i+1}-2`,
                category: "可回收物",
                intro: `这是第${i+1}页的第二个材料介绍，详细说明该材料的特性和应用场景。`,
                method: `这是第${i+1}页的第二个材料回收方法，包含具体的操作步骤和注意事项。`
            },
            {
                img: `images/recycle/material${i+1}-3.jpg`,
                name: `回收材料${i+1}-3`,
                category: "可回收物",
                intro: `这是第${i+1}页的第三个材料介绍，详细说明该材料的特性和应用场景。`,
                method: `这是第${i+1}页的第三个材料回收方法，包含具体的操作步骤和注意事项。`
            }
        ];
    }

    // 当前页码
    let currentPage = 1;
    const maxPage = 8;

    // ===================== 板块切换功能 =====================
    $(document).ready(function() {
        // 1. 板块切换
        $('.recycle-tab-btn').click(function() {
            // 移除所有激活状态
            $('.recycle-tab-btn').removeClass('active');
            $('.recycle-tab-panel').removeClass('active');
            
            // 添加当前激活状态
            $(this).addClass('active');
            const target = $(this).data('target');
            $(`#${target}-panel`).addClass('active');
            
            // 如果切换到回收利用板块，初始化第一页
            if(target === 'recycle-utilize') {
                renderMaterials(1);
            }
        });

        // 2. 初始化回收利用板块第一页
        renderMaterials(1);

        // 3. 分页控制
        // 上一页
        $('#prev-page').click(function() {
            if(currentPage > 1) {
                currentPage--;
                renderMaterials(currentPage);
                updatePaginationUI();
            }
        });

        // 下一页
        $('#next-page').click(function() {
            if(currentPage < maxPage) {
                currentPage++;
                renderMaterials(currentPage);
                updatePaginationUI();
            }
        });

        // 跳转页码
        $('#go-page').click(function() {
            const pageNum = parseInt($('#page-input').val());
            if(isNaN(pageNum) || pageNum < 1 || pageNum > maxPage) {
                alert(`请输入1-${maxPage}之间的有效页码`);
                $('#page-input').val(currentPage);
                return;
            }
            currentPage = pageNum;
            renderMaterials(currentPage);
            updatePaginationUI();
        });


        // 4. AI图片识别功能
        // 点击上传区域
        $('#upload-area').click(function() {
            $('#upload-input').click();
        });

        // 选择图片后显示按钮
        $('#upload-input').change(function(e) {
            const file = e.target.files[0];
            if(file) {
                $('#recognize-btn').show();
                alert(`已选择图片：${file.name}，点击"开始AI识别"按钮进行分析`);
            }
        });

        // AI识别按钮点击
        $('#recognize-btn').click(function() {
            // 模拟AI识别过程
            $(this).text('识别中...').prop('disabled', true);
            
            setTimeout(() => {
                // 模拟识别结果
                $('#waste-type').text('塑料饮料瓶（可回收物）');
                $('#waste-desc').text('PET塑料瓶属于可回收物，主要用于饮料包装，回收后可加工成再生纤维、塑料容器等产品。');
                $('#recycle-scheme').text('1. 清空瓶内剩余液体并压扁；2. 去除瓶盖和标签（瓶盖为其他塑料，需单独分类）；3. 投放至蓝色可回收物垃圾桶；4. 专业回收后经破碎、清洗、造粒，可制成纺织纤维、塑料板材等再生产品。');
                
                // 显示结果
                $('#recognition-result').show();
                $(this).text('开始AI识别').prop('disabled', false);
            }, 2000);
        });

        // 5. AI聊天功能（简化版）
        $('#send-btn').click(function() {
            sendChatMessage();
        });

        $('#chat-input').keypress(function(e) {
            if(e.which === 13) {
                sendChatMessage();
            }
        });

        // 快速提问按钮
        $('.quick-question').click(function() {
            const question = $(this).text().replace(/^.*?\]/, '').trim();
            $('#chat-input').val(question);
            sendChatMessage();
        });
    });

    // ===================== 核心函数 =====================
    // 渲染回收材料列表
    function renderMaterials(pageNum) {
        const materials = materialsData[pageNum - 1];
        let html = '';
        
        materials.forEach(item => {
            html += `
                <div class="material-card">
                    <img src="${item.img}" alt="${item.name}" class="material-img">
                    <div class="material-info">
                        <h4>${item.name}</h4>
                        <span class="material-category">${item.category}</span>
                        <p><strong>材料介绍：</strong>${item.intro}</p>
                        <p><strong>回收方法：</strong>${item.method}</p>
                    </div>
                </div>
            `;
        });
        
        $('#materials-list').html(html);
        $('#current-page').text(pageNum);
        $('#page-input').val(pageNum);
    }

    // 更新分页UI状态
    function updatePaginationUI() {
        // 上一页按钮
        if(currentPage === 1) {
            $('#prev-page').prop('disabled', true);
        } else {
            $('#prev-page').prop('disabled', false);
        }
        
        // 下一页按钮
        if(currentPage === maxPage) {
            $('#next-page').prop('disabled', true);
        } else {
            $('#next-page').prop('disabled', false);
        }
    }

    // 发送聊天消息
    function sendChatMessage() {
        const message = $('#chat-input').val().trim();
        if(!message) return;
        
        // 添加用户消息
        $('#chat-window').append(`
            <div style="margin-bottom: 10px; text-align: right;">
                <div style="display: inline-block; background: #28a745; color: white; padding: 8px 12px; border-radius: 15px; max-width: 80%;">
                    ${message}
                </div>
            </div>
        `);
        
        // 清空输入框
        $('#chat-input').val('');
        
        // 滚动到底部
        $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
        
        // 模拟AI回复
        setTimeout(() => {
            let reply = "非常感谢你的提问！作为豆包AI环保助手，我会为你提供专业的环保解答。具体的回答需要根据你的问题进行定制，建议你参考相关环保指南或联系专业机构获取更详细的信息。";
            
            // 根据问题关键词定制回复
            if(message.includes('垃圾分类')) {
                reply = "垃圾分类主要分为可回收物、厨余垃圾、有害垃圾和其他垃圾四大类。可回收物包括纸类、塑料、玻璃、金属、织物等；厨余垃圾主要是易腐烂的有机垃圾；有害垃圾包含电池、灯管、过期药品等；其他垃圾是难以回收的废弃物。";
            } else if(message.includes('节能')) {
                reply = "家庭节能小技巧：1. 使用节能电器，及时关闭不用的电器；2. 调整空调温度（夏季26℃，冬季20℃）；3. 使用LED灯具替代传统白炽灯；4. 一水多用，节约用水；5. 减少待机能耗，拔掉不用的插头。";
            } else if(message.includes('低碳出行')) {
                reply = "低碳出行推荐方式：1. 短途优先选择步行或自行车；2. 中长途选择公共交通（公交、地铁）；3. 自驾优先选择新能源汽车或拼车；4. 减少不必要的出行，利用线上办公。";
            }
            
            // 添加AI回复
            $('#chat-window').append(`
                <div style="margin-bottom: 10px; text-align: left;">
                    <div style="display: inline-block; background: #f1f1f1; padding: 8px 12px; border-radius: 15px; max-width: 80%;">
                        ${reply}
                    </div>
                </div>
            `);
            
            // 滚动到底部
            $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
        }, 1000);
    }