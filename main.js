// ============================================================
// main.js — Shared utilities, UI helpers, game logic
// ============================================================

// ── Toast notification system ──────────────────────────────
let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

export function showToast(msg, type = 'info', duration = 3500) {
  ensureToastContainer();
  const icons = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ── Tile color reveal ─────────────────────────────────────
/**
 * Evaluate a guess against a secret word.
 * Returns array of: 'correct' | 'present' | 'absent'
 * Case-insensitive.
 */
export function evaluateGuess(secret, guess) {
  secret = secret.toUpperCase();
  guess  = guess.toUpperCase();
  const result = Array(secret.length).fill('absent');
  const secretArr = secret.split('');
  const guessArr  = guess.split('');

  // First pass: mark correct
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = 'correct';
      secretArr[i] = null;
      guessArr[i]  = null;
    }
  }

  // Second pass: mark present
  for (let i = 0; i < guessArr.length; i++) {
    if (!guessArr[i]) continue;
    const idx = secretArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = 'present';
      secretArr[idx] = null;
    }
  }

  return result;
}

// ── Build a guess row of tiles ────────────────────────────
export function buildTileRow(rowEl, guess, result) {
  rowEl.innerHTML = '';
  for (let i = 0; i < guess.length; i++) {
    const tile = document.createElement('div');
    tile.className = `tile ${result ? result[i] : ''}`;
    tile.style.setProperty('--i', i);
    tile.textContent = guess[i].toUpperCase();
    rowEl.appendChild(tile);
  }
}

// ── Empty tile row ────────────────────────────────────────
export function buildEmptyRow(rowEl, length) {
  rowEl.innerHTML = '';
  for (let i = 0; i < length; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    rowEl.appendChild(tile);
  }
}

// ── Update keyboard color state ────────────────────────────
export function updateKeyboard(keyboardEl, guess, result) {
  if (!keyboardEl) return;
  const priority = { correct: 3, present: 2, absent: 1 };
  guess = guess.toUpperCase();
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const key = keyboardEl.querySelector(`[data-key="${letter}"]`);
    if (!key) continue;
    const curClass = key.dataset.state || '';
    const curPrio  = priority[curClass] || 0;
    const newPrio  = priority[result[i]] || 0;
    if (newPrio > curPrio) {
      key.classList.remove('correct', 'present', 'absent');
      key.classList.add(result[i]);
      key.dataset.state = result[i];
    }
  }
}

// ── Build keyboard DOM ─────────────────────────────────────
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
      btn.addEventListener('click', () => onKey(k));
      rowEl.appendChild(btn);
    });
    container.appendChild(rowEl);
  });
}

// ── Countdown Timer ────────────────────────────────────────
export class CountdownTimer {
  constructor({ totalSeconds, onTick, onEnd, timerEl }) {
    this.total     = totalSeconds;
    this.remaining = totalSeconds;
    this.onTick    = onTick;
    this.onEnd     = onEnd;
    this.timerEl   = timerEl;
    this.interval  = null;
    this._renderTimer();
  }

  start() {
    this.interval = setInterval(() => {
      this.remaining--;
      this._renderTimer();
      if (this.onTick) this.onTick(this.remaining);
      if (this.remaining <= 0) { this.stop(); if (this.onEnd) this.onEnd(); }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  _renderTimer() {
    if (!this.timerEl) return;
    const r = this.remaining;
    const circumference = 2 * Math.PI * 30; // r=30

    this.timerEl.innerHTML = `
      <div class="timer-ring ${r <= 10 ? 'warn' : ''}" style="display:inline-block;position:relative;width:80px;height:80px;">
        <svg width="80" height="80" viewBox="0 0 80 80" style="transform:rotate(-90deg)">
          <circle class="bg-ring" cx="40" cy="40" r="30" fill="none" stroke-width="5" stroke="rgba(255,255,255,0.08)"/>
          <circle class="fg-ring" cx="40" cy="40" r="30" fill="none" stroke-width="5"
            stroke="${r <= 10 ? 'var(--red)' : 'var(--accent)'}"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference * (1 - r / this.total)}"/>
        </svg>
        <div class="timer-number" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
          font-family:var(--mono);font-size:1.3rem;font-weight:700;color:${r <= 10 ? 'var(--red)' : 'var(--text)'};
          ${r <= 10 ? 'animation:flash 0.5s infinite;' : ''}">
          ${r}
        </div>
      </div>`;
  }
}

// ── Level system ───────────────────────────────────────────
export function getLevel(score) {
  return Math.floor(score / 500) + 1;
}

export function getLevelProgress(score) {
  const lvl  = getLevel(score);
  const base = (lvl - 1) * 500;
  return ((score - base) / 500) * 100;
}

// ── Achievement definitions ────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_win',  label: 'First Victory', icon: '🏆', condition: u => u.wins >= 1 },
  { id: 'ten_wins',   label: 'Veteran',        icon: '⚔️', condition: u => u.wins >= 10 },
  { id: 'daily_1',   label: 'Daily Warrior',  icon: '📅', condition: u => u.totalGames >= 1 },
  { id: 'score_500', label: 'Score Hunter',   icon: '💰', condition: u => u.score >= 500 },
  { id: 'score_2000',label: 'Elite Player',   icon: '👑', condition: u => u.score >= 2000 },
  { id: 'games_50',  label: 'Dedicated',      icon: '🎮', condition: u => u.totalGames >= 50 },
];

// ── Profile photo placeholder ─────────────────────────────
export function avatarUrl(url, username = '?') {
  if (url && url.startsWith('data:')) return url;
  // Fallback gradient avatar using initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=7b5cfa&color=fff&bold=true&size=96`;
}

// ── Format number ─────────────────────────────────────────
export function fmtNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n ?? 0);
}

// ── Modal helper ──────────────────────────────────────────
export function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
export function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── Simple sound effects (Web Audio API) ─────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

export function playSound(type) {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);

    const sounds = {
      correct: { freq: 660, type: 'sine',   dur: 0.15, vol: 0.15 },
      present: { freq: 440, type: 'sine',   dur: 0.15, vol: 0.12 },
      absent:  { freq: 200, type: 'square', dur: 0.1,  vol: 0.08 },
      win:     { freq: 880, type: 'sine',   dur: 0.5,  vol: 0.2  },
      lose:    { freq: 150, type: 'sawtooth',dur: 0.4, vol: 0.15 },
      type:    { freq: 300, type: 'sine',   dur: 0.05, vol: 0.06 },
    };

    const s = sounds[type] || sounds.type;
    o.type = s.type;
    o.frequency.setValueAtTime(s.freq, c.currentTime);
    if (type === 'win') {
      o.frequency.linearRampToValueAtTime(1320, c.currentTime + 0.3);
    }
    g.gain.setValueAtTime(s.vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + s.dur);
    o.start();
    o.stop(c.currentTime + s.dur);
  } catch (e) { /* Audio not critical */ }
}
