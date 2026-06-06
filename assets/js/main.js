// main.js - FPS Hub 交互控制中心 (全页面安全兼容修复版)

// ========================================================
// 🟢🔴 状态渲染器（全智能识别代号版 - 严防死守安全判定）
// ========================================================
function renderUserStatusWidget() {
    const avatarEl = document.getElementById('widgetAvatar');
    const usernameEl = document.getElementById('widgetUsername');
    const dotEl = document.getElementById('widgetDot');
    
    // 🛡️ 事前判断：如果当前页面根本没有这个挂件，直接退出，绝不报错
    if (!avatarEl || !usernameEl || !dotEl) return;

    const isLogged = sessionStorage.getItem('isLoggedIn') === 'true';

    if (isLogged) {
        // 🌟 优先获取注册时输入的自定义 ID，如果没有则用特工 V 兜底
        const savedName = sessionStorage.getItem('customUsername') || "特工 V";
        
        avatarEl.innerText = "🐱";
        usernameEl.innerText = savedName; // 动态变成玩家自己的名字！
        usernameEl.style.color = "#fff";
        dotEl.style.backgroundColor = "#2ecc71";
        dotEl.style.boxShadow = "0 0 8px #2ecc71";
    } else {
        avatarEl.innerText = "🐢";
        usernameEl.innerText = "未登录";
        usernameEl.style.color = "#888";
        dotEl.style.backgroundColor = "#ff4b2b";
        dotEl.style.boxShadow = "0 0 8px #ff4b2b";
    }
}

// ========================================================
// 🔄 战术联动：点击用户状态组件（全局通用版）
// ========================================================
function initWidgetClickEvent() {
    const widget = document.getElementById('userStatusWidget');
    if (!widget) return;

    // 指针悬停变成小手
    widget.style.cursor = 'pointer';

    widget.addEventListener('click', () => {
        const isLogged = sessionStorage.getItem('isLoggedIn') === 'true';

        if (isLogged) {
            const confirmLogout = confirm("🚪 报告长官，检测到点击信号。您确定要断开与战术终端的连接，退出登录吗？");
            if (confirmLogout) {
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('customUsername'); // 同步注销自定义名字
                alert("🔒 终端已安全锁定，期待您的下次归队！");
                window.location.reload();
            }
        } else {
            const confirmLogin = confirm("🛸 特工目前处于离线状态。是否立刻激活战术滑块，解锁终端？");
            if (confirmLogin) {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('active'); // 如果本页有弹窗，直接拉起
                } else {
                    // 如果本页没有弹窗（比如在 join.html），则传送回首页或当前页带上参数唤醒
                    alert("📡 正在为您建立与核心登录终端的连接...");
                    window.location.href = "index.html?action=login"; 
                }
            }
        }
    });
}

// ========================================================
// 纯本地滑块验证码控制核心（加锁保护，防止在缺失元素的页面报错）
// ========================================================
let isDragging = false; 
let startX = 0;
let maxTarget = 0; 
let isVerified = false; 

function initCaptchaLogic() {
    const slider = document.getElementById('captchaSlider');
    const track = document.getElementById('captchaTrack');
    if (!slider || !track) return; // 🛡️ 如果页面没滑块组件，静默退出

    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        if (isVerified) return;
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        maxTarget = track.clientWidth - slider.clientWidth;
        slider.style.transition = 'none';
    }

    window.addEventListener('mousemove', (e) => {
        if (!isDragging || isVerified || !slider) return;
        const currentX = e.clientX || e.touches[0].clientX;
        let moveX = currentX - startX;
        if (moveX < 0) moveX = 0;
        if (moveX > maxTarget) moveX = maxTarget;
        
        slider.style.left = moveX + 'px';
        if (moveX >= maxTarget - 2) {
            isVerified = true;
            isDragging = false;
            triggerSuccess();
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        if (!isVerified && slider) {
            slider.style.transition = 'left 0.3s ease';
            slider.style.left = '0px';
        }
    });
}

function triggerSuccess() {
    const track = document.getElementById('captchaTrack');
    const captchaText = document.getElementById('captchaText');
    const slider = document.getElementById('captchaSlider');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    
    if (!track || !captchaText || !slider || !loginSubmitBtn) return;
    track.classList.add('success');
    captchaText.innerText = '验证通过 - 终端已解锁';
    slider.innerText = '✓';
    
    loginSubmitBtn.disabled = false;
    loginSubmitBtn.style.opacity = '1';
    loginSubmitBtn.style.cursor = 'pointer';
}

