/* ============================================================
   pwa.js — PWA registration, install prompt, online/offline UI
   Include this in every HTML page (before closing </body>)
   ============================================================ */

(function() {
  'use strict';

  /* ── 1. Register Service Worker ── */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js', { scope: './' })
        .then(function(reg) {
          /* Check for updates every 60 s while page is open */
          setInterval(function() { reg.update(); }, 60000);

          /* New SW waiting — notify user */
          reg.addEventListener('updatefound', function() {
            var newWorker = reg.installing;
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateBanner();
              }
            });
          });
        })
        .catch(function(err) {
          console.warn('[PWA] SW registration failed:', err);
        });

      /* When new SW takes over, reload to get fresh assets */
      var refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (!refreshing) { refreshing = true; window.location.reload(); }
      });
    });
  }

  /* ── 2. Install Prompt (Add to Home Screen) ── */
  var deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  window.addEventListener('appinstalled', function() {
    deferredPrompt = null;
    hideInstallBanner();
    /* Small success toast if toast() is available */
    if (typeof toast === 'function') {
      toast('WordWar installed! 🎮', 'success');
    }
  });

  function showInstallBanner() {
    if (document.getElementById('_pwa-install-banner')) return;
    var banner = document.createElement('div');
    banner.id = '_pwa-install-banner';
    banner.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;">' +
        '<img src="icon-72.png" style="width:40px;height:40px;border-radius:10px;flex-shrink:0;" alt=""/>' +
        '<div style="min-width:0;">' +
          '<div style="font-weight:700;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Install WordWar</div>' +
          '<div style="font-size:.72rem;color:#7878a0;margin-top:2px;">Play offline · Add to home screen</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-shrink:0;">' +
        '<button id="_pwa-install-btn" style="padding:8px 16px;border-radius:8px;background:linear-gradient(135deg,#6d51f5,#b44cff);color:#fff;border:none;font-size:.78rem;font-weight:700;cursor:pointer;font-family:inherit;">Install</button>' +
        '<button id="_pwa-dismiss-btn" style="padding:8px 12px;border-radius:8px;background:rgba(255,255,255,0.07);color:#7878a0;border:1px solid rgba(255,255,255,0.1);font-size:.78rem;cursor:pointer;font-family:inherit;">✕</button>' +
      '</div>';
    banner.style.cssText =
      'position:fixed;bottom:64px;left:12px;right:12px;' +
      'background:#0e0e1c;border:1px solid rgba(109,81,245,0.35);' +
      'border-radius:16px;padding:14px 16px;' +
      'display:flex;align-items:center;gap:12px;flex-wrap:wrap;' +
      'box-shadow:0 8px 40px rgba(0,0,0,0.6),0 0 0 1px rgba(109,81,245,0.1);' +
      'z-index:9990;font-family:Outfit,sans-serif;' +
      'transform:translateY(20px);opacity:0;transition:all .3s cubic-bezier(.34,1.4,.64,1);';
    document.body.appendChild(banner);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        banner.style.transform = 'translateY(0)';
        banner.style.opacity = '1';
      });
    });

    document.getElementById('_pwa-install-btn').addEventListener('click', function() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(choice) {
        deferredPrompt = null;
        hideInstallBanner();
      });
    });
    document.getElementById('_pwa-dismiss-btn').addEventListener('click', function() {
      hideInstallBanner();
      sessionStorage.setItem('pwa_dismissed', '1');
    });
  }

  function hideInstallBanner() {
    var banner = document.getElementById('_pwa-install-banner');
    if (!banner) return;
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    setTimeout(function() { banner.remove(); }, 350);
  }

  /* ── 3. Online / Offline indicator ── */
  function setOnlineStatus(online) {
    /* Update existing online-dot elements */
    var dots = document.querySelectorAll('.online-dot');
    dots.forEach(function(dot) {
      dot.style.background = online ? '' : '#f04060';
    });

    /* Show/hide offline ribbon */
    var ribbon = document.getElementById('_pwa-offline-ribbon');
    if (!online) {
      if (!ribbon) {
        ribbon = document.createElement('div');
        ribbon.id = '_pwa-offline-ribbon';
        ribbon.textContent = '📡 You\'re offline — some features unavailable';
        ribbon.style.cssText =
          'position:fixed;top:58px;left:0;right:0;' +
          'background:#f04060;color:#fff;' +
          'text-align:center;padding:6px 16px;' +
          'font-family:Outfit,sans-serif;font-size:.75rem;font-weight:600;' +
          'z-index:9980;letter-spacing:.02em;';
        document.body.appendChild(ribbon);
      }
    } else {
      if (ribbon) ribbon.remove();
    }
  }

  window.addEventListener('online',  function() { setOnlineStatus(true); });
  window.addEventListener('offline', function() { setOnlineStatus(false); });
  setOnlineStatus(navigator.onLine);

  /* ── 4. Update available banner ── */
  function showUpdateBanner() {
    if (document.getElementById('_pwa-update-banner')) return;
    var banner = document.createElement('div');
    banner.id = '_pwa-update-banner';
    banner.innerHTML =
      '<span style="flex:1;font-size:.8rem;font-weight:600;">🔄 New version available!</span>' +
      '<button id="_pwa-update-btn" style="padding:7px 14px;border-radius:8px;background:linear-gradient(135deg,#6d51f5,#b44cff);color:#fff;border:none;font-size:.75rem;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;">Update Now</button>';
    banner.style.cssText =
      'position:fixed;bottom:64px;left:12px;right:12px;' +
      'background:#0e0e1c;border:1px solid rgba(109,81,245,0.35);' +
      'border-radius:12px;padding:12px 16px;' +
      'display:flex;align-items:center;gap:12px;' +
      'box-shadow:0 8px 40px rgba(0,0,0,0.6);' +
      'z-index:9991;font-family:Outfit,sans-serif;';
    document.body.appendChild(banner);
    document.getElementById('_pwa-update-btn').addEventListener('click', function() {
      window.location.reload();
    });
  }

})();
