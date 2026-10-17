"use client";

import { useSyncExternalStore } from "react";
import { getProduct, unitPrice } from "@/data/products";

// A tiny global store (no extra dependencies) persisted to localStorage.
// Components read it with useStore(); anything can mutate it via `actions`.

const STORAGE_KEY = "khanaghor-store-v1";
const PERSISTED = ["lang", "cart", "wishlist", "coupon", "orders"];

const initialState = {
  lang: "en",
  cart: [], // { key, id, size, qty }
  wishlist: [], // product ids
  coupon: null, // coupon code string
  orders: [], // placed orders
  cartOpen: false,
  toasts: [], // { id, kind, key, productId }
};

let state = initialState;
let hydrated = false;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    const data = Object.fromEntries(PERSISTED.map((k) => [k, state[k]]));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private mode etc.) – ignore
  }
}

function setState(update) {
  const patch = typeof update === "function" ? update(state) : update;
  state = { ...state, ...patch };
  persist();
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  if (!hydrated) {
    hydrated = true;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
        state = { ...state, ...saved };
        queueMicrotask(emit);
      }
    } catch {
      // corrupted storage – start fresh
    }
  }
  return () => listeners.delete(listener);
}

export function useStore() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initialState,
  );
}

// ───────────── Coupons & totals ─────────────

export const COUPONS = {
  KHANA10: { type: "percent", value: 10 },
  FREEDEL: { type: "delivery" },
  WELCOME50: { type: "flat", value: 50, min: 500 },
};

export const DELIVERY_FEE = 60;
export const FREE_DELIVERY_OVER = 1000;

export function computeTotals(cart, coupon) {
  const subtotal = cart.reduce((sum, item) => {
    const p = getProduct(item.id);
    return p ? sum + unitPrice(p, item.size) * item.qty : sum;
  }, 0);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const c = coupon ? COUPONS[coupon] : null;

  let discount = 0;
  if (c?.type === "percent") discount = Math.round((subtotal * c.value) / 100);
  if (c?.type === "flat" && subtotal >= (c.min || 0)) discount = c.value;

  let delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  if (c?.type === "delivery") delivery = 0;

  const total = Math.max(0, subtotal - discount + delivery);
  return { subtotal, discount, delivery, total, count };
}

// ───────────── Actions ─────────────

let toastSeq = 0;

export const actions = {
  setLang(lang) {
    setState({ lang });
  },
  toggleLang() {
    setState((s) => ({ lang: s.lang === "en" ? "bn" : "en" }));
  },

  addToCart(id, qty = 1, size = "regular", { silent = false } = {}) {
    const key = `${id}__${size}`;
    setState((s) => {
      const exists = s.cart.find((i) => i.key === key);
      const cart = exists
        ? s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 20) } : i))
        : [...s.cart, { key, id, size, qty }];
      return { cart };
    });
    if (!silent) actions.toast("added", id);
  },
  setQty(key, qty) {
    if (qty <= 0) return actions.removeFromCart(key);
    setState((s) => ({
      cart: s.cart.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 20) } : i)),
    }));
  },
  removeFromCart(key) {
    setState((s) => ({ cart: s.cart.filter((i) => i.key !== key) }));
  },
  clearCart() {
    setState({ cart: [], coupon: null });
  },

  toggleWishlist(id) {
    const has = state.wishlist.includes(id);
    setState((s) => ({
      wishlist: has ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id],
    }));
    actions.toast(has ? "unwished" : "wished", id);
  },

  applyCoupon(code) {
    const normalized = code.trim().toUpperCase();
    if (!COUPONS[normalized]) return false;
    setState({ coupon: normalized });
    return true;
  },
  removeCoupon() {
    setState({ coupon: null });
  },

  openCart() {
    setState({ cartOpen: true });
  },
  closeCart() {
    setState({ cartOpen: false });
  },

  placeOrder(details) {
    const totals = computeTotals(state.cart, state.coupon);
    const id = "KG" + Math.floor(100000 + Math.random() * 900000);
    const order = {
      id,
      placedAt: Date.now(),
      items: state.cart,
      totals,
      ...details,
    };
    setState((s) => ({ orders: [order, ...s.orders].slice(0, 10), cart: [], coupon: null }));
    return id;
  },

  toast(key, productId) {
    const id = ++toastSeq;
    setState((s) => ({ toasts: [...s.toasts, { id, key, productId }].slice(-3) }));
    setTimeout(() => actions.dismissToast(id), 2600);
  },
  dismissToast(id) {
    setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
};