function resetCaptcha() {
    isVerified = false;
    isDragging = false;
    const track = document.getElementById('captchaTrack');
    const captchaText = document.getElementById('captchaText');
    const slider = document.getElementById('captchaSlider');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    
    if (!track || !captchaText || !slider || !loginSubmitBtn) return;
    track.classList.remove('success');
    captchaText.innerText = '向右滑动解锁战术终端';
    slider.innerText = '>>';
    slider.style.left = '0px';
    
    loginSubmitBtn.disabled = true;
    loginSubmitBtn.style.opacity = '0.5';
    loginSubmitBtn.style.cursor = 'not-allowed';
}

// ========================================================
// 🛸 战术终端：新兵档案建立中心（B站创意密码联动 高级版）
// ========================================================
function showCuteRegisterModal() {
    if (document.getElementById('cuteRegisterModal')) return;

    const modal = document.createElement('div');
    modal.id = 'cuteRegisterModal';
    modal.className = 'cute-modal-mask';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(10, 10, 12, 0.9); display: flex; align-items: center; 
        justify-content: center; z-index: 10000; backdrop-filter: blur(8px);
    `;

    modal.innerHTML = `
        <div class="cute-modal-box" style="
            background: #141416; padding: 40px; border-radius: 16px; 
            text-align: center; border: 2px solid #00adb5; 
            box-shadow: 0 0 30px rgba(0, 173, 181, 0.2); 
            width: 100%; max-width: 400px; color: #fff; position: relative;
            font-family: 'Segoe UI', sans-serif;
        ">
            <div id="closeRegBtn" style="position: absolute; top: 15px; right: 20px; font-size: 24px; color: #666; cursor: pointer; transition: color 0.3s;">×</div>
            <div id="regAvatar" style="font-size: 60px; margin-bottom: 10px; transition: all 0.2s ease;">🦊</div>
            <h3 style="margin: 0 0 5px 0; color: #00adb5; letter-spacing: 2px; font-size: 22px;">新兵档案建立中</h3>
            <p style="font-size: 13px; color: #666; margin-bottom: 25px;">AGENT REGISTRATION TERMINAL</p>
            
            <form id="realRegisterForm" style="display: flex; flex-direction: column; gap: 15px; text-align: left;">
                <div>
                    <label style="font-size: 12px; color: #00adb5; display: block; margin-bottom: 5px; font-weight: bold;">玩家代号 (ID)</label>
                    <input type="text" id="regId" placeholder="输入您的特工专属代号" required style="width: 100%; padding: 12px; background: #1a1a1c; border: 1px solid #333; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box;">
                </div>
                <div>
                    <label style="font-size: 12px; color: #00adb5; display: block; margin-bottom: 5px; font-weight: bold;">联络邮箱 (EMAIL)</label>
                    <input type="email" id="regEmail" placeholder="username@fpshub.com" required style="width: 100%; padding: 12px; background: #1a1a1c; border: 1px solid #333; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box;">
                </div>
                <div>
                    <label style="font-size: 12px; color: #00adb5; display: block; margin-bottom: 5px; font-weight: bold;">配置密码 (PASSWORD)</label>
                    <input type="password" id="regPassword" placeholder="请输入密码 (建立档案)" required style="width: 100%; padding: 12px; background: #1a1a1c; border: 1px solid #333; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box;">
                </div>
                <div>
                    <label style="font-size: 12px; color: #00adb5; display: block; margin-bottom: 5px; font-weight: bold;">确认密码 (CONFIRM PASSWORD)</label>
                    <input type="password" id="regConfirmPassword" placeholder="请再次输入密码 (防止矩阵偷看)" required style="width: 100%; padding: 12px; background: #1a1a1c; border: 1px solid #333; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box;">
                </div>
                <button type="submit" style="
                    background: linear-gradient(135deg, #00adb5, #00fff2); border: none; 
                    padding: 14px; border-radius: 8px; color: #000; font-weight: bold; 
                    cursor: pointer; margin-top: 15px; font-size: 15px; letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(0, 173, 181, 0.3); transition: transform 0.1s;
                " onmousedown="this.style.transform='scale(0.98)'" onmouseup="this.style.transform='scale(1)'">
                    注入新兵序列 🚀
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const regAvatar = document.getElementById('regAvatar');
    const regId = document.getElementById('regId');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const closeRegBtn = document.getElementById('closeRegBtn');
    const realRegisterForm = document.getElementById('realRegisterForm');

    // 🎯 B站面部交互联动
    regId.addEventListener('focus', () => { regAvatar.innerText = "🦊"; });
    regEmail.addEventListener('focus', () => { regAvatar.innerText = "🦊"; });
    regPassword.addEventListener('focus', () => { regAvatar.innerText = "🐱"; });
    regConfirmPassword.addEventListener('focus', () => { regAvatar.innerText = "🙈"; });

    closeRegBtn.addEventListener('click', () => modal.remove());
    closeRegBtn.addEventListener('mouseover', () => closeRegBtn.style.color = '#ff4b2b');
    closeRegBtn.addEventListener('mouseout', () => closeRegBtn.style.color = '#666');

    realRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (regPassword.value !== regConfirmPassword.value) {
            regAvatar.innerText = "🚫";
            alert("❌ 报告特工！两次配置的密码不一致，无法通过安全同步，请重新核对！");
            regConfirmPassword.value = "";
            regConfirmPassword.focus();
            return;
        }

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('customUsername', regId.value);

        regAvatar.innerText = "🎉";
        alert(`✨ 恭喜特工【${regId.value}】，新兵档案建立成功！您已获得接入军械库的最高权限！`);
        modal.remove();
        window.location.reload();
    });
}

