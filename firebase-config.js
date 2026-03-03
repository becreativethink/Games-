// ============================================================
// firebase-config.js — Firebase init + all shared DB helpers
// ============================================================

import { initializeApp }           from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getDatabase, ref, set, get, update, remove,
  onValue, off, push, child
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

// ── App config ──────────────────────────────────────────────
const firebaseConfig = {
  databaseURL: 'https://eduweb-fcfee-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ── Export raw DB helpers so other modules can import them ──
export { db, ref, set, get, update, remove, onValue, off, push, child };

// ── SHA-256 password hashing (Web Crypto API) ───────────────
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray  = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Generate 6-char alphanumeric room ID ────────────────────
export function generateRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ── Today as YYYY-MM-DD ─────────────────────────────────────
export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Session helpers (sessionStorage) ───────────────────────
export function saveSession(user) {
  localStorage.setItem('ww_user', JSON.stringify(user));
}

export function loadSession() {
  try { return JSON.parse(localStorage.getItem('ww_user')); }
  catch(_) { return null; }
}

export function clearSession() {
  localStorage.removeItem('ww_user');
}

// ── requireAuth: redirect to login if not logged in ─────────
export function requireAuth(redirectTo = 'login.html') {
  const user = loadSession();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

// ── Register new user ────────────────────────────────────────
export async function registerUser({ username, password, photoURL = '' }) {
  // Check username uniqueness
  const nameSnap = await get(ref(db, 'usernames/' + username.toLowerCase()));
  if (nameSnap.exists()) throw new Error('Username already taken.');

  const uid  = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  const hash = await sha256(password);

  const userData = {
    username,
    passwordHash: hash,
    photoURL: photoURL || '',
    money:      100,
    score:      0,
    wins:       0,
    losses:     0,
    totalGames: 0,
    createdAt:  Date.now(),
    isOnline:   true,
    level:      1,
    achievements: {}
  };

  await set(ref(db, 'users/' + uid), userData);
  await set(ref(db, 'usernames/' + username.toLowerCase()), uid);

  return { uid, ...userData };
}

// ── Login ───────────────────────────────────────────────────
export async function loginUser({ username, password }) {
  const nameSnap = await get(ref(db, 'usernames/' + username.toLowerCase()));
  if (!nameSnap.exists()) throw new Error('User not found.');

  const uid      = nameSnap.val();
  const userSnap = await get(ref(db, 'users/' + uid));
  if (!userSnap.exists()) throw new Error('Account data missing.');

  const user  = userSnap.val();
  const hash  = await sha256(password);
  if (hash !== user.passwordHash) throw new Error('Incorrect password.');

  await update(ref(db, 'users/' + uid), { isOnline: true });
  return { uid, ...user, isOnline: true };
}

// ── Logout ──────────────────────────────────────────────────
export async function logoutUser(uid) {
  if (uid) await update(ref(db, 'users/' + uid), { isOnline: false });
  clearSession();
}

// ── Delete account ──────────────────────────────────────────
export async function deleteAccount(uid, username) {
  await remove(ref(db, 'users/' + uid));
  await remove(ref(db, 'usernames/' + username.toLowerCase()));
  clearSession();
}

// ── Avatar fallback ─────────────────────────────────────────
export function avatarUrl(url, username = '?') {
  if (url && (url.startsWith('data:') || url.startsWith('http'))) return url;
  const initials = encodeURIComponent((username || '?').substring(0, 2).toUpperCase());
  return `https://ui-avatars.com/api/?name=${initials}&background=6d51f5&color=fff&bold=true&size=80`;
}

// ── Number format ────────────────────────────────────────────
export function fmtNum(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

// ── Level from score ─────────────────────────────────────────
export function getLevel(score) {
  return Math.floor((score || 0) / 500) + 1;
}

export function getLevelProgress(score) {
  const lvl  = getLevel(score);
  const base = (lvl - 1) * 500;
  return (((score || 0) - base) / 500) * 100;
}
