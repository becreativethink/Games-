// ============================================================
// main.js — Shared utilities, UI helpers, game logic v2
// ============================================================

// ── Toast system ───────────────────────────────────────────
let _toastZone = null;

function getToastZone() {
  if (!_toastZone) {
    _toastZone = document.createElement('div');
    _toastZone.className = 'toast-zone';
    document.body.appendChild(_toastZone);
  }
  return _toastZone;
}

export function showToast(msg, type = 'info', duration = 3200) {
  const zone  = getToastZone();
  const icons = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
  const el    = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-ic">${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
  zone.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 320);
  }, duration);
}

// ── Guess evaluation ────────────────────────────────────────
export function evaluateGuess(secret, guess) {
  secret = secret.toUpperCase();
  guess  = guess.toUpperCase();
  const result     = Array(secret.length).fill('absent');
  const secretArr  = secret.split('');
  const guessArr   = guess.split('');

  // Pass 1: correct positions
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i]    = 'correct';
      secretArr[i] = null;
      guessArr[i]  = null;
    }
  }

  // Pass 2: present but wrong position
  for (let i = 0; i < guessArr.length; i++) {
    if (!guessArr[i]) continue;
    const idx = secretArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i]      = 'present';
      secretArr[idx] = null;
    }
  }

  return result;
}

// ── Board tile builders ────────────────────────────────────
export function buildTileRow(rowEl, guess, result) {
  rowEl.innerHTML = '';
  for (let i = 0; i < guess.length; i++) {
    const t = document.createElement('div');
    t.className = `tile ${result ? result[i] : ''}`;
    t.style.setProperty('--i', i);
    t.textContent = guess[i].toUpperCase();
    rowEl.appendChild(t);
  }
}

export function buildEmptyRow(rowEl, length) {
  rowEl.innerHTML = '';
  for (let i = 0; i < length; i++) {
    const t = document.createElement('div');
    t.className = 'tile';
    rowEl.appendChild(t);
  }
}

// Shake current row for invalid guess
export function shakeRow(rowEl) {
  rowEl.classList.add('row-invalid');
  setTimeout(() => rowEl.classList.remove('row-invalid'), 450);
}

// ── Keyboard ───────────────────────────────────────────────
export function updateKeyboard(kbEl, guess, result) {
  if (!kbEl) return;
  const priority = { correct: 3, present: 2, absent: 1 };
  guess = guess.toUpperCase();
  for (let i = 0; i < guess.length; i++) {
    const key = kbEl.querySelector(`[data-key="${guess[i]}"]`);
    if (!key) continue;
    const curPrio = priority[key.dataset.state] || 0;
    const newPrio = priority[result[i]] || 0;
    if (newPrio > curPrio) {
      key.classList.remove('correct', 'present', 'absent');
      key.classList.add(result[i]);
      key.dataset.state = result[i];
    }
  }
}

export function buildKeyboard(container, onKey) {
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫']
  ];
  container.innerHTML = '';
  rows.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'key-row';
    row.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'key' + (['ENTER','⌫'].includes(k) ? ' wide' : '');
      btn.textContent = k;
      btn.dataset.key = k;
      btn.type = 'button';
      btn.addEventListener('click', () => onKey(k));
      rowEl.appendChild(btn);
    });
    container.appendChild(rowEl);
  });
}

// ── Countdown timer ────────────────────────────────────────
export class CountdownTimer {
  constructor({ totalSeconds, onTick, onEnd, containerEl }) {
    this.total     = totalSeconds;
    this.remaining = totalSeconds;
    this.onTick    = onTick;
    this.onEnd     = onEnd;
    this.el        = containerEl;
    this._interval = null;
    this._render();
  }

  start() {
    this._interval = setInterval(() => {
      this.remaining = Math.max(0, this.remaining - 1);
      this._render();
      if (this.onTick) this.onTick(this.remaining);
      if (this.remaining <= 0) { this.stop(); if (this.onEnd) this.onEnd(); }
    }, 1000);
  }

  stop() { clearInterval(this._interval); this._interval = null; }

  _render() {
    if (!this.el) return;
    const r   = this.remaining;
    const pct = r / this.total;
    const C   = 2 * Math.PI * 30;
    const warn = r <= 10;

    this.el.innerHTML = `
      <div class="timer-wrap">
        <div class="timer-ring ${warn ? 'warn' : ''}">
          <svg width="74" height="74" viewBox="0 0 74 74">
            <circle class="t-bg" cx="37" cy="37" r="30"/>
            <circle class="t-fg" cx="37" cy="37" r="30"
              stroke-dasharray="${C}"
              stroke-dashoffset="${C * (1 - pct)}"
              stroke="${warn ? 'var(--red)' : 'var(--accent)'}"/>
          </svg>
          <div class="timer-num" style="color:${warn ? 'var(--red)' : 'var(--text)'}">${r}</div>
        </div>
        <span class="timer-lbl">Seconds Left</span>
      </div>`;
  }
}

// ── Level system ───────────────────────────────────────────
export function getLevel(score) {
  return Math.floor((score || 0) / 500) + 1;
}

export function getLevelProgress(score) {
  const lvl  = getLevel(score);
  const base = (lvl - 1) * 500;
  return (((score || 0) - base) / 500) * 100;
}

// ── Achievements ───────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_win',  label: 'First Victory',   icon: '🏆', condition: u => (u.wins || 0)       >= 1    },
  { id: 'ten_wins',   label: 'Veteran',          icon: '⚔️',  condition: u => (u.wins || 0)       >= 10   },
  { id: 'daily_hero', label: 'Daily Warrior',    icon: '📅', condition: u => (u.totalGames || 0) >= 1    },
  { id: 'score_500',  label: 'Score Hunter',     icon: '💰', condition: u => (u.score || 0)      >= 500  },
  { id: 'score_2k',   label: 'Elite Player',     icon: '👑', condition: u => (u.score || 0)      >= 2000 },
  { id: 'games_50',   label: 'Dedicated',        icon: '🎮', condition: u => (u.totalGames || 0) >= 50   },
];

// ── Avatar URL ─────────────────────────────────────────────
export function avatarUrl(url, username = '?') {
  if (url && (url.startsWith('data:') || url.startsWith('http'))) return url;
  const name = encodeURIComponent(username.substring(0, 2).toUpperCase());
  return `https://ui-avatars.com/api/?name=${name}&background=6d51f5&color=fff&bold=true&size=80`;
}

// ── Number formatting ──────────────────────────────────────
export function fmtNum(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

// ── Modal helpers ──────────────────────────────────────────
export function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
export function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── Sound effects ──────────────────────────────────────────
let _audioCtx = null;

function getAudio() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

export function playSound(type) {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const sounds = {
      correct: { freq: 660, type: 'sine',    dur: 0.14, vol: 0.12 },
      present: { freq: 440, type: 'sine',    dur: 0.12, vol: 0.10 },
      absent:  { freq: 180, type: 'square',  dur: 0.08, vol: 0.07 },
      win:     { freq: 880, type: 'sine',    dur: 0.55, vol: 0.18 },
      lose:    { freq: 140, type: 'sawtooth',dur: 0.4,  vol: 0.13 },
      type:    { freq: 300, type: 'sine',    dur: 0.04, vol: 0.05 },
    };

    const s = sounds[type] || sounds.type;
    osc.type = s.type;
    osc.frequency.setValueAtTime(s.freq, ctx.currentTime);
    if (type === 'win') osc.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(s.vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + s.dur);
    osc.start();
    osc.stop(ctx.currentTime + s.dur);
  } catch (_) { /* audio not critical */ }
}
