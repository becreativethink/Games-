// ============================================================
// admin.js — Admin panel logic, analytics, currency mgmt
// ============================================================

import { db, ref, set, get, update, onValue, todayStr } from './firebase-config.js';
import { showToast, fmtNum } from './main.js';

export { showToast, fmtNum };

const ADMIN_PASSWORD = 's\u221a11o\u221a22n\u221a33u\u221a44';

// ── Auth ─────────────────────────────────────────────────────
export function checkAdminAuth() {
  return sessionStorage.getItem('ww_admin') === 'granted';
}

export function attemptAdminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('ww_admin', 'granted');
    return true;
  }
  return false;
}

export function adminLogout() {
  sessionStorage.removeItem('ww_admin');
  window.location.href = 'index.html';
}

// ── Real-time user listener ──────────────────────────────────
export function listenUsers(callback) {
  onValue(ref(db, 'users'), snap => {
    if (!snap.exists()) { callback([]); return; }
    const users = Object.entries(snap.val())
      .map(([uid, d]) => ({ uid, ...d }))
      .filter(u => u.username)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    callback(users);
  });
}

// ── Currency adjustment ──────────────────────────────────────
export async function adjustCurrency(uid, field, delta) {
  const snap = await get(ref(db, 'users/' + uid));
  if (!snap.exists()) throw new Error('User not found');
  const current = snap.val()[field] || 0;
  const newVal  = Math.max(0, current + delta);
  await update(ref(db, 'users/' + uid), { [field]: newVal });
  return newVal;
}

// ── Set daily word ───────────────────────────────────────────
export async function setDailyWord({ word, rewardMoney, rewardScore, attempts }) {
  const today = todayStr();
  await set(ref(db, 'dailyWord'), {
    word:         word.toLowerCase().trim(),
    rewardMoney:  parseInt(rewardMoney, 10) || 50,
    rewardScore:  parseInt(rewardScore, 10) || 100,
    attempts:     parseInt(attempts, 10)    || 6,
    date:         today,
    setAt:        Date.now()
  });
}

// ── Analytics aggregation ────────────────────────────────────
export async function loadAnalytics() {
  const [usersSnap, roomsSnap, dailySnap] = await Promise.all([
    get(ref(db, 'users')),
    get(ref(db, 'rooms')),
    get(ref(db, 'dailyResults'))
  ]);

  const users       = usersSnap.exists()  ? Object.values(usersSnap.val()).filter(u => u.username) : [];
  const rooms       = roomsSnap.exists()  ? Object.values(roomsSnap.val()) : [];
  const dailyByDay  = dailySnap.exists()  ? dailySnap.val() : {};

  const totalDailyPlays = Object.values(dailyByDay)
    .reduce((acc, d) => acc + Object.keys(d).length, 0);
  const totalGames      = users.reduce((a, u) => a + (u.totalGames || 0), 0);
  const totalScore      = users.reduce((a, u) => a + (u.score      || 0), 0);
  const onlineCount     = users.filter(u => u.isOnline).length;
  const mostActive      = [...users].sort((a,b) => (b.totalGames||0)-(a.totalGames||0))[0];

  return {
    totalUsers:      users.length,
    totalGames,
    totalRooms:      rooms.length,
    totalDailyPlays,
    totalScore,
    onlineCount,
    mostActive:      mostActive?.username || 'N/A',
    mostActiveGames: mostActive?.totalGames || 0
  };
}

// ── CMS: load site content ────────────────────────────────────
export async function loadSiteContent() {
  const snap = await get(ref(db, 'siteContent'));
  return snap.exists() ? snap.val() : {};
}

// ── CMS: save About Us ───────────────────────────────────────
export async function saveAboutUs({ title, content }) {
  if (!title || !content) throw new Error('Title and content required.');
  await set(ref(db, 'siteContent/aboutUs'), {
    title:     title.trim(),
    content:   content.trim(),
    updatedAt: Date.now()
  });
}

// ── CMS: save Privacy Policy ─────────────────────────────────
export async function savePrivacyPolicy({ title, content }) {
  if (!title || !content) throw new Error('Title and content required.');
  await set(ref(db, 'siteContent/privacyPolicy'), {
    title:     title.trim(),
    content:   content.trim(),
    updatedAt: Date.now()
  });
}
