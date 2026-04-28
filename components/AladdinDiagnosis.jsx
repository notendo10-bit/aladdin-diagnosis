import { useState, useEffect, useRef } from "react";

const LANGS = {
  ja: {
    title: "ポストで思想タイプ診断",
    sub: "あなたはどんな偉人タイプ？",
    placeholder: ["ポスト1を貼り付け", "ポスト2を貼り付け", "ポスト3を貼り付け（任意）"],
    diagnoseBtn: "🪄 タイプを診断する",
    diagnosing: "🪄 AIが分析中...",
    spinning: "🎡 タイプを判定中...",
    hint: "12タイプの偉人から判定します",
    inputHint: "Xのポストを貼り付けてください（1〜3件）",
    error: "ポストを1つ以上入力してください",
    yourType: "YOUR TYPE",
    secondType: "次点タイプ",
    salonTitle: "同じタイプの人と議論したい？",
    salonDesc: "現人神アラジンのサロンでは、あなたの思想タイプが表示され、同じ・違うタイプの人と本気のアイデアをぶつけ合えます。🪄",
    salonBtn: "サロンに参加する →",
    shareTitle: "Xでシェアする",
    shareBtn: "Xに投稿する ↗",
    resetBtn: "🪄 もう一度診断する",
    shareText: (name, sub, second) =>
      `私の思想タイプは「${name}」でした🪄\n${sub}${second ? `\n（次点：${second}）` : ""}\n\n#現人神アラジン #思想タイプ診断\nhttps://note.com/genial_ixia5647`,
  },
  en: {
    title: "Diagnose Your Thought Type",
    sub: "Which great thinker are you?",
    placeholder: ["Paste post 1", "Paste post 2", "Paste post 3 (optional)"],
    diagnoseBtn: "🪄 Diagnose My Type",
    diagnosing: "🪄 AI Analyzing...",
    spinning: "🎡 Determining your type...",
    hint: "Matched to 12 great thinker types",
    inputHint: "Paste your X posts (1–3)",
    error: "Please enter at least one post",
    yourType: "YOUR TYPE",
    secondType: "Runner-up",
    salonTitle: "Want to debate with like-minded people?",
    salonDesc: "In the Aladdin Salon, your thought type is displayed and you can clash ideas with people of the same or different types. 🪄",
    salonBtn: "Join the Salon →",
    shareTitle: "Share on X",
    shareBtn: "Post to X ↗",
    resetBtn: "🪄 Diagnose Again",
    shareText: (name, sub, second) =>
      `My thought type is "${name}" 🪄\n${sub}${second ? `\n(Runner-up: ${second})` : ""}\n\n#AladdinGod #ThoughtType\nhttps://note.com/genial_ixia5647`,
  },
  zh: {
    title: "用你的帖子诊断思想类型",
    sub: "你是哪位伟人类型？",
    placeholder: ["粘贴帖子1", "粘贴帖子2", "粘贴帖子3（可选）"],
    diagnoseBtn: "🪄 诊断我的类型",
    diagnosing: "🪄 AI分析中...",
    spinning: "🎡 判定中...",
    hint: "从12种伟人类型中判定",
    inputHint: "请粘贴您的X帖子（1〜3条）",
    error: "请至少输入一条帖子",
    yourType: "你的类型",
    secondType: "次选类型",
    salonTitle: "想与志同道合的人辩论吗？",
    salonDesc: "在阿拉丁沙龙，你的思想类型会被显示，可以与相同或不同类型的人碰撞想法。🪄",
    salonBtn: "加入沙龙 →",
    shareTitle: "分享到X",
    shareBtn: "发布到X ↗",
    resetBtn: "🪄 再次诊断",
    shareText: (name, sub, second) =>
      `我的思想类型是「${name}」🪄\n${sub}${second ? `\n（次选：${second}）` : ""}\n\n#AladdinGod #思想类型\nhttps://note.com/genial_ixia5647`,
  },
  ko: {
    title: "포스트로 사상 유형 진단",
    sub: "당신은 어떤 위인 유형?",
    placeholder: ["포스트 1 붙여넣기", "포스트 2 붙여넣기", "포스트 3 붙여넣기（선택）"],
    diagnoseBtn: "🪄 사상 유형 진단하기",
    diagnosing: "🪄 AI 분석 중...",
    spinning: "🎡 유형 판정 중...",
    hint: "12가지 위인 유형 중 판정",
    inputHint: "X 포스트를 붙여넣으세요（1〜3개）",
    error: "포스트를 하나 이상 입력해주세요",
    yourType: "YOUR TYPE",
    secondType: "차점 유형",
    salonTitle: "같은 유형의 사람과 토론하고 싶나요?",
    salonDesc: "아라딘 살롱에서는 당신의 사상 유형이 표시되고, 같거나 다른 유형의 사람들과 진지한 아이디어를 나눌 수 있습니다. 🪄",
    salonBtn: "살롱 참가하기 →",
    shareTitle: "X에서 공유하기",
    shareBtn: "X에 게시 ↗",
    resetBtn: "🪄 다시 진단하기",
    shareText: (name, sub, second) =>
      `내 사상 유형은 「${name}」이었습니다 🪄\n${sub}${second ? `\n（차점：${second}）` : ""}\n\n#AladdinGod #사상유형\nhttps://note.com/genial_ixia5647`,
  },
};

