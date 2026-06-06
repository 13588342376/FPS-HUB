// assets/js/home-agent.js

// ==================== 1. 模态弹窗系统控制（联动原生HTML卡片） ====================
function openPortalModal(name, official, forum) {
    const modal = document.getElementById('portalModal');
    if (!modal) return;
    document.getElementById('portalGameName').innerText = `🎯 锁定目标：${name}`;
    document.getElementById('portalOfficialBtn').href = official;
    document.getElementById('portalForumBtn').href = forum;
    
    modal.style.display = 'flex';
}

function closePortalModal() {
    const modal = document.getElementById('portalModal');
    if (modal) modal.style.display = 'none';
}

// 点击遮罩层外面也可以关闭弹窗
window.addEventListener('click', (e) => {
    const modal = document.getElementById('portalModal');
    if (e.target === modal) closePortalModal();
});


// ==================== 2. 热点新闻提取（直连外部官方新闻源链接 🔗） ====================
function initHomeTopNews() {
    const newsGrid = document.getElementById('homeNewsGrid');
    if (!newsGrid) return;

    // ✨ 这里的 link 改成了对应游戏的真实官方公告或社区链接！
    const TOP_NEWS_MOCK = [
        { id: 1, title: "《CS2》反作弊系统迎来重大升级：追溯性封禁全面启动", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", date: "2026-06-05", link: "https://www.counter-strike.net/news" },
        { id: 2, title: "《Valorant》新赛季全球冠军赛日程正式排定，新地图爆料涌现", img: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400&q=80", date: "2026-06-04", link: "https://playvalorant.com/zh-tw/news/" },
        { id: 3, title: "《Apex》重磅活动开启：恶灵传家宝限时返场与护盾平衡性调整", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80", date: "2026-06-02", link: "https://www.ea.com/zh-tw/games/apex-legends/news" }
    ];

    const targetNews = (typeof NEWS_DATABASE !== 'undefined') ? NEWS_DATABASE.slice(0, 3) : TOP_NEWS_MOCK;

    // assets/js/home-agent.js 内部对应的新闻生成段落修改：

    newsGrid.innerHTML = targetNews.map(item => {
        return `
            <div class="home-news-card" onclick="window.open('${item.link || '#'}', '_blank')" style="
                background: #141416; border: 1px solid #222; border-radius: 8px; 
                width: 315px; overflow: hidden; cursor: pointer; text-align: left;
                transition: all 0.3s ease; box-sizing: border-box;
            " onmouseover="this.style.borderColor='#00adb5'; this.style.transform='translateY(-6px)'; this.style.boxShadow='0 10px 20px rgba(0,173,181,0.1)';" 
              onmouseout="this.style.borderColor='#222'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                <div style="width: 100%; height: 170px; overflow: hidden; background: #000;">
                    <img src="${item.img}" style="width:100%; height:100%; object-fit: cover; transition: transform 0.4s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                </div>
                <div style="padding: 20px;">
                    <span style="color: #555; font-size: 12px; display: block; margin-bottom: 8px; font-weight: bold;">📅 ${item.date}</span>
                    <h4 style="color: #ccc; font-size: 15px; margin: 0; line-height: 1.5; font-weight: bold; transition: color 0.2s;" onmouseover="this.style.color='#00adb5'" onmouseout="this.style.color='#ccc'">${item.title}</h4>
                </div>
            </div>
        `;
    }).join('');
}


// ==================== 3. 组队助手微沙盘交互 ====================
function switchSandboxRole(role, btnElement) {
    const buttons = document.querySelectorAll('.sandbox-btn-cyber');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const quoteEl = document.getElementById('sandboxQuote');
    if (!quoteEl) return;

    if (role === 'fragger') {
        quoteEl.innerText = "「一马当先，撕裂防线！寻找能跟上我补枪节奏的突击兄弟！」";
        quoteEl.style.color = "#ff4b2b";
        quoteEl.style.textShadow = "0 0 10px rgba(255,75,43,0.3)";
    } else if (role === 'awper') {
        quoteEl.innerText = "「长线架枪已就绪，A大鸟都飞不过去。帮我防好屁股就行。」";
        quoteEl.style.color = "#ffd700";
        quoteEl.style.textShadow = "0 0 10px rgba(255,215,0,0.3)";
    } else if (role === 'igl') {
        quoteEl.innerText = "「Rush B 只是幌子，听我战术手势，第二时间静步控图，稳稳拿下！」";
        quoteEl.style.color = "#00adb5";
        quoteEl.style.textShadow = "0 0 10px rgba(0,173,181,0.3)";
    }
}

// 启动执行
window.addEventListener('DOMContentLoaded', () => {
    initHomeTopNews();
});

// 全局挂载函数
window.openPortalModal = openPortalModal;
window.closePortalModal = closePortalModal;
window.switchSandboxRole = switchSandboxRole;