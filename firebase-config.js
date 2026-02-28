// ============================================================
// firebase-config.js — Firebase initialization & helpers
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase, ref, set, get, update, remove,
  onValue, off, push, serverTimestamp, query, orderByChild, limitToFirst
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://eduweb-fcfee-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ── Utility: simple SHA-256 hash (browser native) ──────────
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray  = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Utility: generate short room ID ────────────────────────
export function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── Utility: today's date string ───────────────────────────
export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ── Auth helpers ────────────────────────────────────────────
export async function registerUser({ username, password, photoURL }) {
  // Check username uniqueness
  const snap = await get(ref(db, "usernames/" + username.toLowerCase()));
  if (snap.exists()) throw new Error("Username already taken.");

  const uid      = "u_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const passHash = await sha256(password);

  const userData = {
    username,
    passwordHash: passHash,
    photoURL: photoURL || "",
    money: 100,
    score: 0,
    wins: 0,
    losses: 0,
    totalGames: 0,
    createdAt: Date.now(),
    isOnline: true,
    level: 1,
    achievements: {}
  };

  await set(ref(db, "users/" + uid), userData);
  await set(ref(db, "usernames/" + username.toLowerCase()), uid);

  return { uid, ...userData };
}

export async function loginUser({ username, password }) {
  const snap = await get(ref(db, "usernames/" + username.toLowerCase()));
  if (!snap.exists()) throw new Error("User not found.");

  const uid      = snap.val();
  const passHash = await sha256(password);
  const uSnap    = await get(ref(db, "users/" + uid));
  if (!uSnap.exists()) throw new Error("Account data missing.");

  const data = uSnap.val();
  if (data.passwordHash !== passHash) throw new Error("Incorrect password.");

  // Mark online
  await update(ref(db, "users/" + uid), { isOnline: true });

  return { uid, ...data };
}

export async function logoutUser(uid) {
  if (!uid) return;
  await update(ref(db, "users/" + uid), { isOnline: false });
  sessionStorage.removeItem("ww_session");
}

export async function deleteAccount(uid, username) {
  await remove(ref(db, "users/" + uid));
  await remove(ref(db, "usernames/" + username.toLowerCase()));
  sessionStorage.removeItem("ww_session");
}

// ── Session helpers ─────────────────────────────────────────
export function saveSession(user) {
  sessionStorage.setItem("ww_session", JSON.stringify(user));
}

export function loadSession() {
  const s = sessionStorage.getItem("ww_session");
  return s ? JSON.parse(s) : null;
}

export function requireAuth(redirectTo = "login.html") {
  const user = loadSession();
  if (!user) { window.location.href = redirectTo; return null; }
  return user;
}

// ── Re-export Firebase pieces for use in other modules ──────
export { db, ref, set, get, update, remove, onValue, off, push, serverTimestamp, query, orderByChild, limitToFirst };
