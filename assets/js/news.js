// 📰 FPS Hub 新闻数据库集群
const fpsNewsDatabase = [
    // ⭐ 置顶特大头条
    {
        id: 1,
        title: "无畏契约伦敦大师赛今日开战！EDG、XLG、DRG代表VCT CN赛区冲击世界之巅",
        desc: "2026年无畏契约伦敦大师赛于6月6日正式打响，全球12支顶尖战队齐聚伦敦。VCT CN赛区派出EDG、XLG、DRG三支劲旅，其中EDG作为2024年全球冠军赛冠军，承载着打破宿命、再创辉煌的万众期待。",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80&sig=0",
        date: "2026-06-06",
        tag: "赛事头条",
        isFeatured: true,
        sourceUrl: "https://valorantesports.com/"
    },
    // 普通新闻
    {
        id: 2,
        title: "CS2 迎来深渊级引擎微调修补：优化枪战对齐判定，全方位剔除急停开火延迟黏滞感",
        desc: "Valve 刚刚发布了针对反恐精英 2 的最新热更新。本次更新全面修正了Sub-tick（子滴答）系统在极限拉枪状态下的网络丢包判定，饱受职业选手诟病的急停滑步动作得到了根本解决。",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=500&q=80&sig=1",
        date: "2026-06-04",
        tag: "版本资讯",
        isFeatured: false,
        sourceUrl: "https://www.counter-strike.net/news"
    },
    {
        id: 3,
        title: "《Apex 英雄》第 25 赛季全新传奇背景情报流出？侦查位技能模组或迎来彻底重构",
        desc: "根据知名海外数据挖掘特工的爆料，重生工作室内部正在秘密测试代号为 'Phantom' 的全新传奇。其实时干扰雷达与跨越地形的能力，极有可能将现有的三号位打法生态彻底洗牌...",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80&sig=2",
        date: "2026-06-03",
        tag: "深度爆料",
        isFeatured: false,
        sourceUrl: "https://www.ea.com/games/apex-legends/news"
    },
    {
        id: 4,
        title: "FPS Hub 社区战队招募令：第三季度百团大战火热筹备中，寻找顶级指挥官",
        desc: "无论你是擅长拉枪线的突破手，还是掌控全场的残局战术大师，FPS Hub 专属战术互助社区都为你敞开大门。点击加入我们的多端矩阵，组建属于你的绝对胜率车队！",
        image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=500&q=80&sig=3",
        date: "2026-06-01",
        tag: "社区动态",
        isFeatured: false,
        sourceUrl: "./join.html"
    },
    // ========== 以下是补充的11条新资讯 ==========
    {
        id: 5,
        title: "IEM科隆Major激战正酣：FaZe队史首次缺席，MongolZ成亚洲独苗",
        desc: "2026年IEM科隆Major已于6月2日在德国拉开帷幕，总奖金高达125万美元。本次赛制迎来重大革新，第三阶段全程BO3。备受瞩目的FaZe Clan因积分不足在资格赛中折戟，这是其队史首次无缘Major正赛；而蒙古战队The MongolZ则成为淘汰赛阶段亚洲赛区的唯一希望。",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80&sig=4",
        date: "2026-06-05",
        tag: "大型赛事",
        isFeatured: false,
        sourceUrl: "https://www.esl-one.com/cs2/iem-cologne-2026/"
    },
    {
        id: 6,
        title: "军事FPS《第三次世界大战》宣布停服：8月3日正式关服，昔日愿景终成遗憾",
        desc: "开发商My.Games今日发布公告，由于玩家活跃度长期处于低位（Steam在线峰值仅49人），决定停止支持《第三次世界大战》（World War 3）。游戏服务器将于2026年8月3日正式关闭，这款曾对标《战地》的免费军事射击游戏就此落幕。",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=500&q=80&sig=5",
        date: "2026-06-03",
        tag: "行业资讯",
        isFeatured: false,
        sourceUrl: "https://www.worldwar3.com/"
    },
    {
        id: 7,
        title: "CS亚洲锦标赛上海开打：GeForce RTX 5080助力，顶尖枪男争夺百万美金",
        desc: "2026 CS Asia Championships今日在上海正式打响，16支国际纵队将争夺100万美元奖池。赛事采用GeForce RTX 5080显卡与610Hz超高刷显示器，配合NVIDIA Reflex技术，将游戏延迟降低42%，为观众呈现顶级的枪法视觉盛宴。",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80&sig=6",
        date: "2026-06-04",
        tag: "电竞赛事",
        isFeatured: false,
        sourceUrl: "https://www.nvidia.com/zh-tw/geforce/news/"
    },
    {
        id: 8,
        title: "战术FPS《Wardogs》反向跳票：开发者坦诚“不指望火”，维持3000玩家就满足",
        desc: "开发商Bulkhead宣布，因其二战题材战术射击游戏《Wardogs》测试反馈积极，将反向跳票提前发售。但官方也坦诚预期极低：“我们只需要3000-5000名核心玩家来维持健康社区”，旨在吸取前作《 Battalion 1944》失败的教训。",
        image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=500&q=80&sig=7",
        date: "2026-06-05",
        tag: "新游资讯",
        isFeatured: false,
        sourceUrl: "https://store.steampowered.com/app/1234560/Wardogs/"
    },
    {
        id: 9,
        title: "《无畏契约》2026无畏巡回计划发布：七大城市联动，打造“潮流+电竞”新模式",
        desc: "拳头游戏发布2026无畏巡回计划，将贯穿全年走进广州、杭州、北京等七大城市。该计划首次将完整的赛事环节落地多城巡回，结合电竞、潮流文化与城市文旅，旨在打造具有长期生命力的城市电竞文化品牌。",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80&sig=8",
        date: "2026-06-02",
        tag: "赛事资讯",
        isFeatured: false,
        sourceUrl: "https://val.qq.com/"
    },
    {
        id: 10,
        title: "《三角洲行动》烽火职业联赛夏季预选赛开启：36支民间战队争夺5个正赛名额",
        desc: "2026烽火职业联赛夏季预选赛将于6月8日打响。在春季赛TES夺得队史首冠后，夏季赛迎来36支民间新锐与主播战队，他们将在三天内通过小组赛与突围赛，争夺仅有的5个夏季正赛直通席位，持续完善FPS电竞生态。",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=500&q=80&sig=9",
        date: "2026-06-05",
        tag: "电竞赛事",
        isFeatured: false,
        sourceUrl: "https://www.playdeltaforce.com/"
    },
    {
        id: 11,
        title: "前Apex选手Axell.退役自白：职业电竞并非黄金大道，退役规划比梦想更残酷",
        desc: "前《Apex英雄》职业选手Axell.发表长文，坦言职业电竞这条路并非外界看到的那么风光。他警告年轻玩家，职业选手薪资低、淘汰率高，且退役后转型直播或主播同样困难重重，如果重来他会选择读书而非打职业。",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80&sig=10",
        date: "2026-06-04",
        tag: "深度探讨",
        isFeatured: false,
        sourceUrl: "https://twitter.com/Axellboy55"
    },
    {
        id: 12,
        title: "《Apex英雄》排位赛地震级改动：钻石及以上段位强制只能单排",
        desc: "重生娱乐宣布将在6月9日至23日进行排位赛测试，期间钻石、大师及猎杀者段位的高分段玩家将被强制只能进行单排。此举旨在防止高玩带妹/带老板上车，创造更公平的高分段对局环境，但在玩家社区中引发了巨大争议。",
        image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=500&q=80&sig=11",
        date: "2026-06-01",
        tag: "游戏机制",
        isFeatured: false,
        sourceUrl: "https://www.ea.com/games/apex-legends"
    },
    {
        id: 13,
        title: "CS2地图池即将洗牌？爆料称Dust2或将被移除，经典图池面临大换血",
        desc: "随着IEM科隆Major的进行，关于Valve将在6月30日调整CS2现役地图池的传闻甚嚣尘上。据分析师预测，作为CS标志性地图的Dust II可能暂时退场，为 newer maps 或重制的Cache让路，这将是竞技环境的又一次巨震。",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80&sig=12",
        date: "2026-06-03",
        tag: "版本爆料",
        isFeatured: false,
        sourceUrl: "https://www.counter-strike.net/"
    },
    {
        id: 14,
        title: "《守望先锋2》即将公布全新玩法？暴雪暗示将在夏日游戏节放出大招",
        desc: "暴雪娱乐发布预告，将在即将到来的夏日游戏节上公布《守望先锋2》的“下一篇章”。社区普遍猜测除了传统的新英雄与地图外，暴雪可能正在酝酿一种区别于现有角色扮演和冲突战的全新核心玩法模式，试图重新争夺市场份额。",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=500&q=80&sig=13",
        date: "2026-06-05",
        tag: "深度爆料",
        isFeatured: false,
        sourceUrl: "https://overwatch.blizzard.com/"
    },
    {
        id: 15,
        title: "《使命召唤：战区》反作弊新规：硬件封禁升级，误封申诉渠道同步开放",
        desc: "Raven Software宣布对《使命召唤：战区》的反作弊系统(Ricochet)进行重大升级。新系统将加强硬件ID封禁力度，严厉打击外挂惯犯。同时，为了应对误封问题，官方同步优化了申诉流程，并承诺提高人工审核的透明度。",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80&sig=14",
        date: "2026-06-02",
        tag: "版本资讯",
        isFeatured: false,
        sourceUrl: "https://www.callofduty.com/warzone"
    }
];