const TYPES = {
  rousseau:  { name:"ルソー型",         nameEn:"Rousseau",  sub:"自然と自由の革命家",       color:"#2d7a3a", light:"#e8f5e9", desc:"社会の矛盾に怒りを感じ、人間本来の自由と平等を取り戻そうとする。感情と直感を信じ、既存の秩序に疑問を投げかける革命的な魂。", keyword:["自由","平等","自然","革命"], emoji:"🌿" },
  gandhi:    { name:"ガンジー型",       nameEn:"Gandhi",    sub:"非暴力の精神的指導者",     color:"#e65100", light:"#fff3e0", desc:"暴力ではなく魂の力で世界を変えようとする。忍耐と信念を持ち、どんな困難にも精神的な強さで立ち向かう。平和こそが最強の武器だと知っている。", keyword:["非暴力","精神","忍耐","真理"], emoji:"☮️" },
  marx:      { name:"マルクス型",       nameEn:"Marx",      sub:"構造から変える革命思想家", color:"#c62828", light:"#ffebee", desc:"問題の根っこは個人ではなく社会の構造にあると見抜く。格差・不平等・権力の仕組みを鋭く分析し、根本的な変革を求める。", keyword:["構造","格差","変革","平等"], emoji:"✊" },
  nietzsche: { name:"ニーチェ型",       nameEn:"Nietzsche", sub:"価値を打ち壊す超人",       color:"#4a148c", light:"#f3e5f5", desc:"既存の道徳や常識を疑い、自分だけの価値観を創造しようとする。強さと創造性を最も重視し、群衆の価値観に流されない孤高の精神を持つ。", keyword:["超人","創造","力への意志","価値転換"], emoji:"⚡" },
  confucius: { name:"孔子型",           nameEn:"Confucius", sub:"礼と調和の実践者",         color:"#bf360c", light:"#fbe9e7", desc:"人と人の関係を大切にし、礼儀と秩序によって社会を良くしようとする。伝統の中に智慧を見出し、教育と人格の陶冶を最も重要と考える。", keyword:["礼","調和","教育","仁"], emoji:"🏮" },
  socrates:  { name:"ソクラテス型",     nameEn:"Socrates",  sub:"問い続ける対話の哲人",     color:"#1565c0", light:"#e3f2fd", desc:"答えより問いを大切にする。「知らないことを知っている」という姿勢で対話を通じて真理に迫る。人々に考えることを促す産婆術の使い手。", keyword:["問い","対話","無知の知","真理"], emoji:"❓" },
  plato:     { name:"プラトン型",       nameEn:"Plato",     sub:"理想世界を夢見る哲人王",   color:"#00695c", light:"#e0f2f1", desc:"現実の背後に完全な理想の世界があると信じる。現状に妥協せず、あるべき社会の姿を思い描き、知恵ある者が導くべきだという強い信念を持つ。", keyword:["理想","哲人王","イデア","正義"], emoji:"👑" },
  aristotle: { name:"アリストテレス型", nameEn:"Aristotle", sub:"中庸と実践の万能学者",     color:"#4e342e", light:"#efebe9", desc:"極端を避け、バランスと中庸を重んじる。理論だけでなく実践を大切にし、あらゆる分野に好奇心を持って探求する。幸福とは徳の実践だと考える。", keyword:["中庸","実践","徳","幸福"], emoji:"⚖️" },
  kant:      { name:"カント型",         nameEn:"Kant",      sub:"普遍的道徳の番人",         color:"#283593", light:"#e8eaf6", desc:"「すべての人に当てはまるルールか？」を常に問う。感情や損得ではなく、義務と理性によって行動する。普遍的な道徳法則を何より大切にする。", keyword:["義務","普遍","理性","道徳"], emoji:"📐" },
  mill:      { name:"ミル型",           nameEn:"Mill",      sub:"最大幸福を追求する自由主義者", color:"#2e7d32", light:"#e8f5e9", desc:"最も多くの人が最も幸せになれる選択を重視する。個人の自由を守りながら社会全体の幸福を最大化しようとする、バランス感覚に優れた実践的思想家。", keyword:["功利","自由","幸福","社会改革"], emoji:"🕊️" },
  darwin:    { name:"ダーウィン型",     nameEn:"Darwin",    sub:"変化と適応の観察者",       color:"#558b2f", light:"#f1f8e9", desc:"世の中は常に変化し、適応したものが生き残ると知っている。固定観念を持たず、観察と証拠を積み重ねて真実に迫る。変化を恐れず、むしろ楽しむ。", keyword:["進化","変化","適応","観察"], emoji:"🔬" },
  buddha:    { name:"ブッダ型",         nameEn:"Buddha",    sub:"悟りと慈悲の覚者",         color:"#f57f17", light:"#fffde7", desc:"苦しみの根源を見つめ、執着を手放すことで真の平和を得ようとする。自分だけでなくすべての存在の幸福を願い、静かな強さで世界と向き合う。", keyword:["慈悲","悟り","無我","平和"], emoji:"🪷" },
};

