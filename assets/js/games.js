// assets/js/games.js
// ==================== 网页底层状态管理 ====================
let isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; // 换成安全的会话存储

let currentPlatform = 'all';
let currentSubTag = 'all';
let starredGames = new Set(); 

const grid = document.getElementById('libraryGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');

// 🚀 初始化启动（加上防崩溃安全锁）
window.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof renderUserStatusWidget === "function") {
            renderUserStatusWidget();
        }
    } catch (err) {
        console.log("状态组件挂起中...", err);
    }

    renderSubTags();
    filterAndRender(); 
});

// 1. 动态根据现有数据生成细分类子标签
function renderSubTags() {
    const container = document.getElementById('subTagContainer');
    if (!container) return;
    const filtered = GAMES_DATABASE.filter(g => currentPlatform === 'all' || g.platform === currentPlatform);
    const tags = ['all', ...new Set(filtered.map(g => g.subTag))];
    
    container.innerHTML = tags.map(tag => {
        const label = tag === 'all' ? '全部玩法' : tag;
        const activeClass = tag === currentSubTag ? 'active' : '';
        return `<button class="tag-btn ${activeClass}" onclick="selectSubTag('${tag}')">${label}</button>`;
    }).join('');
}

// 2. 核心过滤器与卡片生成
function filterAndRender() {
    if (!searchInput || !grid || !noResults) return;
    const keyword = searchInput.value.trim().toLowerCase();
    
    clearSearch.style.display = keyword ? 'block' : 'none';

    const result = GAMES_DATABASE.filter(game => {
        const matchKeyword = game.name.toLowerCase().includes(keyword) || game.dev.toLowerCase().includes(keyword);
        const matchPlatform = currentPlatform === 'all' || game.platform === currentPlatform;
        const matchSubTag = currentSubTag === 'all' || game.subTag === currentSubTag;
        return matchKeyword && matchPlatform && matchSubTag;
    });

    if (result.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        
        // 清空重构，改用标准的 Element 创建法，以便完美绑定 Hover Intent 2秒延迟逻辑
        grid.innerHTML = '';
        
        // 找到 games.js 里的这段 result.forEach(game => { ... }) 
        result.forEach(game => {
            const isStarred = starredGames.has(game.id);
            const fallbackImg = `https://via.placeholder.com/150/111111/ff4b2b?text=${encodeURIComponent(game.name.substring(0,2))}`;
            const displayImg = game.img ? game.img : fallbackImg;

            const cardWrapper = document.createElement('div');
            cardWrapper.className = `game-big-card ${isStarred ? 'starred' : ''}`;
            cardWrapper.id = `game-card-${game.id}`;
            cardWrapper.style.position = 'relative'; 

            cardWrapper.innerHTML = `
                <div class="official-delay-overlay" style="
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(14, 14, 16, 0.85); 
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); /* ✨ 把模糊直接做在遮罩层上！ */
                    border-radius: inherit;
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; pointer-events: none; z-index: 5;
                    transition: opacity 0.2s linear; /* ⚡ 0.2秒快进快出，防止粘滞判定 */
                ">
                    <button class="overlay-btn official-btn" style="
                        padding: 12px 24px; background: #ff4b2b; color: #fff; border: none;
                        font-weight: bold; font-size: 14px; border-radius: 8px; cursor: pointer;
                        box-shadow: 0 0 15px rgba(255, 75, 43, 0.4); letter-spacing: 1px;
                    " onclick="window.open('${game.officialUrl || '#'}', '_blank')">
                        🚀 接入外部秘密基地 (前往官网)
                    </button>
                </div>

                <div class="card-inner-content">
                    <div class="card-main-body" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                        <div style="display: flex; gap: 15px;">
                            <div class="game-img-wrapper">
                                <img src="${displayImg}" alt="${game.name}" class="game-card-img" loading="lazy">
                            </div>
                            <div class="card-right-info">
                                <h3 class="game-card-title" style="margin-top: 2px;">${game.name}</h3>
                                <div class="game-card-meta">
                                    <span class="meta-dev">厂商⚙️  ${game.dev}</span>
                                    <span class="meta-platform">平台🎮 ${game.platform}</span>
                                </div>
                            </div>  
                        </div>

                <div class="forum-button-zone" style="margin-top: 5px; z-index: 2;">
                    <button class="overlay-btn forum-btn" style="
                        white-space: nowrap; padding: 6px 12px; 
                        background: linear-gradient(135deg, #1c1d21, #121214);
                        border: 1px solid #ff4b2b; border-radius: 6px; color: #ff4b2b;
                        font-size: 12px; font-weight: bold; cursor: pointer;
                        transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(255,75,43,0.15);
                    " onclick="event.stopPropagation(); window.open('${game.forumUrl || '#'}', '_blank')"
                      onmouseover="this.style.background='#ff4b2b'; this.style.color='#fff'; this.style.boxShadow='0 0 12px rgba(255,75,43,0.4)';"
                      onmouseout="this.style.background='linear-gradient(135deg, #1c1d21, #121214)'; this.style.color='#ff4b2b'; this.style.boxShadow='0 2px 8px rgba(255,75,43,0.15)';">
                        💬 本站论坛
                    </button>
                </div>
            </div>
            
            <p class="game-card-desc" style="margin-top: 14px;">${game.desc}</p>
        </div>

        <div class="card-actions" style="z-index: 3;">
            <div class="three-dots">•••</div>
            <div class="action-menu">
                <div class="menu-item" onclick="toggleStar(${game.id})">
                    <span class="star-icon" style="color:${isStarred ? '#ffd700' : '#888'}">★</span> 
                    ${isStarred ? '取消收藏' : '标为 Star'}
                </div>
                <div class="menu-item" onclick="generateAndDownloadCard(${game.id})">💾 下载卡面</div>
            </div>
        </div>
    `;

    // ==========================================
    // ⏱️ 精准同步：2秒悬停判定引擎（神形合一版）
    // ==========================================
    let hoverTimer = null;
    const overlay = cardWrapper.querySelector('.official-delay-overlay');

    cardWrapper.addEventListener('mouseenter', () => {
        // 稳稳放上去 2000毫秒（2秒）后，遮罩、模糊、按钮同时出现
        hoverTimer = setTimeout(() => {
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto'; // 允许点击
            }
        }, 2000);
    });

    cardWrapper.addEventListener('mouseleave', () => {
        // 鼠标移开，定时器立刻毁灭
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none'; // 锁死
        }
    });

    grid.appendChild(cardWrapper);
});
    }
}

