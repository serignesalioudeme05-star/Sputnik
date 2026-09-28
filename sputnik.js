import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const PAGE = "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<title>SPUTNIK</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link href=\"https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap\" rel=\"stylesheet\">\n<style>\n  :root{\n    --red:#C81E1E; --ink:#111111; --cream:#F2EEE6; --gold:#C9A54A; --steel:#7C7F82;\n    box-sizing:border-box; padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px);\n  }\n  *{box-sizing:border-box;}\n  html{scroll-padding-top:env(safe-area-inset-top,0px);}\n  html,body{height:100%; margin:0;}\n  body{\n    background:var(--cream); color:var(--ink); font-family:'IBM Plex Sans',sans-serif;\n    display:flex; flex-direction:column; overflow:hidden;\n  }\n  .header{\n    padding:calc(14px + env(safe-area-inset-top,0px)) 18px 12px;\n    background:var(--ink); color:var(--cream); display:flex; align-items:center; gap:10px;\n    border-bottom:4px solid var(--red);\n  }\n  .logo{\n    width:30px;height:30px; border-radius:50%; border:3px solid var(--red);\n    position:relative; flex-shrink:0;\n  }\n  .logo::after{\n    content:''; position:absolute; width:44px; height:2px; background:var(--gold);\n    top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg);\n  }\n  .wordmark{font-family:'Oswald',sans-serif; font-weight:700; font-size:22px; letter-spacing:1px;}\n  .wordmark span{color:var(--red);}\n  main{flex:1; overflow-y:auto; padding:16px 16px 90px;}\n  .screen{display:none;}\n  .screen.active{display:block; animation:fade .25s ease;}\n  @keyframes fade{from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:translateY(0);}}\n\n  h1{font-family:'Oswald',sans-serif; font-size:26px; margin:4px 0 4px; font-weight:700;}\n  .sub{color:var(--steel); font-size:14px; margin-bottom:18px;}\n\n  /* CHAT */\n  .bubble{max-width:80%; padding:10px 14px; border-radius:14px; margin-bottom:10px; font-size:15px; line-height:1.4;}\n  .bubble.user{background:var(--ink); color:var(--cream); margin-left:auto; border-bottom-right-radius:3px;}\n  .bubble.ai{background:#fff; border:1px solid #e3ddcf; margin-right:auto; border-bottom-left-radius:3px;}\n\n  /* IMAGE */\n  .grid{display:grid; grid-template-columns:1fr 1fr; gap:10px;}\n  .tile{aspect-ratio:1; border-radius:8px; background:linear-gradient(135deg,var(--red),var(--ink)); position:relative; overflow:hidden;}\n  .tile:nth-child(2){background:linear-gradient(135deg,var(--gold),var(--ink));}\n  .tile:nth-child(3){background:linear-gradient(135deg,var(--steel),var(--ink));}\n  .tile:nth-child(4){background:linear-gradient(135deg,var(--ink),var(--red));}\n  .tile::after{content:'';position:absolute; inset:0; background:repeating-linear-gradient(45deg,rgba(255,255,255,.06) 0 2px, transparent 2px 8px);}\n\n  /* CODE */\n  .code-box{background:var(--ink); color:#d9d4c4; border-radius:10px; padding:14px; font-family:monospace; font-size:13px; line-height:1.6; overflow-x:auto;}\n  .code-box .c1{color:var(--gold);} .code-box .c2{color:#8fd18f;} .code-box .c3{color:var(--red);}\n\n  /* VOICE */\n  .voice-wrap{display:flex; flex-direction:column; align-items:center; margin-top:40px;}\n  .mic{\n    width:88px;height:88px; border-radius:50%; background:var(--red); display:flex; align-items:center; justify-content:center;\n    box-shadow:0 0 0 8px rgba(200,30,30,.15);\n  }\n  .mic::after{content:''; width:26px; height:38px; border-radius:14px; background:var(--cream);}\n  .wave{display:flex; gap:4px; align-items:flex-end; height:40px; margin-top:26px;}\n  .wave span{width:4px; background:var(--ink); border-radius:2px; animation:bar 1.1s ease-in-out infinite;}\n  .wave span:nth-child(1){height:12px; animation-delay:0s;}\n  .wave span:nth-child(2){height:28px; animation-delay:.1s;}\n  .wave span:nth-child(3){height:40px; animation-delay:.2s;}\n  .wave span:nth-child(4){height:20px; animation-delay:.3s;}\n  .wave span:nth-child(5){height:32px; animation-delay:.4s;}\n  .wave span:nth-child(6){height:14px; animation-delay:.5s;}\n  @keyframes bar{0%,100%{transform:scaleY(.4);} 50%{transform:scaleY(1);}}\n\n  .inputbar{\n    position:fixed; bottom:64px; left:0; right:0; padding:0 16px;\n  }\n  .inputbar input{\n    width:100%; padding:12px 16px; border-radius:24px; border:1px solid #ddd5c2; background:#fff; font-size:15px;\n  }\n\n  nav{\n    position:fixed; bottom:0; left:0; right:0; background:var(--ink); display:flex;\n    padding-bottom:env(safe-area-inset-bottom,0px); border-top:2px solid var(--red);\n  }\n  nav button{\n    flex:1; background:none; border:none; color:#8a8a8a; padding:12px 4px 10px; font-family:'Oswald',sans-serif;\n    font-size:11px; letter-spacing:.5px; display:flex; flex-direction:column; align-items:center; gap:5px;\n  }\n  nav button .dot{width:8px;height:8px;border-radius:50%; background:#8a8a8a;}\n  nav button.active{color:var(--cream);}\n  nav button.active .dot{background:var(--red);}\n\n  :root:not([data-theme=\"light\"]) { }\n  @media (prefers-color-scheme: dark){\n    :root:not([data-theme=\"light\"]){ }\n  }\n\n  .inputbar{display:flex;gap:8px;align-items:center}\n  .inputbar input{flex:1;min-width:0}\n  #go{background:var(--red);color:#fff;border:0;border-radius:10px;font-size:20px;padding:10px 16px}\n  #codelog .code-box{white-space:pre-wrap;margin-bottom:10px}\n  #imglog .tile img{width:100%;height:100%;object-fit:cover;border-radius:inherit}\n  .bubble{white-space:pre-wrap}\n</style>\n</head>\n<body>\n\n<div class=\"header\">\n  <div class=\"logo\"></div>\n  <div class=\"wordmark\">SPU<span>TNIK</span></div>\n</div>\n\n<main>\n  <section class=\"screen active\" id=\"chat\">\n    <h1>Texte</h1>\n    <div class=\"sub\">Un compagnon pour \u00e9crire, r\u00e9fl\u00e9chir, d\u00e9cider.</div>\n    <div id=\"chatlog\"></div>\n  </section>\n\n  <section class=\"screen\" id=\"image\">\n    <h1>Image</h1>\n    <div class=\"sub\">D\u00e9cris, g\u00e9n\u00e8re, affine.</div>\n    <div class=\"grid\" id=\"imglog\"></div>\n  </section>\n\n  <section class=\"screen\" id=\"code\">\n    <h1>Code</h1>\n    <div class=\"sub\">De l'id\u00e9e au script qui tourne.</div>\n    <div id=\"codelog\"></div>\n  </section>\n\n  <section class=\"screen\" id=\"voice\">\n    <h1>Voix</h1>\n    <div class=\"sub\">Parle, on s'occupe du reste.</div>\n    <div class=\"voice-wrap\">\n      <div class=\"mic\" id=\"mic\"></div>\n      <div id=\"voicelog\"></div>\n      <div class=\"wave\"><span></span><span></span><span></span><span></span><span></span><span></span></div>\n    </div>\n  </section>\n</main>\n\n<div class=\"inputbar\"><input id=\"msg\" type=\"text\" placeholder=\"\u00c9cris \u00e0 SPUTNIK\u2026\" enterkeyhint=\"send\"><button id=\"go\">\u2192</button></div>\n\n<nav>\n  <button class=\"active\" data-target=\"chat\"><span class=\"dot\"></span>TEXTE</button>\n  <button data-target=\"image\"><span class=\"dot\"></span>IMAGE</button>\n  <button data-target=\"code\"><span class=\"dot\"></span>CODE</button>\n  <button data-target=\"voice\"><span class=\"dot\"></span>VOIX</button>\n</nav>\n\n<script>\n  document.querySelectorAll('nav button').forEach(btn=>{\n    btn.addEventListener('click',()=>{\n      document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));\n      document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));\n      btn.classList.add('active');\n      document.getElementById(btn.dataset.target).classList.add('active');\n    });\n  });\n  const API=location.hostname.endsWith('onrender.com')?'':'https://sputnik-server.onrender.com';\n  const $=id=>document.getElementById(id), hist={chat:[],code:[]};\n  async function post(p,b){\n    const r=await fetch(API+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});\n    const d=await r.json(); if(!r.ok) throw new Error(d.error||'Erreur'); return d;\n  }\n  function add(box,cls,txt){const d=document.createElement('div');d.className=cls;d.textContent=txt;box.appendChild(d);d.scrollIntoView({block:'end'});return d;}\n  async function ask(kind,text,box,cls){\n    add(box,'bubble user',text); const w=add(box,cls,'\u2026');\n    try{\n      const d=await post('/api/'+kind,{message:text,history:hist[kind]});\n      hist[kind].push({role:'user',content:text},{role:'assistant',content:d.reply});\n      w.textContent=d.reply; return d.reply;\n    }catch(e){w.textContent='Erreur : '+e.message;}\n  }\n  async function send(){\n    const t=$('msg').value.trim(); if(!t) return; $('msg').value='';\n    const tab=document.querySelector('.screen.active').id;\n    if(tab==='code'){ const w=add($('codelog'),'code-box','\u2026');\n      try{const d=await post('/api/code',{message:t,history:hist.code});\n        hist.code.push({role:'user',content:t},{role:'assistant',content:d.reply}); w.textContent=d.reply;}\n      catch(e){w.textContent='Erreur : '+e.message;} }\n    else if(tab==='image'){ const tile=document.createElement('div');tile.className='tile';tile.textContent='\u2026';$('imglog').prepend(tile);\n      try{const d=await post('/api/image',{prompt:t}); tile.textContent='';\n        const i=new Image(); i.src='data:image/png;base64,'+d.image_base64; tile.appendChild(i);}\n      catch(e){tile.textContent='Erreur';alert(e.message);} }\n    else if(tab==='voice'){ const a=await ask('chat',t,$('voicelog'),'bubble ai');\n      if(a&&window.speechSynthesis){const u=new SpeechSynthesisUtterance(a);u.lang='fr-FR';speechSynthesis.speak(u);} }\n    else ask('chat',t,$('chatlog'),'bubble ai');\n  }\n  $('go').onclick=send; $('msg').addEventListener('keydown',e=>{if(e.key==='Enter')send();});\n  $('mic').onclick=()=>{\n    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;\n    if(!SR) return alert('Micro non support\u00e9 sur ce navigateur.');\n    const r=new SR(); r.lang='fr-FR';\n    r.onresult=e=>{$('msg').value=e.results[0][0].transcript; send();};\n    r.start();\n  };\n</script>\n</body>\n</html>\n";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 3000;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const CLAUDE_MODEL = "claude-sonnet-5";

