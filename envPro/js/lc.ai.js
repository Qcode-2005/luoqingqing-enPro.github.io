$(document).ready(function() {
    // 豆包AI（火山方舟）配置
    const DOUBAO_CONFIG = {
        API_KEY: "ff4c00ef-cc9a-4a40-93ed-56c096b274b4", // 你的火山方舟API Key
        API_URL: "https://ark.cn-beijing.volces.com/api/v3/chat/completions", // 火山方舟接口地址
        MODEL: "ep-20260108163133-mvpf8", // 你的火山方舟模型ID
        TEMPERATURE: 0.7,
        MAX_TOKENS: 500,
        // 定制化系统提示词（针对低碳出行规划）
        SYSTEM_PROMPT: `你是一个专业的低碳出行规划AI助手，需要完成以下任务：
1. 接收用户提供的起点和终点，首先分析合理的路线距离（单位：公里，保留1位小数）
2. 根据距离推荐最优的低碳出行方式（步行/自行车/地铁/公交/电动汽车/高铁等）
3. 计算该出行方式的碳排放量（单位：克CO₂）
4. 计算相比传统燃油车（220g CO₂/公里）的减排量
5. 给出简洁实用的出行建议（控制在150字以内）
6. 输出格式必须是JSON字符串，包含字段：distance(距离)、transportType(出行方式)、carbonEmission(碳排放量)、reduction(减排量)、suggestion(出行建议)`,
        TIMEOUT: 20000 // 20秒超时
    };

    // 初始化仅图片的轮播
    $("#featured-work-slider").owlCarousel({
        items: 3,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [979, 2],
        itemsTablet: [768, 1],
        autoPlay: 5000,
        stopOnHover: true,
        pagination: true
    });

    // AI路线规划表单提交事件
    $("#aiRouteForm").submit(async function(e) {
        e.preventDefault();

        // 获取输入值
        const startPoint = $("#startPoint").val().trim();
        const endPoint = $("#endPoint").val().trim();

        // 验证输入
        if (!startPoint || !endPoint) {
            alert("请输入完整的起点和终点信息！");
            return;
        }

        // 显示加载状态，隐藏结果，禁用按钮
        $("#loading").show();
        $("#aiResultCard").hide();
        $("#calculateBtn").prop("disabled", true);

        try {
            // 调用真实的豆包AI接口获取规划结果
            const aiResult = await callDouBaoAI(startPoint, endPoint);

            // 更新结果显示
            $("#resultStartPoint").text(startPoint);
            $("#resultEndPoint").text(endPoint);
            $("#resultDistance").text(aiResult.distance);
            $("#resultTransport").text(aiResult.transportType);
            $("#resultCarbon").text(aiResult.carbonEmission);
            $("#resultReduction").text(aiResult.reduction);
            $("#aiSuggestion").html(aiResult.suggestion.replace(/\n/g, '<br>'));

            // 显示结果，隐藏加载
            $("#loading").hide();
            $("#aiResultCard").fadeIn();

        } catch (error) {
            // 错误处理
            $("#loading").hide();
            alert("AI规划出错：" + error.message);
            console.error("AI接口调用错误：", error);
        } finally {
            // 重新启用按钮
            $("#calculateBtn").prop("disabled", false);
        }
    });

    /**
     * 调用豆包AI（火山方舟）API获取低碳出行规划
     * @param {string} start - 起点
     * @param {string} end - 终点
     * @returns {object} AI规划结果
     */
    async function callDouBaoAI(start, end) {
        // 构建用户提示词
        const userPrompt = `请为我规划从${start}到${end}的低碳出行方案，严格按照要求输出JSON格式结果，不要添加任何额外说明文字。`;

        // 构建请求体
        const requestBody = {
            model: DOUBAO_CONFIG.MODEL,
            messages: [
                {
                    role: "system",
                    content: DOUBAO_CONFIG.SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            temperature: DOUBAO_CONFIG.TEMPERATURE,
            max_tokens: DOUBAO_CONFIG.MAX_TOKENS,
            stream: false // 非流式输出
        };

        try {
            // 发送API请求
            const response = await fetch(DOUBAO_CONFIG.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DOUBAO_CONFIG.API_KEY}` // 火山方舟认证方式
                },
                body: JSON.stringify(requestBody),
                timeout: DOUBAO_CONFIG.TIMEOUT
            });

            // 检查响应状态
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API请求失败 [${response.status}]：${errorData.error?.message || '未知错误'}`);
            }

            // 解析响应数据
            const data = await response.json();

            // 提取AI回复内容
            const aiResponse = data.choices?.[0]?.message?.content;
            if (!aiResponse) {
                throw new Error("AI返回内容为空");
            }

            // 解析JSON格式的回复
            let result;
            try {
                // 清理可能的多余字符（如markdown格式、说明文字）
                const cleanResponse = aiResponse.replace(/```json|```/g, '').trim();
                result = JSON.parse(cleanResponse);
            } catch (parseError) {
                throw new Error(`AI返回格式错误：${parseError.message}，原始回复：${aiResponse}`);
            }

            // 验证必要字段
            const requiredFields = ['distance', 'transportType', 'carbonEmission', 'reduction', 'suggestion'];
            const missingFields = requiredFields.filter(field => !result[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`AI返回缺少必要字段：${missingFields.join(', ')}`);
            }

            return result;

        } catch (error) {
            // 网络/接口错误处理
            if (error.name === "AbortError") {
                throw new Error("请求超时，请稍后重试");
            }
            throw new Error(error.message);
        }
    }
});