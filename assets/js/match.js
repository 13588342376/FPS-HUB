// ⚡ 跨文件读取全局游戏库数据，动态初始化“主攻战场”下拉菜单
function initializeTargetGames() {
    const targetGameSelect = document.getElementById("targetGame");
    const globalGames = window.GAMES_DATABASE || (typeof GAMES_DATABASE !== 'undefined' ? GAMES_DATABASE : null);
    
    if (targetGameSelect && globalGames && Array.isArray(globalGames)) {
        targetGameSelect.innerHTML = ""; // 先清空
        
        globalGames.forEach(game => {
            const option = document.createElement("option");
            option.value = game.name;       
            option.textContent = game.name; 
            targetGameSelect.appendChild(option);
        });
        console.log("✅ 【战术联动成功】已成功载入 " + globalGames.length + " 款战场！");
    } else {
        console.warn("⏳ 正在等待底层军械库 GAMES_DATABASE 初始化...");
    }
}

// 页面加载完毕后立即触发
document.addEventListener("DOMContentLoaded", () => {
    initializeTargetGames();
    
    // 🛡️ 稳固双保险：万一数据文件加载有微秒级延迟，0.1秒后保底重新校验注入一次
    setTimeout(initializeTargetGames, 100); 
});

// ==========================================
// 👾 下面是你原本的 highLevelPlayersPool 和匹配控制逻辑（保持不变）
// ==========================================
// 👾 演示专用：顶级高玩拍档数据库
const highLevelPlayersPool = [
    { id: "Shroud_vibe#9911", avatar: "🥷", winRate: "74.8%" },
    { id: "ZywOo_Like#cs2", avatar: "👑", winRate: "81.2%" },
    { id: "Tenz_Frame#val", avatar: "🐱", winRate: "79.5%" },
    { id: "ImperialHal_CEO#112", avatar: "🦅", winRate: "68.9%" },
    { id: "KenNyS_Flip#001", avatar: "🎯", winRate: "72.1%" },
    { id: "Niko_OneTap#cs", avatar: "🔥", winRate: "76.4%" },
    { id: "Asuna_Weep#666", avatar: "🦊", winRate: "70.3%" }
];

// 滚动状态文字，增加演示说服力
const statusPhases = [
    "正在链接战术卫星...",
    "正在拦截战网协议...",
    "检测匹配特征向量...",
    "交叉比对特工权重...",
    "算法对齐，正在锁定拍档..."
];

document.addEventListener("DOMContentLoaded", () => {
    const matchForm = document.getElementById("matchForm");
    const matchOverlay = document.getElementById("matchOverlay");
    const resultModal = document.getElementById("resultModal");
    const progressBarFill = document.getElementById("progressBarFill");
    const loadingStatusText = document.getElementById("loadingStatusText");
    const closeResultBtn = document.getElementById("closeResultBtn");

    if (!matchForm) return;

    // 🎯 修改前：matchForm.addEventListener("submit", () => {
    // 🎯 修改后：传入事件参数 e，强行拦截表单的自带刷新魔咒！
    matchForm.addEventListener("submit", (e) => {
        e.preventDefault(); // 🛑 核心：这行代码能阻止网页自动刷新，让转圈加载和匹配结果完美呈现！

        const pId = document.getElementById("playerGameId").value.trim();
        // 注意：下面这行原本是 .value，为了防止拿空，我们加个兜底
        const selectedGame = document.getElementById("targetGame").value || "未知战场";
        const selectedTag = document.querySelector('input[name="playerTag"]:checked').value;

        if (!pId) return;

        // 🎲 核心机制：生成 0 ~ 3 秒的随机转圈时间
        const totalDuration = Math.random() * 3000; 
        
        // 唤醒全屏雷达遮罩
        matchOverlay.classList.add("active");
        progressBarFill.style.width = "0%";
        
        let startTime = Date.now();
        
        // 1. 进度条与状态文案随动画定时器滚动
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / totalDuration) * 100, 100);
            progressBarFill.style.width = `${percentage}%`;

            const phaseIndex = Math.min(Math.floor((percentage / 100) * statusPhases.length), statusPhases.length - 1);
            loadingStatusText.textContent = statusPhases[phaseIndex];

            if (elapsed >= totalDuration) {
                clearInterval(progressInterval);
                executeMatchSuccess(selectedGame, selectedTag);
            }

            // 取消匹配按钮：点击后中止计时并关闭遮罩
            document.getElementById("cancelMatchBtn").addEventListener("click", function cancelMatch() {
                clearInterval(progressInterval);
                matchOverlay.classList.remove("active");
                matchForm.reset();
            }, { once: true });
        }, 50);
    });

    // 2. 匹配终止，渲染成功弹窗
    function executeMatchSuccess(game, tag) {
        // 关闭加载圈
        matchOverlay.classList.remove("active");

        // 从高玩池里随机捞一个人出来
        const luckyTeammate = highLevelPlayersPool[Math.floor(Math.random() * highLevelPlayersPool.length)];

        // 把计算出来的随机数塞进弹窗对应的壳子里
        document.getElementById("resId").textContent = luckyTeammate.id;
        document.getElementById("resAvatar").textContent = luckyTeammate.avatar;
        document.getElementById("resGame").textContent = game;
        document.getElementById("resTag").textContent = `⚡ 顶级 ${tag}`;
                const simulatedWinRate = (Math.random() * 30 + 45).toFixed(1);
        document.getElementById("resWinRate").textContent = simulatedWinRate + "%";

        // 唤醒精致弹窗
        resultModal.classList.add("active");
    }

    // 3. 关闭弹窗
    closeResultBtn.addEventListener("click", () => {
        resultModal.classList.remove("active");
        matchForm.reset();
        // 跳转到首页触发登录流程
        window.location.href = "index.html?action=login";
    });
});