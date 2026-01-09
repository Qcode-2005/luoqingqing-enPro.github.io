$(document).ready(function() {
        // ========== 新增：导航栏滑动添加白色背景 ==========
        $(window).scroll(function() {
            // 当滚动距离超过50px时添加白色背景类
            if ($(this).scrollTop() > 50) {
                $('.clean-main-menu').addClass('scrolled');
            } else {
                $('.clean-main-menu').removeClass('scrolled');
            }
        });

        // 初始化轮播
        $("#featured-work-slider").owlCarousel({
            items: 3,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [979, 2],
            itemsTablet: [768, 1],
            autoPlay: 5000,
            stopOnHover: true,
            pagination: true
        });

        // ========== 1. 左侧按钮切换功能 ==========
        $(".calc-btn").click(function() {
            // 切换按钮激活状态
            $(".calc-btn").removeClass("active");
            $(this).addClass("active");
            
            // 获取目标面板ID
            const target = $(this).attr("data-target");
            
            // 隐藏所有面板，显示目标面板
            $(".calc-panel").removeClass("active").hide();
            $("#" + target + "-panel").addClass("active").show();
        });

        // ========== 2. 动态生成出行方式选择框（1-5个，含公里数输入） ==========
        $("#transportCount").change(function() {
            const count = parseInt($(this).val());
            const container = $("#transportItemsContainer");
            
            // 清空容器
            container.empty();
            
            // 生成对应数量的出行方式选择框（含公里数输入）
            for (let i = 1; i <= count; i++) {
                const transportItem = `
                    <div class="transport-item">
                        <label>方式${i}：</label>
                        <select class="transport-select" name="transportTypes" required>
                            <option value="">请选择出行方式</option>
                            <option value="walk" data-coeff="0">步行 (0 g/公里)</option>
                            <option value="bike" data-coeff="0">自行车/电动车 (0 g/公里)</option>
                            <option value="bus" data-coeff="28">公交 (28 g/公里)</option>
                            <option value="subway" data-coeff="14">地铁 (14 g/公里)</option>
                            <option value="car" data-coeff="220">私家车（燃油） (220 g/公里)</option>
                            <option value="ev" data-coeff="100">私家车（电动） (100 g/公里)</option>
                            <option value="carpool" data-coeff="50">拼车出行 (50 g/公里)</option>
                        </select>
                        <input type="number" class="distance-input" name="distance" min="0" step="0.1" placeholder="出行公里数" required>
                        <span class="carbon-label">碳排放：0 g</span>
                    </div>
                `;
                container.append(transportItem);
            }
            
            // 绑定出行方式选择事件（实时计算单项碳排放）
            bindTransportChangeEvent();
        });

        // 初始化绑定第一个出行方式的change事件
        bindTransportChangeEvent();

        // ========== 3. 绑定出行方式选择事件（实时计算单项碳排放） ==========
        function bindTransportChangeEvent() {
            $(".transport-select").change(function() {
                // 获取当前项的碳排放系数和公里数
                const coeff = parseFloat($(this).find("option:selected").attr("data-coeff")) || 0;
                const distance = parseFloat($(this).siblings(".distance-input").val()) || 0;
                const carbon = (coeff * distance).toFixed(1);
                
                // 更新单项碳排放显示
                $(this).siblings(".carbon-label").text(`碳排放：${carbon} g`);
            });
            
            // 公里数输入变化时也更新碳排放
            $(".distance-input").on("input", function() {
                const coeff = parseFloat($(this).siblings(".transport-select").find("option:selected").attr("data-coeff")) || 0;
                const distance = parseFloat($(this).val()) || 0;
                const carbon = (coeff * distance).toFixed(1);
                
                $(this).siblings(".carbon-label").text(`碳排放：${carbon} g`);
            });
        }

        // ========== 4. 碳足迹计算表单提交 ==========
        $("#carbonFootprintForm").submit(function(e) {
            e.preventDefault();
            
            // 获取选中的出行方式个数
            const count = parseInt($("#transportCount").val());
            
            // 存储各方式的计算结果
            const transportResults = [];
            let totalCarbon = 0;
            
            // 验证并计算每个出行方式的碳排放
            let isValid = true;
            $(".transport-item").each(function(index) {
                const transportSelect = $(this).find(".transport-select");
                const distanceInput = $(this).find(".distance-input");
                
                const transportType = transportSelect.val();
                const distance = parseFloat(distanceInput.val()) || 0;
                const coeff = parseFloat(transportSelect.find("option:selected").attr("data-coeff")) || 0;
                
                // 验证
                if (!transportType) {
                    alert(`请选择第${index + 1}个出行方式！`);
                    isValid = false;
                    return false;
                }
                
                if (distance <= 0) {
                    alert(`请输入第${index + 1}个出行方式的有效公里数（大于0）！`);
                    isValid = false;
                    return false;
                }
                
                // 计算单项碳排放
                const carbon = coeff * distance;
                totalCarbon += carbon;
                
                // 存储结果
                const transportNames = {
                    walk: "步行",
                    bike: "自行车/电动车",
                    bus: "公交",
                    subway: "地铁",
                    car: "私家车（燃油）",
                    ev: "私家车（电动）",
                    carpool: "拼车出行"
                };
                
                transportResults.push({
                    name: transportNames[transportType],
                    distance: distance,
                    coeff: coeff,
                    carbon: carbon
                });
            });
            
            // 验证不通过则返回
            if (!isValid) return;
            
            // 生成结果明细HTML
            let detailsHtml = "";
            transportResults.forEach((item, index) => {
                detailsHtml += `
                    <div class="result-item">
                        <strong>方式${index + 1} (${item.name})：</strong> 
                        ${item.distance} 公里 × ${item.coeff} g/公里 = ${item.carbon.toFixed(1)} g CO₂
                    </div>
                `;
            });
            
            // 更新结果显示
            $("#footprintDetails").html(detailsHtml);
            $("#totalCarbon").text(totalCarbon.toFixed(1));
            
            // 生成减碳建议
            $("#footprintSuggestion").text(generateCarbonReductionSuggestion(transportResults, totalCarbon));
            
            // 显示结果卡片
            $("#footprintResultCard").fadeIn();
        });

        // ========== 5. AI出行规划表单提交（模拟数据，可替换为真实API调用） ==========
        $("#aiRouteForm").submit(function(e) {
            e.preventDefault();
            
            // 获取输入值
            const startPoint = $("#startPoint").val().trim();
            const endPoint = $("#endPoint").val().trim();
            
            // 验证输入
            if (!startPoint || !endPoint) {
                alert("请输入完整的起点和终点信息！");
                return;
            }
            
            // 显示加载状态
            $("#loading").show();
            $("#aiResultCard").hide();
            
            // 模拟AI计算（实际项目中替换为真实API调用）
            setTimeout(function() {
                // 模拟返回数据
                const mockResult = {
                    distance: (Math.random() * 50 + 5).toFixed(1) + " 公里",
                    transportType: "地铁 + 共享单车",
                    carbonEmission: (Math.random() * 500 + 100).toFixed(1) + " 克 CO₂",
                    reduction: (Math.random() * 80 + 10).toFixed(1) + "%",
                    suggestion: "推荐您乘坐地铁+共享单车的组合出行方式，该路线总距离约15.2公里，相比纯燃油车出行可减少78.5%的碳排放。短途建议优先选择非机动车出行，既环保又能锻炼身体。"
                };
                
                // 更新结果显示
                $("#resultStartPoint").text(startPoint);
                $("#resultEndPoint").text(endPoint);
                $("#resultDistance").text(mockResult.distance);
                $("#resultTransport").text(mockResult.transportType);
                $("#resultCarbon").text(mockResult.carbonEmission);
                $("#resultReduction").text(mockResult.reduction);
                $("#aiSuggestion").text(mockResult.suggestion);
                
                // 隐藏加载，显示结果
                $("#loading").hide();
                $("#aiResultCard").fadeIn();
            }, 1500);
        });

        /**
         * 生成减碳建议
         */
        function generateCarbonReductionSuggestion(results, totalCarbon) {
            let suggestions = [];
            
            // 识别高碳排放方式
            const highCarbonTypes = results.filter(item => item.coeff >= 100); // 燃油车、电动车
            if (highCarbonTypes.length > 0) {
                suggestions.push(`您选择了${highCarbonTypes.length}种高碳排放出行方式（如燃油车/电动车），建议替换为公交/地铁，可减少约60-80%碳排放`);
            }
            
            // 识别中碳排放方式
            const midCarbonTypes = results.filter(item => item.coeff > 0 && item.coeff < 100); // 公交、地铁、拼车
            if (midCarbonTypes.length > 0 && results.filter(item => item.coeff === 0).length === 0) {
                suggestions.push("短途出行可增加步行/自行车方式，进一步降低碳排放");
            }
            
            // 总体碳排放评估
            if (totalCarbon > 1000) {
                suggestions.push(`您的总碳排放量(${totalCarbon.toFixed(1)}g)偏高，建议优化出行方式组合`);
            } else if (totalCarbon > 200) {
                suggestions.push(`您的总碳排放量(${totalCarbon.toFixed(1)}g)适中，可通过拼车等方式进一步降低`);
            } else {
                suggestions.push(`您的总碳排放量(${totalCarbon.toFixed(1)}g)较低，继续保持绿色出行习惯！`);
            }
            
            return suggestions.join("；");
        }
    });