const TYPE_KEYS = Object.keys(TYPES);

function buildPrompt(posts) {
  const typeList = TYPE_KEYS.map(k => `${k}:${TYPES[k].name}(${TYPES[k].sub})`).join(", ");
  const postsText = posts.map((p, i) => `${i + 1}. ${p}`).join("\n");
  return `You are an expert in philosophy and intellectual history. Analyze the following social media posts to determine which philosophical archetype best matches this person's worldview.

CRITICAL RULES:
- Do NOT default to "marx" just because someone criticizes society or inequality.
- marx = class struggle, means of production, structural capitalism analysis
- rousseau = emotional freedom, nature vs civilization, anti-intellectual passion
- gandhi = nonviolent METHOD as core belief, soul-force over power
- mill = utilitarian calculation, greatest happiness principle, liberty as framework
- Distinguish by TONE and METHOD, not just topic.
- Always provide a "second" type when the person could plausibly be two types.

Posts:
${postsText}

Type list: ${typeList}

Reply ONLY with valid JSON, no markdown fences:
{"type":"key","second":"key or null","reason":"2-3 sentences in the same language as the posts","match":"keyword under 15 chars","score":"high or medium or low"}`;
}

function Roulette({ finalType, onDone }) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const finalIdx = TYPE_KEYS.indexOf(finalType);
    let idx = 0;
    const TOTAL_DURATION = 2200;

    const tick = () => {
      const totalTime = Date.now() - startRef.current;
      const progress = Math.min(totalTime / TOTAL_DURATION, 1);
      let currentSpeed;
      if (progress < 0.5) currentSpeed = 50;
      else if (progress < 0.75) currentSpeed = 100;
      else if (progress < 0.9) currentSpeed = 200;
      else currentSpeed = 350;

      if (progress >= 1) {
        setCurrent(finalIdx);
        setTimeout(() => onDone(), 500);
        return;
      }
      idx = (idx + 1) % TYPE_KEYS.length;
      setCurrent(idx);
      frameRef.current = setTimeout(tick, currentSpeed);
    };

    frameRef.current = setTimeout(tick, 50);
    return () => clearTimeout(frameRef.current);
  }, [finalType, onDone]);

  const t = TYPES[TYPE_KEYS[current]];
  return (
    <div style={{ background: "#06061a", borderRadius: "20px", padding: "2.5rem 1.5rem", textAlign: "center", margin: "1rem", border: "2px solid #FFD700" }}>
      <p style={{ color: "#FFD700", fontSize: "12px", letterSpacing: "3px", margin: "0 0 1.5rem" }}>🎡 ANALYZING...</p>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "1.5rem", margin: "0 auto 1.5rem", border: "0.5px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "8px", lineHeight: 1 }}>{t.emoji}</div>
        <div style={{ color: "#FFD700", fontSize: "18px", fontWeight: "600", margin: "0 0 4px", minHeight: "28px" }}>{t.name}</div>
        <div style={{ color: "#888", fontSize: "12px" }}>{t.sub}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
        {TYPE_KEYS.map((k, i) => (
          <div key={k} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === current ? TYPES[k].color : "rgba(255,255,255,0.15)", transition: "background 0.1s" }}/>
        ))}
      </div>
    </div>
  );
}
function generateShareImage(type, result, lang) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  // 背景
  ctx.fillStyle = "#06061a";
  ctx.fillRect(0, 0, 1080, 1080);

  // 金枠
  ctx.strokeStyle = type.color;
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1000, 1000);

  // 内枠
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 960, 960);

  // 絵文字
  ctx.font = "180px serif";
  ctx.textAlign = "center";
  ctx.fillText(type.emoji, 540, 320);

  // YOUR TYPE
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.letterSpacing = "8px";
  ctx.fillText("YOUR TYPE", 540, 420);

  // タイプ名
  ctx.font = "bold 96px sans-serif";
  ctx.fillStyle = type.color;
  ctx.fillText(type.name, 540, 540);

  // サブ
  ctx.font = "44px sans-serif";
  ctx.fillStyle = "#cccccc";
  ctx.fillText(type.sub, 540, 620);

  // キーワード
  ctx.font = "36px sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.fillText(type.keyword.join("  ·  "), 540, 710);

  // 区切り線
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(140, 760);
  ctx.lineTo(940, 760);
  ctx.stroke();

  // ハッシュタグ
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("#思想タイプ診断  #現人神アラジン", 540, 840);

  // URL
  ctx.font = "28px sans-serif";
  ctx.fillStyle = "#555555";
  ctx.fillText("aladdin-diagnosis.vercel.app", 540, 900);

  // ダウンロード
  const link = document.createElement("a");
  link.download = `aladdin-${type.nameEn.toLowerCase()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
function generateShareImage(type) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#06061a";
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.strokeStyle = type.color;
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 1000, 1000);
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 960, 960);
  ctx.font = "180px serif";
  ctx.textAlign = "center";
  ctx.fillText(type.emoji, 540, 320);
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("YOUR TYPE", 540, 420);
  ctx.font = "bold 96px sans-serif";
  ctx.fillStyle = type.color;
  ctx.fillText(type.name, 540, 540);
  ctx.font = "44px sans-serif";
  ctx.fillStyle = "#cccccc";
  ctx.fillText(type.sub, 540, 620);
  ctx.font = "36px sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.fillText(type.keyword.join("  ·  "), 540, 710);
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(140, 760);
  ctx.lineTo(940, 760);
  ctx.stroke();
  ctx.font = "32px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("#思想タイプ診断  #現人神アラジン", 540, 840);
  ctx.font = "28px sans-serif";
  ctx.fillStyle = "#555555";
  ctx.fillText("aladdin-diagnosis.vercel.app", 540, 900);
  const link = document.createElement("a");
  link.download = `aladdin-${type.nameEn.toLowerCase()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
export default function App() {
  const [posts, setPosts] = useState(["", "", ""]);
  const [result, setResult] = useState(null);
  const [pendingResult, setPendingResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("ja");
  const L = LANGS[lang];

  const updatePost = (i, v) => { const n = [...posts]; n[i] = v; setPosts(n); };
  const validPosts = posts.filter(p => p.trim().length > 0);

  const diagnose = async () => {
    if (validPosts.length === 0) { setError(L.error); return; }
    setError(""); setLoading(true); setResult(null); setPendingResult(null);
    try {
      const prompt = buildPrompt(validPosts);
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");
      const text = data.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON not found");
      const parsed = JSON.parse(jsonMatch[0]);
      if (!TYPES[parsed.type]) parsed.type = TYPE_KEYS[Math.floor(Math.random() * TYPE_KEYS.length)];
      if (parsed.second && !TYPES[parsed.second]) parsed.second = null;
      setLoading(false);
      setPendingResult(parsed);
      setSpinning(true);
    } catch (e) {
      setError("エラーが発生しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  const handleRouletteDone = () => {
    setSpinning(false);
    setResult(pendingResult);
    setPendingResult(null);
  };

  const t = result ? TYPES[result.type] : null;
  const tSecond = result?.second ? TYPES[result.second] : null;
  const shareText = result ? L.shareText(t?.name, t?.sub, tSecond?.name) : "";
  const reset = () => { setResult(null); setPendingResult(null); setSpinning(false); setPosts(["", "", ""]); };

  const langBtns = ["ja", "en", "zh", "ko"];
  const langLabels = { ja: "日本語", en: "English", zh: "中文", ko: "한국어" };

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "0 0 2rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", padding: "10px 12px 0" }}>
        {langBtns.map(l => (
          <button key={l} onClick={() => setLang(l)}
            style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", cursor: "pointer", border: "0.5px solid var(--color-border-secondary)", background: lang === l ? "#06061a" : "none", color: lang === l ? "#FFD700" : "var(--color-text-secondary)", fontWeight: lang === l ? "500" : "400" }}>
            {langLabels[l]}
          </button>
        ))}
      </div>

      {spinning && pendingResult && (
        <div style={{ paddingTop: "1rem" }}>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "13px", textAlign: "center", margin: "0 0 8px" }}>{L.spinning}</p>
          <Roulette finalType={pendingResult.type} onDone={handleRouletteDone} />
        </div>
      )}

      {!result && !spinning && (
        <>
          <div style={{ background: "#06061a", padding: "1.5rem", borderRadius: "0 0 24px 24px", marginBottom: "1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "2rem" }}>🪄</span>
            </div>
            <h1 style={{ color: "#FFD700", textAlign: "center", fontSize: "17px", fontWeight: "500", margin: "0 0 4px" }}>{L.title}</h1>
            <p style={{ color: "#aaa", textAlign: "center", fontSize: "13px", margin: 0 }}>{L.sub}</p>
          </div>

          <div style={{ padding: "0 1rem" }}>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "13px", marginBottom: "12px" }}>
              {L.inputHint}（{validPosts.length}/3）
            </p>
            {posts.map((p, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <textarea
                  value={p}
                  onChange={e => updatePost(i, e.target.value)}
                  placeholder={L.placeholder[i]}
                  style={{ width: "100%", minHeight: "80px", fontSize: "14px", resize: "vertical", padding: "10px", borderRadius: "8px", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
                />
              </div>
            ))}
            {error && <p style={{ color: "var(--color-text-danger)", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
            <button onClick={diagnose} disabled={loading || validPosts.length === 0}
              style={{ width: "100%", padding: "14px", background: loading ? "#333" : "#06061a", color: "#FFD700", border: "2px solid #FFD700", borderRadius: "12px", fontSize: "16px", fontWeight: "500", cursor: loading ? "default" : "pointer" }}>
              {loading ? L.diagnosing : L.diagnoseBtn}
            </button>
            <p style={{ color: "var(--color-text-tertiary)", fontSize: "11px", textAlign: "center", marginTop: "12px" }}>{L.hint}</p>
          </div>
        </>
      )}

      {result && (
        <div style={{ padding: "0 1rem", paddingTop: "1rem" }}>
          <div style={{ background: "#06061a", padding: "1.5rem", borderRadius: "16px", marginBottom: "16px", textAlign: "center", border: `2px solid ${t.color}` }}>
            <p style={{ color: "#aaa", fontSize: "12px", margin: "0 0 12px", letterSpacing: "2px" }}>{L.yourType}</p>
            <div style={{ fontSize: "3.5rem", marginBottom: "8px" }}>{t?.emoji}</div>
            <h2 style={{ color: t?.color, fontSize: "24px", fontWeight: "600", margin: "0 0 4px" }}>{t?.name}</h2>
            <p style={{ color: "#ccc", fontSize: "14px", margin: "0 0 16px" }}>{t?.sub}</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
              {t?.keyword.map(k => (
                <span key={k} style={{ background: t?.light, color: t?.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>{k}</span>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px", textAlign: "left" }}>
              <p style={{ color: "#ddd", fontSize: "13px", lineHeight: "1.7", margin: "0 0 10px" }}>{t?.desc}</p>
              {result.reason && <p style={{ color: "#aaa", fontSize: "12px", lineHeight: "1.6", margin: "0", borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: "10px" }}>📊 {result.reason}</p>}
            </div>
          </div>

          {tSecond && (
            <div style={{ background: "var(--color-background-secondary)", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "12px", border: `0.5px solid ${tSecond.color}55`, display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ fontSize: "2rem", flexShrink: 0 }}>{tSecond.emoji}</div>
              <div>
                <p style={{ color: "var(--color-text-tertiary)", fontSize: "11px", margin: "0 0 2px" }}>{L.secondType}</p>
                <p style={{ color: tSecond.color, fontSize: "15px", fontWeight: "500", margin: "0 0 2px" }}>{tSecond.name}</p>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "12px", margin: 0 }}>{tSecond.sub}</p>
              </div>
            </div>
          )}

          <div style={{ background: "var(--color-background-secondary)", borderRadius: "12px", padding: "1.25rem", marginBottom: "12px", border: "0.5px solid var(--color-border-tertiary)" }}>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "12px", margin: "0 0 8px", fontWeight: "500" }}>{L.salonTitle}</p>
            <p style={{ color: "var(--color-text-primary)", fontSize: "14px", margin: "0 0 12px", lineHeight: "1.6" }}>{L.salonDesc}</p>
            <a href="https://note.com/genial_ixia5647" target="_blank" rel="noreferrer"
              style={{ display: "block", background: "#06061a", color: "#FFD700", padding: "12px", borderRadius: "10px", textAlign: "center", fontSize: "14px", textDecoration: "none", border: "1px solid #FFD700" }}>
              {L.salonBtn}
            </a>
          </div>

          <div style={{ background: "var(--color-background-secondary)", borderRadius: "12px", padding: "1.25rem", marginBottom: "12px", border: "0.5px solid var(--color-border-tertiary)" }}>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "12px", margin: "0 0 8px", fontWeight: "500" }}>{L.shareTitle}</p>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "12px", lineHeight: "1.6", margin: "0 0 10px", whiteSpace: "pre-wrap" }}>{shareText}</p>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer"
              style={{ display: "block", background: "#000", color: "#fff", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "13px", textDecoration: "none" }}>
              {L.shareBtn}
            </a>
          </div>
<button
  onClick={() => generateShareImage(t)}
  style={{ width: "100%", padding: "12px", background: "#FFD700", border: "none", borderRadius: "10px", color: "#06061a", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginBottom: "10px" }}
>
  📸 シェア画像を保存する
</button>

          <button onClick={reset} style={{ width: "100%", padding: "12px", background: "none", border: "0.5px solid var(--color-border-secondary)", borderRadius: "10px", color: "var(--color-text-secondary)", fontSize: "14px", cursor: "pointer" }}>
            {L.resetBtn}
          </button>
        </div>
      )}
    </div>
  );
}