// 🚀 核心控制逻辑：自动解析并上墙渲染
document.addEventListener("DOMContentLoaded", () => {
    // Hide skeleton once real content renders
    var skeleton = document.getElementById("newsSkeleton");
    if (skeleton) skeleton.style.display = "none";

    const featuredContainer = document.getElementById("featuredNewsContainer");
    const regularGrid = document.getElementById("regularNewsGrid");

    if (!featuredContainer || !regularGrid) return;

    // 清空占位壳子
    featuredContainer.innerHTML = "";
    regularGrid.innerHTML = "";

    fpsNewsDatabase.forEach(news => {
        if (news.isFeatured) {
            // 🎬 1. 渲染中国新闻联播式的大头条
            featuredContainer.innerHTML = `
                <div class="featured-card" onclick="window.open('${news.sourceUrl}', '_blank')">
                    <div class="featured-img-wrapper" style="background-image: url('${news.image}')"></div>
                    <div class="featured-info">
                        <span class="news-tag">${news.tag}</span>
                        <h3>${news.title}</h3>
                        <p class="news-desc">${news.desc}</p>
                        <div class="card-footer">
                            <span>📅 发布简报时间：${news.date}</span>
                            <span class="read-more-link">阅读原件 ➜</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 🎴 2. 渲染下方的常规新闻网格卡片
            const card = document.createElement("div");
            card.className = "news-card";
            card.onclick = () => window.open(news.sourceUrl, '_blank');
            card.innerHTML = `
                <div class="card-img-wrapper" style="background-image: url('${news.image}')"></div>
                <div class="card-info">
                    <span class="news-tag" style="background: rgba(255,255,255,0.05); color: #aaa; border: 1px solid rgba(255,255,255,0.1);">${news.tag}</span>
                    <h4>${news.title}</h4>
                    <p class="news-desc">${news.desc}</p>
                    <div class="card-footer">
                        <span>📅 ${news.date}</span>
                        <span class="read-more-link">查看详情 ➜</span>
                    </div>
                </div>
            `;
            regularGrid.appendChild(card);
        }
    });
});