// 3. 事件监听器们
if (searchInput) searchInput.addEventListener('input', filterAndRender);
if (clearSearch) clearSearch.addEventListener('click', () => { searchInput.value = ''; filterAndRender(); });

// 大分类点击
document.querySelectorAll('.main-tags .tag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.main-tags .tag-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentPlatform = e.target.getAttribute('data-type');
        currentSubTag = 'all'; 
        renderSubTags();
        filterAndRender();
    });
});

function selectSubTag(tag) {
    currentSubTag = tag;
    renderSubTags();
    filterAndRender();
}

function toggleStar(id) {
    if (!isLoggedIn) {
        showCuteLoginModal();
        return; 
    }
    if (starredGames.has(id)) {
        starredGames.delete(id);
    } else {
        starredGames.add(id);
    }
    filterAndRender(); 
}

// 4. GitHub Star 联动猫咪拦截弹窗
function showCuteLoginModal() {
    if (document.getElementById('cuteLoginModal')) return;

    const modal = document.createElement('div');
    modal.id = 'cuteLoginModal';
    modal.className = 'cute-modal-mask';

    modal.innerHTML = `
        <div class="cute-modal-box">
            <div class="cute-modal-avatar">🐱</div>
            <h3 id="cuteModalTitle">📢 哔哔！前方高能预警</h3>
            <p id="cuteModalText">想要给心仪的游戏标 Star 吗？特工，你似乎还没有解锁“登录状态”哦！</p>
            
            <div class="cute-modal-btns">
                <button class="cute-btn-primary" id="cuteGoLoginRealBtn">传送去登录 🚀</button>
                <button class="cute-btn-secondary" id="cuteRejectBtn">不听不听，仅浏览 🫣</button>
            </div>
            
            <p class="cute-modal-footer-text" style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">
                没有帐户？<span id="cuteGoRegisterBtn" style="color: #ff4b2b; cursor: pointer; text-decoration: underline;">立即注册</span>
            </p>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cuteGoLoginRealBtn').addEventListener('click', () => {
        closeCuteModal();
        window.location.href = "index.html?action=login";
    });

    document.getElementById('cuteGoRegisterBtn').addEventListener('click', () => {
        closeCuteModal(); 
        showCuteRegisterModal(); 
    });

    const rejectBtn = document.getElementById('cuteRejectBtn');
    let clickCount = 0;
    rejectBtn.addEventListener('click', () => {
        clickCount++;
        const titleEl = document.getElementById('cuteModalTitle');
        const textEl = document.getElementById('cuteModalText');
        const avatarEl = modal.querySelector('.cute-modal-avatar');
        if (clickCount === 1) {
            avatarEl.innerText = "🥺"; titleEl.innerText = "诶？真的不登录吗？";
            textEl.innerText = "不登录的话，本系统可没办法帮你好好的保存 Star 记录哦～ 真的要继续当神秘游客吗？";
            rejectBtn.innerText = "硬核死撑，仅浏览 🧱";
        } else if (clickCount === 2) {
            avatarEl.innerText = "🐾"; titleEl.innerText = "好吧... 拗不过你";
            textEl.innerText = "（小声哔哔：真是个傲娇的特工...）那就先批准你无账号浏览吧！好戏在后头呢！";
            rejectBtn.innerText = "哼，进入军械库 🔓";
        } else {
            closeCuteModal();
            if (typeof showToast === "function") { showToast("🫣 游客模式已激活！你现在可以继续围观啦~"); }
        }
    });
}

function closeCuteModal() {
    const modal = document.getElementById('cuteLoginModal');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => modal.remove(), 300);
    }
}

// 5. Canvas本地卡面生成器
function generateAndDownloadCard(id) {
    const game = GAMES_DATABASE.find(g => g.id === id);
    if (!game) return;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = starredGames.has(id) ? '#ffd700' : '#ff4b2b';
    ctx.lineWidth = 4;
    
    function roundRect(x, y, w, h, r) {
        ctx.beginPath(); ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r); ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath();
    }
    roundRect(5, 5, 390, 230, 12);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Segoe UI", sans-serif';
    ctx.fillText(`${game.icon || '🎮'}  ${game.name.split(' (')[0]}`, 25, 50);

    ctx.fillStyle = '#666666';
    ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText(`开发商: ${game.dev}   |   平台: ${game.platform}   |   类型: ${game.subTag}`, 25, 85);

    ctx.strokeStyle = '#333333'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(25, 105); ctx.lineTo(375, 105); ctx.stroke();

    ctx.fillStyle = '#cccccc';
    ctx.font = '15px "Segoe UI", sans-serif';
    ctx.fillText(game.desc, 25, 145);
    
    ctx.fillStyle = '#ff4b2b';
    ctx.font = 'bold 11px "Segoe UI", sans-serif';
    ctx.fillText("FPS HUB CAPTURE SYSTEM", 25, 205);

    const dataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = `${game.name}-战术卡面.png`;
    downloadLink.click();

    showToast(`🎯 已为你成功导出《${game.name.split(' (')[0]}》的本地圆角卡面！`);
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }
}

// ========================================================
// 🟢🔴 状态渲染器
// ========================================================
function renderUserStatusWidget() {
    const avatarEl = document.getElementById('widgetAvatar');
    const usernameEl = document.getElementById('widgetUsername');
    const dotEl = document.getElementById('widgetDot');
    
    if (!avatarEl || !usernameEl || !dotEl) return;

    const isLogged = sessionStorage.getItem('isLoggedIn') === 'true';

    if (isLogged) {
        const savedName = sessionStorage.getItem('customUsername') || "特工 V";
        avatarEl.innerText = "🐱";
        usernameEl.innerText = savedName; 
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
window.renderUserStatusWidget = renderUserStatusWidget;

// ========================================================
// 🦊 睁闭眼动态注册面板
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
                    <input type="password" id="regPassword" placeholder="请输入密码" required style="width: 100%; padding: 12px; background: #1a1a1c; border: 1px solid #333; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box;">
                </div>
                <div>
                    <label style="font-size: 12px; color: #00adb5; display: block; margin-bottom: 5px; font-weight: bold;">确认密码 (CONFIRM)</label>
                    <input type="password" id="regConfirmPassword" placeholder="请再次输入密码" required style="width: 100%; padding: 12px; background: #1a1a1c; border: 1px solid #333; border-radius: 8px; color: #fff; outline: none; box-sizing: border-box;">
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
            regConfirmPassword.value = ""; regConfirmPassword.focus(); return;
        }
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('customUsername', regId.value);
        regAvatar.innerText = "🎉";
        alert(`✨ 恭喜特工【${regId.value}】，新兵档案建立成功！您可以开始标记 Star 了！`);
        modal.remove(); 
        window.location.reload(); 
    });
}

// 🛡️ 全局函数安全挂载
window.toggleStar = toggleStar;
window.closeCuteModal = closeCuteModal;
window.showCuteRegisterModal = showCuteRegisterModal;
window.renderUserStatusWidget = renderUserStatusWidget;

// ========================================================
// 🔄 用户状态挂件事件系统
// ========================================================
function initWidgetClickEvent() {
    const widget = document.getElementById('userStatusWidget');
    if (!widget) return;

    widget.style.cursor = 'pointer';

    widget.addEventListener('click', () => {
        const isLogged = sessionStorage.getItem('isLoggedIn') === 'true';
        if (isLogged) {
            const confirmLogout = confirm("🚪 报告长官，检测到点击信号。您确定要断开与战术终端的连接，退出登录吗？");
            if (confirmLogout) {
                sessionStorage.removeItem('isLoggedIn');
                alert("🔒 终端已安全锁定，期待您的下次归队！");
                window.location.reload(); 
            }
        } else {
            const confirmLogin = confirm("🛸 特工目前处于离线状态。是否火速传送到“主页避风港”去解锁终端？");
            if (confirmLogin) {
                window.location.href = "index.html?action=login";
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initWidgetClickEvent();
});