// ========================================================
// 6. 📡 页面加载完成后的唯一核心调度中心
// ========================================================
window.addEventListener('DOMContentLoaded', () => {
    // 1. 优先亮起右上角状态灯，并注入点击拦截事件
    renderUserStatusWidget();
    initWidgetClickEvent();

    // 2. 独立、安全的常规登录弹窗开关逻辑（进行非空存在审查）
    const joinBtn = document.getElementById('joinBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    if (joinBtn && loginModal) {
        joinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
        });
    }

    if (closeModal && loginModal) {
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
            resetCaptcha();
        });
    }

    // 🛡️ 【重大安全升级：误触隔离手术】
    // 1. 删除了原本点击大背景关闭登录框的逻辑，只允许点击 × 号关闭！
    // 2. 为登录小方框加上防冒泡钢板，防止拖拽滑块划出边界时导致弹窗意外关闭
    const loginCard = document.querySelector('.login-card') || document.querySelector('.login-box') || (loginModal ? loginModal.querySelector('div') : null);
    if (loginCard) {
        loginCard.addEventListener('mousedown', (e) => e.stopPropagation());
        loginCard.addEventListener('mouseup', (e) => e.stopPropagation());
        loginCard.addEventListener('click', (e) => e.stopPropagation());
    }

    // 3. 初始化登录表单监听
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            sessionStorage.setItem('isLoggedIn', 'true');
            alert("🚀 战术终端解锁成功！欢迎回到避风港，长官！");
            if (loginModal) loginModal.classList.remove('active'); 
            window.location.reload(); 
        });
    }

    // 4. 激活滑块拖拽判定（内部自带非空保护）
    initCaptchaLogic();

    // 5. 探测 URL 参数，跨页面同步拉起大弹窗
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'login' && loginModal) {
        loginModal.classList.add('active');
    }
});

// 🌐 强行挂载全局权限，防止被模块化混淆隔离
window.showCuteRegisterModal = showCuteRegisterModal;
window.renderUserStatusWidget = renderUserStatusWidget;


