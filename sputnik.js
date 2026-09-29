import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const PAGE_TEMPLATE = "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<title>SPUTNIK</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link href=\"https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap\" rel=\"stylesheet\">\n<style>\n  :root{\n    --red:#C81E1E; --ink:#111111; --cream:#F2EEE6; --gold:#C9A54A; --steel:#7C7F82;\n    box-sizing:border-box; padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px);\n  }\n  *{box-sizing:border-box;}\n  html{scroll-padding-top:env(safe-area-inset-top,0px);}\n  html,body{height:100%; margin:0;}\n  body{ background:var(--cream); color:var(--ink); font-family:'IBM Plex Sans',sans-serif; display:flex; flex-direction:column; overflow:hidden; }\n  .header{ padding:calc(14px + env(safe-area-inset-top,0px)) 18px 12px; background:var(--ink); color:var(--cream); display:flex; align-items:center; gap:10px; border-bottom:4px solid var(--red); }\n  .logo{ width:30px;height:30px; border-radius:50%; border:3px solid var(--red); position:relative; flex-shrink:0; }\n  .logo::after{ content:''; position:absolute; width:44px; height:2px; background:var(--gold); top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); }\n  .wordmark{font-family:'Oswald',sans-serif; font-weight:700; font-size:22px; letter-spacing:1px;}\n  .wordmark span{color:var(--red);}\n  main{flex:1; overflow-y:auto; padding:16px 16px 32px;}\n  .screen{display:none;}\n  .screen.active{display:block; animation:fade .25s ease;}\n  @keyframes fade{from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:translateY(0);}}\n  h1{font-family:'Oswald',sans-serif; font-size:24px; margin:4px 0 4px; font-weight:700;}\n  .sub{color:var(--steel); font-size:14px; margin-bottom:18px;}\n\n  .group{margin-bottom:22px;}\n  .group h2{font-family:'Oswald',sans-serif; font-size:14px; letter-spacing:.5px; color:var(--steel); text-transform:uppercase; margin:0 0 10px;}\n  .toolbtn{display:block; width:100%; text-align:left; padding:14px 16px; margin-bottom:8px; border:1px solid #ddd5c2; border-radius:12px; background:#fff; font:inherit; font-size:15px; color:var(--ink);}\n  .toolbtn:active{background:#eee7d6;}\n  .soon{color:var(--steel); font-size:13px; padding:4px 0 10px;}\n  .backbtn{background:none; border:none; color:var(--red); font:inherit; font-weight:600; padding:0 0 14px; font-size:15px;}\n\n  .mform{display:flex; flex-direction:column; gap:8px; margin-bottom:14px;}\n  .mform input, .mform select, .mform textarea{padding:10px 12px; border:1px solid #ddd5c2; border-radius:10px; font:inherit; background:#fff;}\n  .gobtn{background:var(--red); color:#fff; border:0; border-radius:10px; padding:12px; font-weight:600; font:inherit; margin-top:4px;}\n  .copybtn{background:none; border:1px solid var(--ink); color:var(--ink); border-radius:10px; padding:10px; font:inherit; margin-top:6px;}\n  .result{background:#fff; border:1px solid #e3ddcf; border-radius:12px; padding:12px 14px; margin:10px 0; font-size:15px; line-height:1.4; white-space:pre-wrap; display:none;}\n  .infobox{background:#fff; border:1px solid #e3ddcf; border-radius:12px; padding:12px 14px; margin:0 0 14px; font-size:14px; line-height:1.6; white-space:pre-line;}\n\n  .crow{display:flex; justify-content:space-between; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid #eee2d0; font-size:14px;}\n  .crow span{flex:1;}\n  .crow button{background:none; border:none; color:var(--red); font-size:16px; padding:2px 6px;}\n  #ctotals{margin-top:10px; font-weight:600; font-size:14px;}\n</style>\n</head>\n<body>\n\n<div class=\"header\">\n  <div class=\"logo\"></div>\n  <div class=\"wordmark\">SPU<span>TNIK</span></div>\n</div>\n\n<main>\n  <section class=\"screen active\" id=\"home\">\n    <h1>Outils</h1>\n    <div class=\"sub\">Pour vendre et gérer ton commerce sur WhatsApp.</div>\n\n    <div class=\"group\">\n      <h2>Vendre &amp; se faire connaître</h2>\n      <button class=\"toolbtn\" data-tool=\"messages\">✉️ Messages &amp; annonces clients</button>\n      <button class=\"toolbtn\" data-tool=\"produit\">🛍️ Fiche produit en ligne</button>\n      <button class=\"toolbtn\" data-tool=\"statut\">📣 Statut WhatsApp publicitaire</button>\n      <button class=\"toolbtn\" data-tool=\"visibilite\">📈 Idées de publication</button>\n      <button class=\"toolbtn\" data-tool=\"faq\">❓ Réponses rapides (FAQ)</button>\n      <button class=\"toolbtn\" data-tool=\"traduction\">🌍 Traduction rapide</button>\n    </div>\n\n    <div class=\"group\">\n      <h2>Gérer mon commerce</h2>\n      <button class=\"toolbtn\" data-tool=\"comptes\">🧮 Comptes du jour</button>\n      <button class=\"toolbtn\" data-tool=\"marge\">💰 Calcul de marge &amp; prix</button>\n      <button class=\"toolbtn\" data-tool=\"recu\">🧾 Reçu pour le client</button>\n      <button class=\"toolbtn\" data-tool=\"impayes\">⏳ Suivi des impayés</button>\n    </div>\n\n    <div class=\"group\">\n      <h2>Mon compte</h2>\n      <div id=\"premstatus\" class=\"soon\"></div>\n      <button class=\"toolbtn\" data-tool=\"premium\">🔓 Débloquer l'accès illimité</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"messages\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Messages &amp; annonces</h1>\n    <div class=\"sub\">Des messages prêts à copier pour vos clients.</div>\n    <div class=\"mform\">\n      <select id=\"mtype\">\n        <option>Annonce de produit</option>\n        <option>Message aux clients</option>\n        <option>Réponse à une réclamation</option>\n        <option>Promotion</option>\n        <option>Relance d'un client</option>\n        <option>Fidélité ou parrainage</option>\n      </select>\n      <input id=\"mprod\" placeholder=\"Produit ou service\">\n      <input id=\"mprix\" placeholder=\"Prix (ex : 5 000 FCFA)\">\n      <select id=\"mton\"><option>Amical</option><option>Sérieux</option><option>Urgent</option></select>\n      <textarea id=\"mdet\" rows=\"2\" placeholder=\"Détails (facultatif)\"></textarea>\n      <button id=\"mgo\" class=\"gobtn\">Générer le message</button>\n      <div id=\"mres\" class=\"result\"></div>\n      <button id=\"mcopy\" class=\"copybtn\" style=\"display:none\">Copier</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"produit\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Fiche produit en ligne</h1>\n    <div class=\"sub\">Un texte prêt à publier sur Marketplace, Jumia ou WhatsApp.</div>\n    <div class=\"mform\">\n      <input id=\"pprod\" placeholder=\"Produit ou service\">\n      <input id=\"pprix\" placeholder=\"Prix (ex : 15 000 FCFA)\">\n      <textarea id=\"ppts\" rows=\"2\" placeholder=\"Points forts (qualité, livraison...)\"></textarea>\n      <select id=\"pplat\"><option>Facebook Marketplace</option><option>Jumia</option><option>Catalogue WhatsApp</option><option>Toutes plateformes</option></select>\n      <button id=\"pgo\" class=\"gobtn\">Générer la fiche</button>\n      <div id=\"pres\" class=\"result\"></div>\n      <button id=\"pcopy\" class=\"copybtn\" style=\"display:none\">Copier</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"statut\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Statut WhatsApp publicitaire</h1>\n    <div class=\"sub\">Des statuts courts et accrocheurs.</div>\n    <div class=\"mform\">\n      <input id=\"sprod\" placeholder=\"Produit ou service\">\n      <input id=\"sprix\" placeholder=\"Prix (ex : 5 000 FCFA)\">\n      <select id=\"socc\"><option>Nouveauté</option><option>Promotion</option><option>Stock limité</option><option>Rappel</option></select>\n      <button id=\"sgo\" class=\"gobtn\">Générer les statuts</button>\n      <div id=\"sres\" class=\"result\"></div>\n      <button id=\"scopy\" class=\"copybtn\" style=\"display:none\">Copier</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"visibilite\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Idées de publication</h1>\n    <div class=\"sub\">Une semaine d'idées pour te faire connaître.</div>\n    <div class=\"mform\">\n      <input id=\"vtype\" placeholder=\"Ton activité (ex : salon de coiffure)\">\n      <button id=\"vgo\" class=\"gobtn\">Générer les idées</button>\n      <div id=\"vres\" class=\"result\"></div>\n      <button id=\"vcopy\" class=\"copybtn\" style=\"display:none\">Copier</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"faq\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Réponses rapides (FAQ)</h1>\n    <div class=\"sub\">Des réponses prêtes pour les questions fréquentes de tes clients.</div>\n    <div class=\"mform\">\n      <textarea id=\"finfos\" rows=\"4\" placeholder=\"Infos sur ton commerce : horaires, zones de livraison, moyens de paiement, adresse...\"></textarea>\n      <button id=\"fgo\" class=\"gobtn\">Générer les réponses</button>\n      <div id=\"fres\" class=\"result\"></div>\n      <button id=\"fcopy\" class=\"copybtn\" style=\"display:none\">Copier</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"traduction\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Traduction rapide</h1>\n    <div class=\"sub\">Pour répondre à un client dans sa langue.</div>\n    <div class=\"mform\">\n      <textarea id=\"ttexte\" rows=\"3\" placeholder=\"Texte à traduire\"></textarea>\n      <select id=\"tlangue\"><option>Wolof</option><option>Anglais</option><option>Pulaar</option><option>Autre langue locale</option></select>\n      <button id=\"tgo\" class=\"gobtn\">Traduire</button>\n      <div id=\"tres\" class=\"result\"></div>\n      <button id=\"tcopy\" class=\"copybtn\" style=\"display:none\">Copier</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"comptes\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Comptes du jour</h1>\n    <div class=\"sub\">Note tes entrées et dépenses. Gardé sur ce téléphone.</div>\n    <div class=\"mform\">\n      <select id=\"ctype\"><option value=\"entree\">Entrée (vente)</option><option value=\"depense\">Dépense</option></select>\n      <input id=\"clib\" placeholder=\"Libellé (ex : vente robe)\">\n      <input id=\"cmontant\" type=\"number\" placeholder=\"Montant en FCFA\">\n      <button id=\"cadd\" class=\"gobtn\">Ajouter</button>\n    </div>\n    <div id=\"clist\"></div>\n    <div id=\"ctotals\"></div>\n    <button id=\"creset\" class=\"copybtn\" style=\"margin-top:14px\">Réinitialiser la journée</button>\n  </section>\n\n  <section class=\"screen\" id=\"marge\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Calcul de marge &amp; prix</h1>\n    <div class=\"sub\">Trouve ton prix de vente et ton bénéfice, instantanément.</div>\n    <div class=\"mform\">\n      <input id=\"gachat\" type=\"number\" placeholder=\"Prix d'achat (FCFA)\">\n      <input id=\"gfrais\" type=\"number\" placeholder=\"Frais, transport (FCFA, facultatif)\">\n      <input id=\"gmarge\" type=\"number\" placeholder=\"Marge souhaitée (%)\">\n      <button id=\"ggo\" class=\"gobtn\">Calculer</button>\n      <div id=\"gres\" class=\"result\"></div>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"recu\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Reçu pour le client</h1>\n    <div class=\"sub\">Un reçu propre à envoyer sur WhatsApp.</div>\n    <div class=\"mform\">\n      <input id=\"rboutique\" placeholder=\"Nom de ton commerce\">\n      <input id=\"rclient\" placeholder=\"Nom du client (facultatif)\">\n      <textarea id=\"rarticles\" rows=\"3\" placeholder=\"Articles (un par ligne)\"></textarea>\n      <input id=\"rtotal\" type=\"number\" placeholder=\"Total (FCFA)\">\n      <select id=\"rpaiement\"><option>Espèces</option><option>Wave</option><option>Orange Money</option></select>\n      <button id=\"rgo\" class=\"gobtn\">Générer le reçu</button>\n      <div id=\"rres\" class=\"result\"></div>\n      <button id=\"rcopy\" class=\"copybtn\" style=\"display:none\">Copier</button>\n    </div>\n  </section>\n\n  <section class=\"screen\" id=\"impayes\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Suivi des impayés</h1>\n    <div class=\"sub\">Note qui te doit de l'argent. Le bouton 💬 copie un rappel prêt à envoyer.</div>\n    <div class=\"mform\">\n      <input id=\"ilib\" placeholder=\"Nom du client\">\n      <input id=\"imontant\" type=\"number\" placeholder=\"Montant dû (FCFA)\">\n      <button id=\"iadd\" class=\"gobtn\">Ajouter</button>\n    </div>\n    <div id=\"ilist\"></div>\n  </section>\n\n  <section class=\"screen\" id=\"premium\">\n    <button class=\"backbtn\">← Outils</button>\n    <h1>Accès illimité</h1>\n    <div class=\"sub\">5 messages gratuits par jour sur les outils IA. Pour un accès illimité pendant 30 jours :</div>\n    <div class=\"infobox\">1. Envoie ton paiement via Wave au __WAVE__.\n2. Envoie la capture sur WhatsApp au __WHATSAPP__.\n3. Tu recevras un code à entrer ici.</div>\n    <div class=\"mform\">\n      <input id=\"codeinput\" placeholder=\"Ton code\">\n      <button id=\"codego\" class=\"gobtn\">Valider le code</button>\n      <div id=\"coderes\" class=\"result\"></div>\n    </div>\n  </section>\n</main>\n\n<script>\n  const API = location.hostname.endsWith('onrender.com') ? '' : 'https://sputnik-server.onrender.com';\n  const $ = id => document.getElementById(id);\n\n  async function post(p, b) {\n    const r = await fetch(API + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) });\n    const d = await r.json();\n    if (!r.ok) throw new Error(d.error || 'Erreur');\n    return d;\n  }\n\n  function showScreen(id) {\n    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));\n    $(id).classList.add('active');\n  }\n  document.querySelectorAll('.toolbtn').forEach(b => b.onclick = () => showScreen(b.dataset.tool));\n  document.querySelectorAll('.backbtn').forEach(b => b.onclick = () => showScreen('home'));\n\n  // ---- Accès gratuit / illimité ----\n  const FREE_LIMIT = 5;\n  function todayStr() { return new Date().toISOString().slice(0, 10); }\n  function getUsage() {\n    try { const d = JSON.parse(localStorage.getItem('sputnik_usage') || '{}'); return d.date === todayStr() ? d : { date: todayStr(), count: 0 }; }\n    catch (e) { return { date: todayStr(), count: 0 }; }\n  }\n  function bumpUsage() { const u = getUsage(); u.count++; try { localStorage.setItem('sputnik_usage', JSON.stringify(u)); } catch (e) {} }\n  function isUnlocked() {\n    try { const p = JSON.parse(localStorage.getItem('sputnik_premium') || 'null'); return !!(p && p.until && Date.now() < p.until); }\n    catch (e) { return false; }\n  }\n  function remaining() { return Math.max(0, FREE_LIMIT - getUsage().count); }\n  function updatePremStatus() {\n    $('premstatus').textContent = isUnlocked() ? \"✅ Accès illimité actif\" : (\"Il te reste \" + remaining() + \" message(s) gratuit(s) aujourd'hui\");\n  }\n  updatePremStatus();\n\n  async function runTool(apiPath, payload, resId, copyId, btn) {\n    if (!isUnlocked() && remaining() <= 0) { showScreen('premium'); return; }\n    const label = btn.textContent; btn.disabled = true; btn.textContent = '…';\n    const res = $(resId), copy = $(copyId);\n    try {\n      const d = await post(apiPath, payload);\n      res.textContent = d.reply; res.style.display = 'block'; copy.style.display = 'block';\n      if (!isUnlocked()) { bumpUsage(); updatePremStatus(); }\n    } catch (e) {\n      res.textContent = 'Erreur : ' + e.message; res.style.display = 'block';\n    }\n    btn.disabled = false; btn.textContent = label;\n  }\n  function wireCopy(copyId, resId) {\n    $(copyId).onclick = () => {\n      navigator.clipboard.writeText($(resId).textContent);\n      $(copyId).textContent = 'Copié'; setTimeout(() => $(copyId).textContent = 'Copier', 1500);\n    };\n  }\n\n  $('mgo').onclick = () => runTool('/api/commercant', { type: $('mtype').value, produit: $('mprod').value, prix: $('mprix').value, ton: $('mton').value, details: $('mdet').value }, 'mres', 'mcopy', $('mgo'));\n  wireCopy('mcopy', 'mres');\n\n  $('pgo').onclick = () => runTool('/api/produit', { produit: $('pprod').value, prix: $('pprix').value, points: $('ppts').value, plateforme: $('pplat').value }, 'pres', 'pcopy', $('pgo'));\n  wireCopy('pcopy', 'pres');\n\n  $('sgo').onclick = () => runTool('/api/statut', { produit: $('sprod').value, prix: $('sprix').value, occasion: $('socc').value }, 'sres', 'scopy', $('sgo'));\n  wireCopy('scopy', 'sres');\n\n  $('vgo').onclick = () => runTool('/api/visibilite', { activite: $('vtype').value }, 'vres', 'vcopy', $('vgo'));\n  wireCopy('vcopy', 'vres');\n\n  $('finfos').value = localStorage.getItem('sputnik_infos') || '';\n  $('fgo').onclick = () => {\n    try { localStorage.setItem('sputnik_infos', $('finfos').value); } catch (e) {}\n    runTool('/api/faq', { infos: $('finfos').value }, 'fres', 'fcopy', $('fgo'));\n  };\n  wireCopy('fcopy', 'fres');\n\n  $('tgo').onclick = () => runTool('/api/traduire', { texte: $('ttexte').value, langue: $('tlangue').value }, 'tres', 'tcopy', $('tgo'));\n  wireCopy('tcopy', 'tres');\n\n  function loadComptes() { try { return JSON.parse(localStorage.getItem('sputnik_comptes') || '[]'); } catch (e) { return []; } }\n  function saveComptes(d) { try { localStorage.setItem('sputnik_comptes', JSON.stringify(d)); } catch (e) {} }\n  function renderComptes() {\n    const data = loadComptes(); const list = $('clist'); list.innerHTML = ''; let te = 0, td = 0;\n    data.forEach((it, i) => {\n      const row = document.createElement('div'); row.className = 'crow';\n      const span = document.createElement('span'); span.textContent = (it.type === 'entree' ? '➕ ' : '➖ ') + it.libelle + ' — ' + it.montant + ' FCFA';\n      const del = document.createElement('button'); del.textContent = '✕';\n      del.onclick = () => { const d = loadComptes(); d.splice(i, 1); saveComptes(d); renderComptes(); };\n      row.appendChild(span); row.appendChild(del); list.appendChild(row);\n      if (it.type === 'entree') te += it.montant; else td += it.montant;\n    });\n    $('ctotals').textContent = 'Entrées : ' + te + ' FCFA · Dépenses : ' + td + ' FCFA · Bénéfice : ' + (te - td) + ' FCFA';\n  }\n  $('cadd').onclick = () => {\n    const type = $('ctype').value, lib = $('clib').value.trim(), montant = parseFloat($('cmontant').value);\n    if (!lib || !montant) return;\n    const d = loadComptes(); d.push({ type, libelle: lib, montant }); saveComptes(d);\n    $('clib').value = ''; $('cmontant').value = ''; renderComptes();\n  };\n  $('creset').onclick = () => { if (confirm('Effacer toute la journée ?')) { saveComptes([]); renderComptes(); } };\n  renderComptes();\n\n  $('ggo').onclick = () => {\n    const achat = parseFloat($('gachat').value) || 0;\n    const frais = parseFloat($('gfrais').value) || 0;\n    const marge = parseFloat($('gmarge').value) || 0;\n    const cout = achat + frais;\n    const prixVente = Math.round(cout * (1 + marge / 100));\n    const benefice = prixVente - cout;\n    $('gres').textContent = 'Prix de vente conseillé : ' + prixVente + ' FCFA\\nBénéfice par unité : ' + benefice + ' FCFA';\n    $('gres').style.display = 'block';\n  };\n\n  $('rboutique').value = localStorage.getItem('sputnik_boutique') || '';\n  $('rgo').onclick = () => {\n    try { localStorage.setItem('sputnik_boutique', $('rboutique').value); } catch (e) {}\n    let num = parseInt(localStorage.getItem('sputnik_recu_num') || '0', 10) + 1;\n    try { localStorage.setItem('sputnik_recu_num', String(num)); } catch (e) {}\n    const boutique = $('rboutique').value.trim() || 'Ma boutique';\n    const client = $('rclient').value.trim() || 'Client';\n    const articles = $('rarticles').value.trim() || '—';\n    const total = $('rtotal').value || '0';\n    const paiement = $('rpaiement').value;\n    const date = new Date().toLocaleDateString('fr-FR');\n    const texte = 'REÇU — ' + boutique + '\\nN° ' + String(num).padStart(6, '0') + ' · ' + date + '\\nClient : ' + client + '\\n—\\n' + articles + '\\n—\\nTotal : ' + total + ' FCFA\\nPaiement : ' + paiement + '\\nMerci de votre confiance !';\n    $('rres').textContent = texte; $('rres').style.display = 'block'; $('rcopy').style.display = 'block';\n  };\n  wireCopy('rcopy', 'rres');\n\n  function loadImpayes() { try { return JSON.parse(localStorage.getItem('sputnik_impayes') || '[]'); } catch (e) { return []; } }\n  function saveImpayes(d) { try { localStorage.setItem('sputnik_impayes', JSON.stringify(d)); } catch (e) {} }\n  function renderImpayes() {\n    const data = loadImpayes(); const list = $('ilist'); list.innerHTML = '';\n    data.forEach((it, i) => {\n      const row = document.createElement('div'); row.className = 'crow';\n      const span = document.createElement('span'); span.textContent = it.nom + ' — ' + it.montant + ' FCFA';\n      const relance = document.createElement('button'); relance.textContent = '💬';\n      relance.onclick = () => {\n        const msg = 'Bonjour ' + it.nom + ' 👋, un petit rappel : il te reste ' + it.montant + ' FCFA à régler. Merci beaucoup 🙏';\n        navigator.clipboard.writeText(msg);\n        relance.textContent = 'Copié';\n        setTimeout(() => relance.textContent = '💬', 1200);\n      };\n      const del = document.createElement('button'); del.textContent = '✕';\n      del.onclick = () => { const d = loadImpayes(); d.splice(i, 1); saveImpayes(d); renderImpayes(); };\n      row.appendChild(span); row.appendChild(relance); row.appendChild(del); list.appendChild(row);\n    });\n  }\n  $('iadd').onclick = () => {\n    const nom = $('ilib').value.trim(), montant = parseFloat($('imontant').value);\n    if (!nom || !montant) return;\n    const d = loadImpayes(); d.push({ nom, montant }); saveImpayes(d);\n    $('ilib').value = ''; $('imontant').value = ''; renderImpayes();\n  };\n  renderImpayes();\n\n  $('codego').onclick = async () => {\n    const code = $('codeinput').value.trim();\n    const btn = $('codego'); const label = btn.textContent; btn.disabled = true; btn.textContent = '…';\n    try {\n      const d = await post('/api/valider-code', { code });\n      if (d.valid) {\n        const until = Date.now() + 30 * 24 * 60 * 60 * 1000;\n        try { localStorage.setItem('sputnik_premium', JSON.stringify({ until })); } catch (e) {}\n        $('coderes').textContent = 'Accès illimité activé pour 30 jours. Merci !';\n        updatePremStatus();\n      } else {\n        $('coderes').textContent = 'Code invalide.';\n      }\n    } catch (e) {\n      $('coderes').textContent = 'Erreur : ' + e.message;\n    }\n    $('coderes').style.display = 'block';\n    btn.disabled = false; btn.textContent = label;\n  };\n</script>\n</body>\n</html>\n";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.8-flash";
const CODE_PREMIUM = process.env.CODE_PREMIUM || "";
const WAVE_NUMBER = process.env.WAVE_NUMBER || "(à configurer)";
const WHATSAPP_CONTACT = process.env.WHATSAPP_CONTACT || "(à configurer)";
const PAGE = PAGE_TEMPLATE.replaceAll("__WAVE__", WAVE_NUMBER).replaceAll("__WHATSAPP__", WHATSAPP_CONTACT);

