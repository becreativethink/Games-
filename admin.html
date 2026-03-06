<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover"/>
<meta name="theme-color" content="#6d51f5"/>
<title>WordWar — Admin</title>
<link rel="stylesheet" href="style.css"/>
<style>
/* ── LOGIN ── */
.adm-login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(109,81,245,.15) 0%,transparent 70%);}
.adm-login-card{max-width:380px;width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:24px;padding:40px 32px;text-align:center;}
.adm-login-icon{font-size:3rem;margin-bottom:16px;display:block;filter:drop-shadow(0 0 20px rgba(109,81,245,.6));}
.adm-login-title{font-family:var(--font-display);font-size:1.4rem;font-weight:800;letter-spacing:.06em;margin-bottom:6px;background:linear-gradient(135deg,#fff 30%,var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.adm-login-sub{font-size:.75rem;color:var(--text3);margin-bottom:28px;}
.adm-pw-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:13px 16px;color:#fff;font-family:var(--mono);font-size:1rem;text-align:center;letter-spacing:.2em;box-sizing:border-box;margin-bottom:14px;transition:border-color .18s;}
.adm-pw-input:focus{outline:none;border-color:var(--accent);}
.adm-pw-input.error{border-color:var(--red);animation:shake .3s;}
@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}
.adm-login-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:12px;color:#fff;font-family:var(--font);font-size:.88rem;font-weight:700;cursor:pointer;letter-spacing:.06em;box-shadow:0 4px 20px rgba(109,81,245,.35);transition:opacity .18s;}
.adm-login-btn:hover{opacity:.88;}

/* ── LAYOUT ── */
.adm-layout{display:flex;min-height:100vh;}
.adm-sidebar{width:220px;flex-shrink:0;background:rgba(255,255,255,.025);border-right:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;}
@media(max-width:640px){
  .adm-sidebar{width:100%;height:auto;position:fixed;bottom:0;left:0;flex-direction:row;border-right:none;border-top:1px solid rgba(255,255,255,.07);z-index:100;overflow-x:auto;padding:6px 0;background:rgba(8,7,20,.96);backdrop-filter:blur(20px);}
  .adm-brand,.adm-nav-grp,.adm-footer{display:none;}
  .adm-nav{display:flex;flex-direction:row;gap:0;padding:0;}
  .adm-nav-btn{flex-direction:column;gap:3px;padding:6px 12px;font-size:.58rem;border-radius:0;border-bottom:none;min-width:60px;text-align:center;}
  .adm-main{padding:16px 14px 100px;}
}
.adm-brand{padding:20px 18px 12px;font-family:var(--font-display);font-size:.95rem;font-weight:900;letter-spacing:.06em;border-bottom:1px solid rgba(255,255,255,.06);}
.adm-brand .w1{color:var(--accent);}
.adm-brand .w2{color:var(--accent2);}
.adm-brand-tag{font-size:.55rem;color:var(--text3);margin-left:6px;font-family:var(--font);font-weight:500;}
.adm-nav{display:flex;flex-direction:column;padding:12px 10px;gap:2px;flex:1;}
.adm-nav-grp{font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--text3);padding:10px 8px 5px;}
.adm-nav-btn{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:10px;background:none;border:none;color:var(--text2);font-family:var(--font);font-size:.8rem;font-weight:600;cursor:pointer;text-align:left;transition:all .18s;width:100%;}
.adm-nav-btn:hover{background:rgba(255,255,255,.06);color:var(--text);}
.adm-nav-btn.active{background:rgba(109,81,245,.18);color:#b0a0ff;border:1px solid rgba(109,81,245,.25);}
.adm-footer{padding:14px 10px;border-top:1px solid rgba(255,255,255,.06);}

/* ── MAIN ── */
.adm-main{flex:1;padding:28px 24px 40px;max-width:860px;}
.adm-page-title{font-family:var(--font-display);font-size:1.2rem;font-weight:800;letter-spacing:.04em;margin-bottom:22px;display:flex;align-items:center;gap:10px;}

/* ── ANALYTICS GRID ── */
.an-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;}
@media(min-width:600px){.an-grid{grid-template-columns:repeat(4,1fr);}}
.an-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:18px 16px;transition:border-color .18s;}
.an-card:hover{border-color:rgba(255,255,255,.14);}
.an-icon{font-size:1.6rem;display:block;margin-bottom:8px;}
.an-val{font-family:var(--mono);font-size:1.5rem;font-weight:700;display:block;color:#fff;margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.an-lbl{font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);}

/* ── FORM CARDS ── */
.adm-card{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:22px 20px;max-width:520px;}
.adm-card .form-label{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text2);margin-bottom:7px;display:block;}
.adm-card .form-control{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 14px;color:#fff;font-family:var(--font);font-size:.88rem;width:100%;box-sizing:border-box;transition:border-color .18s;}
.adm-card .form-control:focus{outline:none;border-color:var(--accent);}
.adm-card .form-group{margin-bottom:16px;}
.adm-row{display:flex;gap:12px;}
.adm-row .form-group{flex:1;}

/* ── CURRENCY PILLS ── */
.cur-pills{display:flex;gap:8px;margin-bottom:12px;}
.cur-pill{padding:7px 16px;border-radius:100px;font-size:.75rem;font-weight:700;border:1px solid var(--b2);background:rgba(255,255,255,.04);color:var(--text2);cursor:pointer;transition:all .18s;font-family:var(--font);}
.cur-pill.active-money{background:rgba(240,180,41,.15);border-color:rgba(240,180,41,.4);color:#f0b429;}
.cur-pill.active-score{background:rgba(109,81,245,.15);border-color:rgba(109,81,245,.4);color:#b0a0ff;}
.cur-adj-row{display:flex;gap:8px;align-items:stretch;}
.cur-adj-row .form-control{flex:1;}
.cur-adj-row .btn{flex-shrink:0;padding:11px 18px;}
.cur-result{margin-top:12px;padding:10px 14px;background:rgba(22,194,106,.1);border:1px solid rgba(22,194,106,.2);border-radius:10px;font-size:.8rem;color:#16c26a;font-family:var(--mono);display:none;}
.cur-result.show{display:block;}

/* ── USERS TABLE ── */
.adm-search{position:relative;margin-bottom:14px;max-width:360px;}
.adm-search input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 14px 10px 36px;color:#fff;font-family:var(--font);font-size:.84rem;box-sizing:border-box;transition:border-color .18s;}
.adm-search input:focus{outline:none;border-color:var(--accent);}
.adm-search::before{content:'🔍';position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:.78rem;pointer-events:none;}
.tbl-wrap{overflow-x:auto;border-radius:14px;border:1px solid rgba(255,255,255,.07);}
.data-table{width:100%;border-collapse:collapse;font-size:.8rem;}
.data-table thead tr{background:rgba(255,255,255,.05);}
.data-table th{padding:11px 14px;text-align:left;font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);font-weight:700;white-space:nowrap;}
.data-table td{padding:11px 14px;border-top:1px solid rgba(255,255,255,.05);color:var(--text2);}
.data-table tbody tr:hover td{background:rgba(255,255,255,.03);}

/* ── CMS EDITOR ── */
.cms-textarea{min-height:160px;resize:vertical;font-family:var(--mono);font-size:.8rem;line-height:1.6;}
.cms-preview{padding:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;line-height:1.7;font-size:.88rem;color:var(--text2);margin-top:12px;}
.cms-preview h2{color:var(--text);font-size:1rem;margin:14px 0 8px;}
.cms-preview p{margin:0 0 10px;}
.btn-bar{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}

/* ── REFRESH BTN ── */
.adm-refresh{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:var(--text2);font-family:var(--font);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .18s;}
.adm-refresh:hover{background:rgba(255,255,255,.1);color:var(--text);}

/* ── TOAST ── */
#_tz{position:fixed;top:20px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:280px;}
</style>
</head>
<body>

<!-- LOGIN GATE -->
<div id="admin-login" class="adm-login-wrap">
  <div class="adm-login-card">
    <span class="adm-login-icon">🛡️</span>
    <div class="adm-login-title">ADMIN PANEL</div>
    <div class="adm-login-sub">WordWar · Restricted Access</div>
    <input class="adm-pw-input" id="admin-pw" type="password" placeholder="Enter password"/>
    <button class="adm-login-btn" onclick="tryAdminLogin()">🔓 Enter Admin Panel</button>
  </div>
</div>

<!-- ADMIN PANEL -->
<div id="admin-panel" class="hidden">
  <div class="adm-layout">

    <aside class="adm-sidebar">
      <div class="adm-brand"><span class="w1">WORD</span><span class="w2">WAR</span><span class="adm-brand-tag">ADMIN</span></div>
      <nav class="adm-nav">
        <div class="adm-nav-grp">Dashboard</div>
        <button class="adm-nav-btn active" onclick="showSection('analytics')">📊 Analytics</button>
        <button class="adm-nav-btn" onclick="showSection('daily')">📅 Daily Word</button>
        <button class="adm-nav-btn" onclick="showSection('currency')">💰 Currency</button>
        <button class="adm-nav-btn" onclick="showSection('users')">👥 Users</button>
        <div class="adm-nav-grp">Content</div>
        <button class="adm-nav-btn" onclick="showSection('about')">📄 About Us</button>
        <button class="adm-nav-btn" onclick="showSection('privacy')">🔐 Privacy Policy</button>
      </nav>
      <div class="adm-footer">
        <button class="btn btn-ghost btn-sm btn-full" onclick="adminLogout()">← Logout</button>
      </div>
    </aside>

    <main class="adm-main">

      <!-- ANALYTICS -->
      <section id="sec-analytics">
        <div class="adm-page-title">📊 Analytics</div>
        <div class="an-grid" id="analytics-grid">
          <div class="an-card"><span class="an-icon">👤</span><span class="an-val" id="an-users">…</span><span class="an-lbl">Total Users</span></div>
          <div class="an-card"><span class="an-icon">🎮</span><span class="an-val" id="an-games">…</span><span class="an-lbl">Total Games</span></div>
          <div class="an-card"><span class="an-icon">🌐</span><span class="an-val" id="an-rooms">…</span><span class="an-lbl">Total Rooms</span></div>
          <div class="an-card"><span class="an-icon">📅</span><span class="an-val" id="an-daily">…</span><span class="an-lbl">Daily Plays</span></div>
          <div class="an-card"><span class="an-icon">⭐</span><span class="an-val" id="an-score">…</span><span class="an-lbl">Score Pool</span></div>
          <div class="an-card"><span class="an-icon">🟢</span><span class="an-val" id="an-online">…</span><span class="an-lbl">Online Now</span></div>
          <div class="an-card"><span class="an-icon">🏆</span><span class="an-val" id="an-top" style="font-size:1rem;">…</span><span class="an-lbl">Most Active</span></div>
          <div class="an-card"><span class="an-icon">🎯</span><span class="an-val" id="an-topg">…</span><span class="an-lbl">Top Games</span></div>
        </div>
        <button class="adm-refresh" onclick="refreshAnalytics()">↻ Refresh</button>
      </section>

      <!-- DAILY WORD -->
      <section id="sec-daily" class="hidden">
        <div class="adm-page-title">📅 Daily Word</div>
        <div class="adm-card">
          <div class="form-group"><label class="form-label">Secret Word</label>
            <input class="form-control" id="dw-word" placeholder="e.g. FLAME" style="text-transform:uppercase;letter-spacing:.15em;font-family:var(--mono);font-size:1.1rem;"/>
          </div>
          <div class="adm-row">
            <div class="form-group"><label class="form-label">Max Attempts</label><input class="form-control" id="dw-attempts" type="number" value="6" min="3" max="10"/></div>
            <div class="form-group"><label class="form-label">Reward 💰</label><input class="form-control" id="dw-money" type="number" value="50" min="0"/></div>
            <div class="form-group"><label class="form-label">Reward ⭐</label><input class="form-control" id="dw-score" type="number" value="100" min="0"/></div>
          </div>
          <button class="btn btn-primary" onclick="saveDailyWord()">💾 Set Daily Word</button>
        </div>
      </section>

      <!-- CURRENCY -->
      <section id="sec-currency" class="hidden">
        <div class="adm-page-title">💰 Currency</div>
        <div class="adm-card">
          <div class="form-group"><label class="form-label">Username</label>
            <input class="form-control" id="cur-user" placeholder="Enter username"/>
          </div>
          <div class="cur-pills">
            <button class="cur-pill" id="pill-money" onclick="setCurField('money')">💰 Money</button>
            <button class="cur-pill" id="pill-score" onclick="setCurField('score')">⭐ Score</button>
          </div>
          <div class="form-group"><label class="form-label">Amount</label>
            <div class="cur-adj-row">
              <input class="form-control" id="cur-amount" type="number" placeholder="0" min="1"/>
              <button class="btn btn-success" onclick="doCurrency(1)">+ Add</button>
              <button class="btn btn-danger"  onclick="doCurrency(-1)">− Remove</button>
            </div>
          </div>
          <div class="cur-result" id="cur-result"></div>
        </div>
      </section>

      <!-- USERS -->
      <section id="sec-users" class="hidden">
        <div class="adm-page-title">👥 Users</div>
        <div class="adm-search"><input id="user-search" placeholder="Search username…" oninput="filterUsers()"/></div>
        <div class="tbl-wrap">
          <table class="data-table" id="user-table">
            <thead><tr><th>#</th><th>Username</th><th>Score ⭐</th><th>Wins 🏆</th><th>Games 🎮</th><th>Money 💰</th><th>●</th></tr></thead>
            <tbody id="user-tbody"><tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text3);">Loading…</td></tr></tbody>
          </table>
        </div>
      </section>

      <!-- ABOUT US -->
      <section id="sec-about" class="hidden">
        <div class="adm-page-title">📄 About Us</div>
        <div class="adm-card" style="max-width:700px;">
          <div class="form-group"><label class="form-label">Page Title</label>
            <input class="form-control" id="about-title" value="About WordWar"/>
          </div>
          <div class="form-group"><label class="form-label">Content <span style="font-weight:400;color:var(--text3);text-transform:none;letter-spacing:0;">(HTML: p, h2, ul, li, strong)</span></label>
            <textarea class="form-control cms-textarea" id="about-content" rows="10" placeholder="<p>Your about us text here…</p>"></textarea>
          </div>
          <div class="btn-bar">
            <button class="btn btn-primary" onclick="saveAbout()">💾 Save</button>
            <button class="btn btn-ghost btn-sm" onclick="previewCms('about')">👁 Preview</button>
          </div>
          <div class="cms-preview hidden" id="about-preview"></div>
        </div>
      </section>

      <!-- PRIVACY POLICY -->
      <section id="sec-privacy" class="hidden">
        <div class="adm-page-title">🔐 Privacy Policy</div>
        <div class="adm-card" style="max-width:700px;">
          <div class="form-group"><label class="form-label">Page Title</label>
            <input class="form-control" id="privacy-title" value="Privacy Policy"/>
          </div>
          <div class="form-group"><label class="form-label">Content <span style="font-weight:400;color:var(--text3);text-transform:none;letter-spacing:0;">(HTML supported)</span></label>
            <textarea class="form-control cms-textarea" id="privacy-content" rows="14" placeholder="<p>Your privacy policy text here…</p>"></textarea>
          </div>
          <div class="btn-bar">
            <button class="btn btn-primary" onclick="savePrivacy()">💾 Save</button>
            <button class="btn btn-ghost btn-sm" onclick="previewCms('privacy')">👁 Preview</button>
          </div>
          <div class="cms-preview hidden" id="privacy-preview"></div>
        </div>
      </section>

    </main>
  </div>
</div>

<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
<script>
firebase.initializeApp({databaseURL:'https://eduweb-fcfee-default-rtdb.firebaseio.com/'});
var db=firebase.database();
var ADMIN_PW='s\u221a11o\u221a22n\u221a33u\u221a44';

function tryAdminLogin(){
  var pw=document.getElementById('admin-pw').value;
  if(pw===ADMIN_PW){
    sessionStorage.setItem('ww_admin','granted');
    document.getElementById('admin-login').style.display='none';
    document.getElementById('admin-panel').classList.remove('hidden');
    initAdmin();
  }else{
    var inp=document.getElementById('admin-pw');
    inp.classList.add('error');
    setTimeout(function(){inp.classList.remove('error');},400);
  }
}
function adminLogout(){sessionStorage.removeItem('ww_admin');location.href='index.html';}
if(sessionStorage.getItem('ww_admin')==='granted'){
  document.getElementById('admin-login').style.display='none';
  document.getElementById('admin-panel').classList.remove('hidden');
}
document.getElementById('admin-pw').addEventListener('keydown',function(e){if(e.key==='Enter')tryAdminLogin();});

var _sections=['analytics','daily','currency','users','about','privacy'];
function showSection(name){
  _sections.forEach(function(s){document.getElementById('sec-'+s).classList.toggle('hidden',s!==name);});
  document.querySelectorAll('.adm-nav-btn').forEach(function(b){
    var t=b.textContent.toLowerCase();
    b.classList.toggle('active',t.includes(name)||(name==='about'&&t.includes('about'))||(name==='privacy'&&t.includes('privacy')));
  });
  if(name==='analytics')refreshAnalytics();
  if(name==='users')refreshUsers();
  if(name==='about'||name==='privacy')loadCmsContent();
}
function initAdmin(){refreshAnalytics();refreshUsers();loadCmsContent();}
function fmtNum(n){if(!n)return'0';if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return String(n);}
function toast(msg,type){
  var c={success:'#16c26a',error:'#f04060',warn:'#f0b429',info:'#6d51f5'};
  var z=document.getElementById('_tz');
  if(!z){z=document.createElement('div');z.id='_tz';document.body.appendChild(z);}
  var t=document.createElement('div');
  t.style.cssText='padding:12px 16px;border-radius:10px;background:#0e0e1c;border:1px solid '+(c[type]||c.info)+'55;font-family:Outfit,sans-serif;font-size:.82rem;color:#eeeef8;transform:translateX(120%);transition:transform .28s;box-shadow:0 4px 20px rgba(0,0,0,.5);';
  t.textContent=msg;z.appendChild(t);
  requestAnimationFrame(function(){requestAnimationFrame(function(){t.style.transform='translateX(0)';});});
  setTimeout(function(){t.style.transform='translateX(120%)';setTimeout(function(){t.remove();},300);},3200);
}

async function refreshAnalytics(){
  try{
    var [uSnap,rSnap,dSnap]=await Promise.all([db.ref('users').get(),db.ref('rooms').get(),db.ref('dailyResults').get()]);
    var users=uSnap.exists()?Object.values(uSnap.val()).filter(function(u){return u.username;}):[];
    var rooms=rSnap.exists()?Object.values(rSnap.val()):[];
    var daily=dSnap.exists()?dSnap.val():{};
    var dailyPlays=Object.values(daily).reduce(function(a,d){return a+Object.keys(d).length;},0);
    var totalScore=users.reduce(function(a,u){return a+(u.score||0);},0);
    var online=users.filter(function(u){return u.isOnline;}).length;
    var top=users.slice().sort(function(a,b){return(b.totalGames||0)-(a.totalGames||0);})[0]||{};
    document.getElementById('an-users').textContent=users.length;
    document.getElementById('an-games').textContent=fmtNum(users.reduce(function(a,u){return a+(u.totalGames||0);},0));
    document.getElementById('an-rooms').textContent=rooms.length;
    document.getElementById('an-daily').textContent=dailyPlays;
    document.getElementById('an-score').textContent=fmtNum(totalScore);
    document.getElementById('an-online').textContent=online;
    document.getElementById('an-top').textContent=top.username||'—';
    document.getElementById('an-topg').textContent=top.totalGames||0;
    toast('Analytics refreshed','success');
  }catch(e){toast('Analytics error: '+e.message,'error');}
}
window.saveDailyWord=async function(){
  var word=document.getElementById('dw-word').value.trim().toUpperCase();
  if(word.length<2||!/^[A-Z]+$/.test(word)){toast('Enter a valid word (A-Z only).','warn');return;}
  try{
    await db.ref('dailyWord').set({word:word.toLowerCase(),rewardMoney:parseInt(document.getElementById('dw-money').value)||50,rewardScore:parseInt(document.getElementById('dw-score').value)||100,attempts:parseInt(document.getElementById('dw-attempts').value)||6,date:new Date().toISOString().split('T')[0],setAt:Date.now()});
    toast('Daily word set: '+word,'success');
  }catch(e){toast('Error: '+e.message,'error');}
};
var _curField='money';
window.setCurField=function(f){
  _curField=f;
  document.getElementById('pill-money').className='cur-pill'+(f==='money'?' active-money':'');
  document.getElementById('pill-score').className='cur-pill'+(f==='score'?' active-score':'');
};
window.doCurrency=async function(dir){
  var username=document.getElementById('cur-user').value.trim().toLowerCase();
  var amount=parseInt(document.getElementById('cur-amount').value)||0;
  if(!username||!amount){toast('Fill in username and amount.','warn');return;}
  try{
    var ns=await db.ref('usernames/'+username).get();
    if(!ns.exists()){toast('User not found.','error');return;}
    var uid=ns.val();
    var us=await db.ref('users/'+uid).get();
    var cur=us.val()[_curField]||0;
    var newVal=Math.max(0,cur+dir*amount);
    await db.ref('users/'+uid).update({[_curField]:newVal});
    var res=document.getElementById('cur-result');
    res.textContent=_curField+': '+cur+' → '+newVal+(dir>0?' (+'+amount+')':' (-'+amount+')');
    res.classList.add('show');
    toast('Updated '+_curField+' for '+username,'success');
  }catch(e){toast('Error: '+e.message,'error');}
};
var _allUsers=[];
async function refreshUsers(){
  var snap=await db.ref('users').get();
  _allUsers=snap.exists()?Object.entries(snap.val()).filter(function(e){return e[1].username;}).map(function(e){return Object.assign({uid:e[0]},e[1]);}).sort(function(a,b){return(b.score||0)-(a.score||0);}):[];
  renderUsersTable(_allUsers);
}
function filterUsers(){
  var q=document.getElementById('user-search').value.toLowerCase();
  renderUsersTable(_allUsers.filter(function(u){return u.username.toLowerCase().includes(q);}));
}
function renderUsersTable(users){
  var tb=document.getElementById('user-tbody');
  if(!users.length){tb.innerHTML='<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text3);">No users found.</td></tr>';return;}
  tb.innerHTML=users.map(function(u,i){
    return'<tr><td style="color:var(--text3);">'+(i+1)+'</td>'
      +'<td style="font-weight:700;color:var(--text);">'+u.username+'</td>'
      +'<td style="color:var(--accent);font-weight:700;font-family:var(--mono);">'+fmtNum(u.score||0)+'</td>'
      +'<td style="font-family:var(--mono);">'+fmtNum(u.wins||0)+'</td>'
      +'<td style="color:var(--text3);font-family:var(--mono);">'+fmtNum(u.totalGames||0)+'</td>'
      +'<td style="color:#f0b429;font-family:var(--mono);">'+fmtNum(u.money||0)+'</td>'
      +'<td>'+(u.isOnline?'<span style="color:#16c26a;font-size:1.1rem;">●</span>':'<span style="color:var(--text3);">○</span>')+'</td></tr>';
  }).join('');
}
async function loadCmsContent(){
  try{
    var snap=await db.ref('siteContent').get();
    if(!snap.exists())return;
    var d=snap.val();
    if(d.aboutUs){if(d.aboutUs.title)document.getElementById('about-title').value=d.aboutUs.title;if(d.aboutUs.content)document.getElementById('about-content').value=d.aboutUs.content;}
    if(d.privacyPolicy){if(d.privacyPolicy.title)document.getElementById('privacy-title').value=d.privacyPolicy.title;if(d.privacyPolicy.content)document.getElementById('privacy-content').value=d.privacyPolicy.content;}
  }catch(e){}
}
window.saveAbout=async function(){
  var title=document.getElementById('about-title').value.trim(),content=document.getElementById('about-content').value.trim();
  if(!title||!content){toast('Title and content required.','warn');return;}
  try{await db.ref('siteContent/aboutUs').set({title:title,content:content,updatedAt:Date.now()});toast('About Us saved!','success');}catch(e){toast('Save failed: '+e.message,'error');}
};
window.savePrivacy=async function(){
  var title=document.getElementById('privacy-title').value.trim(),content=document.getElementById('privacy-content').value.trim();
  if(!title||!content){toast('Title and content required.','warn');return;}
  try{await db.ref('siteContent/privacyPolicy').set({title:title,content:content,updatedAt:Date.now()});toast('Privacy Policy saved!','success');}catch(e){toast('Save failed: '+e.message,'error');}
};
window.previewCms=function(page){
  var preview=document.getElementById(page+'-preview');
  preview.innerHTML=document.getElementById(page+'-content').value;
  preview.classList.toggle('hidden');
};
if(sessionStorage.getItem('ww_admin')==='granted')initAdmin();
</script>
</body>
</html>