// 🧚‍♀️ 全站专属战术悬浮挂件系统（绝对安全兼容版）
document.addEventListener("DOMContentLoaded", () => {
    // 1. 创建挂件的外层包裹框
    const floatingHelper = document.createElement("div");
    floatingHelper.id = "globalFloatingHelper";
    
    // 2. 注入图片（强制给图片固定的宽高，防止有些浏览器加载慢导致宽高变成0）
    floatingHelper.innerHTML = `
        <img src="./assets/images/helper.png" alt="战术助手" style="width: 120px !important; height: auto !important; cursor: grab; display: block;" draggable="false">
    `;

    // 3. 使用最基础、兼容性最强的 cssText 注入绝对霸权样式
    floatingHelper.style.cssText = `
        position: fixed !important;
        bottom: 40px !important;
        right: 30px !important;
        width: 120px !important;
        height: auto !important;
        z-index: 999999 !important;
        display: block !important;
        opacity: 1 !important;
        visibility: visible !important;
        transition: transform 0.3s ease, filter 0.3s ease;
    `;

    // 4. 浅色、温和的柔和悬停光晕
    floatingHelper.addEventListener("mouseenter", () => {
        floatingHelper.style.transform = "scale(1.05) translateY(-3px)";
        floatingHelper.style.filter = "drop-shadow(0 0 15px rgba(255, 75, 43, 0.4))"; 
    });
    floatingHelper.addEventListener("mouseleave", () => {
        floatingHelper.style.transform = "scale(1) translateY(0)";
        floatingHelper.style.filter = "none";
    });

    // 5. 极稳拖拽算法
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let hasMoved = false; 

    floatingHelper.addEventListener("mousedown", (e) => {
        // 只允许鼠标左键拖拽
        if (e.button !== 0) return; 
        
        isDragging = true;
        hasMoved = false;
        
        const img = floatingHelper.querySelector("img");
        if (img) img.style.cursor = "grabbing";
        
        floatingHelper.style.transition = "none";

        startX = e.clientX;
        startY = e.clientY;

        // 精准抓取当前的绝对坐标
        const rect = floatingHelper.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // 解除右下角绑定，切换为绝对坐标定位
        floatingHelper.style.bottom = "auto";
        floatingHelper.style.right = "auto";
        floatingHelper.style.left = initialLeft + "px";
        floatingHelper.style.top = initialTop + "px";
        
        // 防止拖拽时误选中网页上的文字
        e.preventDefault(); 
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // 只要移动距离超过 4 像素，就判定为拖拽，不触发点击
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
            hasMoved = true;
        }

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // 视口边缘防撞锁
        const pad = 10;
        if (newLeft < pad) newLeft = pad;
        if (newTop < pad) newTop = pad;
        if (newLeft > window.innerWidth - 130) newLeft = window.innerWidth - 130;
        if (newTop > window.innerHeight - 150) newTop = window.innerHeight - 150;

        floatingHelper.style.left = newLeft + "px";
        floatingHelper.style.top = newTop + "px";
    });

    document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        
        const img = floatingHelper.querySelector("img");
        if (img) img.style.cursor = "grab";
        
        floatingHelper.style.transition = "transform 0.3s ease, filter 0.3s ease";
    });

    // 6. 核心点击重定向
    floatingHelper.addEventListener("click", (e) => {
        if (hasMoved) {
            // 如果移动过，说明是拖拽行为，直接切断点击事件
            e.preventDefault();
            return; 
        }

        alert("遇到的问题请找我！(๑•̀ㅂ•·)و✧");
        const qqGroupUrl = "https://qun.qq.com/universal-share/share?ac=1&authKey=jXjnaJmZs3zAfgapzyHPp2ZwPc4QVpMNlYr9Yfo%2BTB949tJ5hzfJ44ekNzn6M8ta&busi_data=eyJncm91cENvZGUiOiI3MDMzOTYwMDYiLCJ0b2tlbiI6IjlsbFM5RTBqVzRQOWlpcWo5WTJKZWQyQnJJNkxzL1hSN0FnbUQyYXUrUEw5eThXWmM2a3VFT09YQXBnSmYzNUQiLCJ1aW4iOiIzNjYxNjg2NTkifQ%3D%3D&data=ZD-B5qIyFcmCADhrLnzD6G_YA5h3e3gyh0UAQoWv2PFkTdUh4Z1ByCwwE3GEmBjM2tm8iiduB4C0uLNukjzBGw&svctype=4&tempid=h5_group_info";
        window.open(qqGroupUrl, "_blank");
    });

    // 7. 安全空降到页面 body 中
    if (document.body) {
        document.body.appendChild(floatingHelper);
        console.log("🧚‍♀️ 【战术挂件】已全配置就位，等待特工指令。");
    }
});