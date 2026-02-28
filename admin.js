// ============================================================
// admin.js — Admin panel logic v2
// ============================================================

import { db, ref, set, get, update, onValue } from './firebase-config.js';
import { showToast, fmtNum } from './main.js';

const ADMIN_PASSWORD = 's√11o√22n√33u√44';

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

export function listenUsers(callback) {
  onValue(ref(db, 'users'), snap => {
    if (!snap.exists()) { callback([]); return; }
    const users = Object.entries(snap.val())
      .map(([uid, d]) => ({ uid, ...d }))
      .filter(u => u.username)
      .sort((a,b) => (b.score||0) - (a.score||0));
    callback(users);
  });
}

export async function adjustCurrency(uid, field, delta) {
  const snap = await get(ref(db, 'users/' + uid));
  if (!snap.exists()) throw new Error('User not found');
  const current = snap.val()[field] || 0;
  const newVal  = Math.max(0, current + delta);
  await update(ref(db, 'users/' + uid), { [field]: newVal });
  return newVal;
}

export async function setDailyWord({ word, rewardMoney, rewardScore, attempts }) {
  const today = new Date().toISOString().split('T')[0];
  await set(ref(db, 'dailyWord'), {
    word: word.toLowerCase().trim(),
    rewardMoney: parseInt(rewardMoney, 10) || 50,
    rewardScore: parseInt(rewardScore, 10) || 100,
    attempts:    parseInt(attempts, 10)    || 6,
    date: today,
    setAt: Date.now()
  });
}

export async function loadAnalytics() {
  const [usersSnap, roomsSnap, dailySnap] = await Promise.all([
    get(ref(db, 'users')),
    get(ref(db, 'rooms')),
    get(ref(db, 'dailyResults'))
  ]);

  const users = usersSnap.exists() ? Object.values(usersSnap.val()).filter(u => u.username) : [];
  const rooms = roomsSnap.exists() ? Object.values(roomsSnap.val()) : [];
  const daily = dailySnap.exists() ? dailySnap.val() : {};

  const totalDailyPlays = Object.values(daily).reduce((acc, d) => acc + Object.keys(d).length, 0);
  const totalGames      = users.reduce((acc, u) => acc + (u.totalGames || 0), 0);
  const totalScore      = users.reduce((acc, u) => acc + (u.score      || 0), 0);
  const onlineCount     = users.filter(u => u.isOnline).length;
  const mostActive      = [...users].sort((a,b) => (b.totalGames||0)-(a.totalGames||0))[0];

  return {
    totalUsers:       users.length,
    totalGames,
    totalRooms:       rooms.length,
    totalDailyPlays,
    totalScore,
    onlineCount,
    mostActive:       mostActive?.username || 'N/A',
    mostActiveGames:  mostActive?.totalGames || 0
  };
}
