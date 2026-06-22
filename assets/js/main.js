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
        usernameEl.style.color = "var(--text-primary)";
        dotEl.style.backgroundColor = "#2ecc71";
        dotEl.style.boxShadow = "0 0 8px #2ecc71";
        
        // ⚡ 顺手给 body 同步打上已登录标记（防止刷新后 body 标记丢失）
        document.body.classList.add('logged-in');
    } else {
        avatarEl.innerText = "🐢";
        usernameEl.innerText = "未登录";
        usernameEl.style.color = "var(--text-secondary)";
        dotEl.style.backgroundColor = "#ff4b2b";
        dotEl.style.boxShadow = "0 0 8px #ff4b2b";
        
        // 移除已登录标记
        document.body.classList.remove('logged-in');
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
                document.body.classList.remove('logged-in'); // 卸载状态标记
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
    if (!slider || !track) return;

    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        if (isVerified) return;
        e.preventDefault();
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        maxTarget = track.clientWidth - slider.clientWidth;
        slider.style.transition = 'none';
        slider.style.transform = 'scale(0.96)';
    }

    // Mouse move
    window.addEventListener('mousemove', (e) => {
        if (!isDragging || isVerified || !slider) return;
        const currentX = e.clientX;
        let moveX = currentX - startX;
        if (moveX < 0) moveX = 0;
        if (moveX > maxTarget) moveX = maxTarget;
        
        slider.style.left = moveX + 'px';
        if (moveX >= maxTarget - 2) {
            isVerified = true;
            isDragging = false;
            slider.style.transform = 'scale(1)';
            triggerSuccess();
        }
    });

    // Touch move
    window.addEventListener('touchmove', (e) => {
        if (!isDragging || isVerified || !slider) return;
        e.preventDefault();
        const currentX = e.touches[0].clientX;
        let moveX = currentX - startX;
        if (moveX < 0) moveX = 0;
        if (moveX > maxTarget) moveX = maxTarget;
        
        slider.style.left = moveX + 'px';
        if (moveX >= maxTarget - 2) {
            isVerified = true;
            isDragging = false;
            slider.style.transform = 'scale(1)';
            triggerSuccess();
        }
    }, { passive: false });

    // Mouse up
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        if (!isVerified && slider) {
            slider.style.transition = 'left 0.3s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
            slider.style.transform = 'scale(1)';
            slider.style.left = '0px';
        }
    });

    // Touch end
    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        if (!isVerified && slider) {
            slider.style.transition = 'left 0.3s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
            slider.style.transform = 'scale(1)';
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
    
    slider.style.transform = 'scale(1)';
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
    slider.style.transform = 'scale(1)';
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
    // mask styles handled by .cute-modal-mask CSS
;

    modal.innerHTML = `
        <div class="cute-modal-box">
            <div id="closeRegBtn" class="cute-modal-close">&times;</div>
            <div id="regAvatar" class="cute-modal-avatar">🦊</div>
            <h3>新兵档案建立中</h3>
            <p>AGENT REGISTRATION TERMINAL</p>
            
            <form id="realRegisterForm">
                <div>
                    <label>玩家代号 (ID)</label>
                    <input type="text" id="regId" placeholder="输入您的特工专属代号" required>
                </div>
                <div>
                    <label>联络邮箱 (EMAIL)</label>
                    <input type="email" id="regEmail" placeholder="username@fpshub.com" required>
                </div>
                <div>
                    <label>配置密码 (PASSWORD)</label>
                    <input type="password" id="regPassword" placeholder="请输入密码 (建立档案)" required>
                </div>
                <div>
                    <label>确认密码 (CONFIRM PASSWORD)</label>
                    <input type="password" id="regConfirmPassword" placeholder="请再次输入密码 (防止矩阵偷看)" required>
                </div>
                <button type="submit">
                    注入新兵序列 🚀
                </button>
            </form>
        </div>
    `;;

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
    // closeRegBtn hover handled by .cute-modal-close:hover CSS

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
        
        // ⚡ 注册成功瞬间，在 body 上钉死登录类名标记
        document.body.classList.add('logged-in');

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

    // 🚀 【核心修复点】：重新编写 joinBtn 的智能接入逻辑
    if (joinBtn) {
        joinBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻断默认的 # 锚点顶格刷新
            
            // 实时读取最新的登录状态 + 游客模式
            const isLogged = sessionStorage.getItem('isLoggedIn') === 'true';

            if (isLogged) {
                // ✨ 状态A：特工已登录，丝滑滚动到最底部的【加入我们】群组模块
                const joinSection = document.querySelector('.home-join-wild');
                if (joinSection) {
                    joinSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            } else {
                // ❌ 状态B：未登录且非游客，优雅拉起登录框
                if (loginModal) loginModal.classList.add('active');
            }
        });
    }

    // 🟢 仅浏览按钮：不需要登录，直接滚动到社区模块
    const browseBtn = document.getElementById('browseBtn');
    if (browseBtn) {
        browseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const saved = browseBtn.textContent;
            browseBtn.textContent = '✓ 已进入游客模式';
            browseBtn.style.color = '#2ecc71';
            browseBtn.style.borderColor = '#2ecc71';
            setTimeout(() => {
                browseBtn.textContent = saved;
                browseBtn.style.color = '';
                browseBtn.style.borderColor = '';
            }, 2000);
        });
    }

    if (closeModal && loginModal) {
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
            resetCaptcha();
        });
    }

    // 🛡️ 【重大安全升级：误触隔离手术】
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
            
            // ⚡ 登录成功瞬间，在 body 上钉死登录类名标记
            document.body.classList.add('logged-in');

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
        const isLogged = sessionStorage.getItem('isLoggedIn') === 'true';
        if (!isLogged) {
            loginModal.classList.add('active');
        } else {
            window.history.replaceState({}, '', window.location.pathname);
        }
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
    
    // 2. 注入图片
    floatingHelper.innerHTML = `
        <img src="./assets/images/helper.png" alt="战术助手" style="width: 120px !important; height: auto !important; cursor: grab; display: block;" draggable="false">
    `;

    // 3. 样式注入
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

    // 4. 悬停效果
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
        if (e.button !== 0) return; 
        
        isDragging = true;
        hasMoved = false;
        
        const img = floatingHelper.querySelector("img");
        if (img) img.style.cursor = "grabbing";
        
        floatingHelper.style.transition = "none";

        startX = e.clientX;
        startY = e.clientY;

        const rect = floatingHelper.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        floatingHelper.style.bottom = "auto";
        floatingHelper.style.right = "auto";
        floatingHelper.style.left = initialLeft + "px";
        floatingHelper.style.top = initialTop + "px";
        
        e.preventDefault(); 
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
            hasMoved = true;
        }

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

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
            e.preventDefault();
            return; 
        }

        alert("遇到的问题请找我！(๑•̀ㅂ•·)و✧");
        const qqGroupUrl = "https://qun.qq.com/universal-share/share?ac=1&authKey=jXjnaJmZs3zAfgapzyHPp2ZwPc4QVpMNlYr9Yfo%2BTB949tJ5hzfJ44ekNzn6M8ta&busi_data=eyJncm91cENvZGUiOiI3MDMzOTYwMDYiLCJ0b2tlbiI6IjlsbFM5RTBqVzRQOWlpcWo5WTJKZWQyQnJJNkxzL1hSN0FnbUQyYXUrUEw5eThXWmM2a3VFT09YQXBnSmYzNUQiLCJ1aW4iOiIzNjYxNjg2NTkifQ%3D%3D&data=ZD-B5qIyFcmCADhrLnzD6G_YA5h3e3gyh0UAQoWv2PFkTdUh4Z1ByCwwE3GEmBjM2tm8iiduB4C0uLNukjzBGw&svctype=4&tempid=h5_group_info";
        window.open(qqGroupUrl, "_blank");
    });

    if (document.body) {
        document.body.appendChild(floatingHelper);
        console.log("🧚‍♀️ 【战术挂件】已全配置就位，等待特工指令。");
    }
});
 // ========================================================
 // 馃攵 鍏ㄧ珯娣辫壊妯″紡鍒囨崲绯荤粺 (Dark Mode Toggle)
 // ========================================================
 (function initThemeSystem() {
     const savedTheme = localStorage.getItem('fpshub-theme');
     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
     const theme = savedTheme || (prefersDark ? 'dark' : 'light');
     document.documentElement.setAttribute('data-theme', theme);
 
     function updateToggleButton() {
         const btn = document.getElementById('themeToggleBtn');
         if (!btn) return;
         const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
         const icon = btn.querySelector('.toggle-icon');
         const label = btn.querySelector('.toggle-label');
         // icon now handled by CSS mask (no emoji dependency)
         if (label) label.textContent = isDark ? '夜间' : '日间';
     }
 
     if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', updateToggleButton);
     } else {
         updateToggleButton();
     }
 
     window.toggleTheme = function() {
         const current = document.documentElement.getAttribute('data-theme');
         const next = current === 'dark' ? 'light' : 'dark';
         document.documentElement.setAttribute('data-theme', next);
         localStorage.setItem('fpshub-theme', next);
         updateToggleButton();
     };
 })();