// ---- Vérification de santé (utile pour Render) ----
app.get("/", (req, res) => {
  res.type("html").send(PAGE);
});
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "sputnik-server" });
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let cachedModels = null;

// Modèles Gemini "flash" de repli, disponibles pour cette clé (mis en cache)
async function getFallbackModels() {
  if (cachedModels) return cachedModels;
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", {
      headers: { "x-goog-api-key": GEMINI_KEY },
    });
    const d = await r.json();
    cachedModels = (d.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => m.name.replace("models/", ""))
      .filter((n) => n.startsWith("gemini-") && n.includes("flash") && !/image|tts|live|audio|embed|thinking|exp/.test(n))
      .filter((n) => n !== GEMINI_MODEL)
      .sort()
      .reverse()
      .slice(0, 4);
  } catch (e) {
    cachedModels = [];
  }
  return cachedModels;
}

async function callGemini(model, body) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY },
      body: JSON.stringify(body),
    }
  );
}

// ---- Fonction commune : appelle Gemini, avec réessai et repli de modèle ----
async function askGemini({ systemPrompt, history, message }) {
  if (!GEMINI_KEY) {
    throw new Error("GEMINI_API_KEY manquante");
  }

  const contents = [
    ...(history || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];
  const body = { systemInstruction: { parts: [{ text: systemPrompt }] }, contents };

  let lastErr = "";
  let models = [GEMINI_MODEL];
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await callGemini(model, body);
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
        if (text) return text;
        lastErr = "Réponse vide";
        break;
      }
      lastErr = `Erreur API Gemini ${model} (${response.status}): ${await response.text()}`;
      if (response.status === 503 || response.status === 500) {
        await sleep(1500);
        continue;
      }
      break;
    }
    if (i === 0) models = models.concat(await getFallbackModels());
  }
  throw new Error(lastErr);
}

