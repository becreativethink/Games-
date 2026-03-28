function showErr(msg) {
  console.error('[showErr]', msg);
  document.getElementById('loadbox').style.display='none';
  document.getElementById('sendBtn').disabled=false;
  const w=document.getElementById('resultWrap');
  w.innerHTML=`<div class="ebox">
    <div style="font-size:18px;margin-bottom:6px">⚠</div>
    <div style="font-weight:700;margin-bottom:8px;color:var(--red)">Something went wrong</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:10px;line-height:1.6">I think some errors occurred. Please send your query to fix the problem at becreativethink3@gmail.com or try again.</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:14px">${msg}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
      <button onclick="handleSend()" style="background:linear-gradient(135deg,var(--primary),var(--secondary));border:none;color:#fff;padding:8px 20px;border-radius:8px;font-weight:700;font-size:12px;box-shadow:0 4px 12px rgba(74,124,255,0.3)">Try Again</button>
      <button onclick="goPage('settings')" style="background:rgba(255,255,255,0.05);border:1px solid var(--border2);color:var(--text2);padding:8px 16px;border-radius:8px;font-weight:700;font-size:12px">⚙ Settings</button>
    </div>
  </div>`;
  w.style.display='block';
  toast('⚠ '+msg.substring(0,80),'err');
}