// ---- Vérification de santé (utile pour Render/Railway) ----
app.get("/", (req, res) => {
  res.type("html").send(PAGE);
});
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "sputnik-server" });
});

// ---- Fonction commune : appelle Claude (texte ou code) ----
async function askClaude({ systemPrompt, history, message }) {
  if (!ANTHROPIC_KEY) {
    throw new Error("ANTHROPIC_API_KEY manquante dans le fichier .env");
  }

  const messages = [
    ...(history || []).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erreur API Anthropic (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textBlock = data.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}

// ---- Onglet TEXTE ----
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Champ 'message' requis" });

    const reply = await askClaude({
      systemPrompt: "Tu es SPUTNIK, un assistant IA clair, direct et utile. Réponds en français sauf si on te parle dans une autre langue.",
      history,
      message,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Onglet CODE ----
app.post("/api/code", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Champ 'message' requis" });

    const reply = await askClaude({
      systemPrompt: "Tu es SPUTNIK Code. Tu écris du code propre et fonctionnel, avec de brèves explications. Privilégie des exemples complets et exécutables.",
      history,
      message,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Onglet IMAGE (via OpenAI Images) ----
app.post("/api/image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Champ 'prompt' requis" });
    if (!OPENAI_KEY) {
      return res.status(400).json({
        error: "OPENAI_API_KEY manquante. Ajoute une clé OpenAI dans le fichier .env pour activer la génération d'images.",
      });
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        n: 1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erreur API OpenAI (${response.status}): ${errText}`);
    }

    const data = await response.json();
    res.json({ image_base64: data.data[0].b64_json });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Onglet VOIX : pas besoin de serveur ----
// La transcription voix -> texte et la synthèse texte -> voix peuvent se faire
// gratuitement, directement dans le navigateur, avec la Web Speech API.
// Une fois le texte transcrit côté app, il suffit de l'envoyer à /api/chat.

app.listen(PORT, () => {
  console.log(`Serveur SPUTNIK lancé sur le port ${PORT}`);
});
