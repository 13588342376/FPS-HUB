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
                    " ${game.officialUrl ? `onclick="window.open('${game.officialUrl}', '_blank')"` : 'disabled style="opacity:0.4; cursor:not-allowed; pointer-events:none;"'}>
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
                        background: var(--tag-bg);
                        border: 1px solid var(--accent); border-radius: 6px; color: var(--accent);
                        font-size: 12px; font-weight: bold; cursor: pointer;
                        transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(255,75,43,0.15);
                    " onclick="event.stopPropagation(); window.open('${game.forumUrl || 'forum-placeholder.html?id=' + game.id}', '_blank')"
                      onmouseover="this.style.background='var(--accent)'; this.style.color='#fff'; this.style.boxShadow='0 0 12px var(--accent-glow)';"
                      onmouseout="this.style.background='var(--tag-bg)'; this.style.color='var(--accent)'; this.style.boxShadow='0 2px 8px rgba(255,75,43,0.15)';">
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
    // ⏱️ 精准同步：0.8秒悬停判定引擎（神形合一版）
    // ==========================================
    let hoverTimer = null;
    const overlay = cardWrapper.querySelector('.official-delay-overlay');

    cardWrapper.addEventListener('mouseenter', () => {
        // 稳稳放上去 800毫秒（0.8秒）后，遮罩、模糊、按钮同时出现
        hoverTimer = setTimeout(() => {
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto'; // 允许点击
            }
        }, 800);
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
                没有帐户？<span id="cuteGoRegisterBtn" style="color: var(--accent); cursor: pointer; text-decoration: underline;">立即注册</span>
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
﻿function generateAndDownloadCard(id) {
    const game = GAMES_DATABASE.find(g => g.id === id);
    if (!game) return;

    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    var bgGrad = ctx.createLinearGradient(0, 0, 440, 280);
    bgGrad.addColorStop(0, '#141416');
    bgGrad.addColorStop(0.5, '#1a1a1e');
    bgGrad.addColorStop(1, '#0e0e10');
    ctx.fillStyle = bgGrad;

    var borderColor = starredGames.has(id) ? '#ffd700' : '#ff4b2b';
    function roundRect(x, y, w, h, r) {
        ctx.beginPath(); ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+r);
        ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
    }
    roundRect(4, 4, 432, 272, 14);
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = borderColor;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    var accentGrad = ctx.createLinearGradient(14, 4, 426, 4);
    accentGrad.addColorStop(0, borderColor);
    accentGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(14, 4, 190, 4);

    ctx.font = '42px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(game.icon || '\u{1f3ae}', 28, 72);

    ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    var shortName = game.name.length > 28 ? game.name.substring(0, 26) + '...' : game.name;
    ctx.fillText(shortName, 82, 62);

    ctx.font = 'bold 11px "Segoe UI", sans-serif';
    var tagW = ctx.measureText(game.subTag).width + 16;
    ctx.fillStyle = 'rgba(255,75,43,0.15)';
    roundRect(82, 72, tagW, 22, 6);
    ctx.fill();
    ctx.fillStyle = '#ff4b2b';
    ctx.textAlign = 'center';
    ctx.fillText(game.subTag, 82 + tagW/2, 87);
    ctx.textAlign = 'left';

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(28, 110); ctx.lineTo(412, 110);
    ctx.stroke();

    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('\u2699\uFE0F ' + game.dev, 28, 135);
    ctx.fillText('\u{1f3ae} ' + game.platform, 240, 135);

    ctx.font = '13px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#bbb';
    var desc = game.desc;
    var maxChars = 32;
    var line1 = desc.substring(0, maxChars);
    var line2 = desc.length > maxChars ? desc.substring(maxChars, maxChars * 2) : '';
    ctx.fillText(line1, 28, 165);
    if (line2) ctx.fillText(line2, 28, 185);

    ctx.font = 'bold 10px "Segoe UI", sans-serif';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'right';
    ctx.fillText('FPS HUB \u00B7 TACTICAL CARD', 412, 260);
    ctx.textAlign = 'left';

    if (starredGames.has(id)) {
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'right';
        ctx.fillText('\u2605 STARRED', 412, 52);
        ctx.textAlign = 'left';
    }

    var dataURL = canvas.toDataURL('image/png');
    var downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = (game.name.replace(/[\/:*?"<>|]/g, '-') + '-Card.png');
    downloadLink.click();

    if (typeof showToast === 'function') {
        showToast('\u{1f3af} \u5df2\u5bfc\u51fa ' + game.name.split(' (')[0] + ' \u6218\u672f\u5361\u7247');
    }
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
        usernameEl.style.color = "var(--text-primary)";
        dotEl.style.backgroundColor = "#2ecc71";
        dotEl.style.boxShadow = "0 0 8px #2ecc71";
    } else {
        avatarEl.innerText = "🐢";
        usernameEl.innerText = "未登录";
        usernameEl.style.color = "var(--text-secondary)";
        dotEl.style.backgroundColor = "#ff4b2b";
        dotEl.style.boxShadow = "0 0 8px #ff4b2b";
    }
}
window.renderUserStatusWidget = renderUserStatusWidget;


// 🛡️ 全局函数安全挂载
window.toggleStar = toggleStar;
window.closeCuteModal = closeCuteModal;
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