// ========================================================
// 导航 active 状态自动检测
// ========================================================
(function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links > li > a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active-link');
        }
    });
})();

// ========================================================
// 移动端 Hamburgermenu 折叠控制
// ========================================================
(function() {
    if (document.querySelector('.hamburger-toggle')) return;
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    if (!navbar || !navLinks) return;

    const toggle = document.createElement('button');
    toggle.className = 'hamburger-toggle';
    toggle.innerHTML = '<span></span><span></span><span></span>';
    toggle.setAttribute('aria-label', 'Toggle navigation');
    navbar.insertBefore(toggle, navbar.firstChild.nextSibling);

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
        toggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('nav-open')) {
            navLinks.classList.remove('nav-open');
            toggle.classList.remove('active');
        }
    });
})();

// ========================================================
// 页面加载时检查图片是否存在，不存在则用占位图
// ========================================================
(function() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400/111111/ff4b2b?text=NO+IMG';
            this.style.opacity = '0.5';
        });
    });
})();



// ========================================================
// Count-up animation for stats numbers (IntersectionObserver)
// ========================================================
(function() {
    function animateCountUp(el, target, duration) {
        var start = 0;
        var startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        el.textContent = "0";
        requestAnimationFrame(step);
    }

    var statNumbers = document.querySelectorAll(".stat-number[data-target]");
    if (statNumbers.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute("data-target"), 10);
                if (target && !el.dataset.counted) {
                    el.dataset.counted = "1";
                    animateCountUp(el, target, 1800);
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(function(el) { observer.observe(el); });
})();