// ---- Messages & annonces ----
app.post("/api/commercant", async (req, res) => {
  try {
    const { type, produit, prix, ton, details } = req.body;
    if (!produit) return res.status(400).json({ error: "Indique le produit ou service" });
    const message = `Type de message : ${type}\nProduit ou service : ${produit}\nPrix : ${prix || "non précisé"}\nTon : ${ton}\nDétails : ${details || "aucun"}`;
    const reply = await askGemini({
      systemPrompt: "Tu es SPUTNIK Commerçant. Tu rédiges des messages courts, prêts à copier-coller sur WhatsApp, pour un petit commerçant africain francophone. Ton chaleureux et simple, quelques emojis, prix en FCFA. Donne uniquement le message final, sans explication, 100 mots maximum.",
      history: [],
      message,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Fiche produit pour vente en ligne ----
app.post("/api/produit", async (req, res) => {
  try {
    const { produit, prix, points, plateforme } = req.body;
    if (!produit) return res.status(400).json({ error: "Indique le produit ou service" });
    const message = `Produit : ${produit}\nPrix : ${prix || "non précisé"}\nPoints forts : ${points || "aucun"}\nPlateforme : ${plateforme}`;
    const reply = await askGemini({
      systemPrompt: "Tu es SPUTNIK Vente en ligne. Tu rédiges une fiche produit prête à publier sur la plateforme indiquée : un titre accrocheur (60 caractères maximum), une description claire de 3 à 4 phrases mettant en avant les points forts, le prix en FCFA, puis 5 mots-clés séparés par des virgules. Réponds uniquement avec la fiche, sans explication.",
      history: [],
      message,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Statut WhatsApp publicitaire ----
app.post("/api/statut", async (req, res) => {
  try {
    const { produit, prix, occasion } = req.body;
    if (!produit) return res.status(400).json({ error: "Indique le produit ou service" });
    const message = `Produit : ${produit}\nPrix : ${prix || "non précisé"}\nOccasion : ${occasion}`;
    const reply = await askGemini({
      systemPrompt: "Tu es SPUTNIK Statut. Tu écris 3 variantes très courtes (30 mots maximum chacune) de statut WhatsApp publicitaire, avec emojis, numérotées 1 à 3, pour vendre le produit indiqué. Aucune explication, aucun texte avant ou après les 3 variantes.",
      history: [],
      message,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Idées de publication ----
app.post("/api/visibilite", async (req, res) => {
  try {
    const { activite } = req.body;
    if (!activite) return res.status(400).json({ error: "Indique ton activité" });
    const reply = await askGemini({
      systemPrompt: "Tu es SPUTNIK Visibilité. Pour l'activité indiquée, donne 5 idées de publications courtes (une légende de 1 à 2 phrases chacune, avec emojis) à publier sur Facebook, Instagram ou WhatsApp cette semaine, numérotées 1 à 5, pour un petit commerçant africain francophone. Aucune explication.",
      history: [],
      message: `Activité : ${activite}`,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Réponses rapides (FAQ) ----
app.post("/api/faq", async (req, res) => {
  try {
    const { infos } = req.body;
    if (!infos) return res.status(400).json({ error: "Indique les informations de ton commerce" });
    const reply = await askGemini({
      systemPrompt: "Tu es SPUTNIK FAQ. À partir des informations données sur un commerce, rédige 6 réponses courtes et prêtes à copier pour WhatsApp, répondant aux questions fréquentes des clients (horaires, livraison, paiement, localisation, retours). Numérote chaque réponse de 1 à 6. Aucune explication.",
      history: [],
      message: infos,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Traduction rapide ----
app.post("/api/traduire", async (req, res) => {
  try {
    const { texte, langue } = req.body;
    if (!texte) return res.status(400).json({ error: "Indique le texte à traduire" });
    const reply = await askGemini({
      systemPrompt: "Tu es SPUTNIK Traduction. Traduis fidèlement le texte donné vers la langue demandée, dans un style naturel et courant. Réponds uniquement avec la traduction, sans explication.",
      history: [],
      message: `Langue cible : ${langue}\nTexte : ${texte}`,
    });
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Validation du code d'accès illimité ----
app.post("/api/valider-code", (req, res) => {
  const { code } = req.body;
  const ok = !!(CODE_PREMIUM && code && code.trim() === CODE_PREMIUM.trim());
  res.json({ valid: ok });
});

app.listen(PORT, () => {
  console.log(`Serveur SPUTNIK lancé sur le port ${PORT}`);
});
