"use client";

export const fmt = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p || 0);

export const unSnake = (s = "") => s.replace(/_/g, " ");

export const placedOn = (createdAt) =>
  createdAt
    ? new Date(createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "-";

export const statusColor = (s) => {
  const map = {
    confirmed: "#1a472a",
    delivered: "#1a472a",
    paid: "#1a472a",
    processing: "#7c5e2a",
    shipped: "#7c5e2a",
    pending_payment: "#8a6d1f",
    pending: "#8a6d1f",
    draft: "#5a5a5a",
    cancelled: "#8b1e1e",
    failed: "#8b1e1e",
    refunded: "#4a3f8c",
  };
  return map[s] || "#5a5a5a";
};

export const statusBg = (s) => {
  const map = {
    confirmed: "#e8f5e9",
    delivered: "#e8f5e9",
    paid: "#e8f5e9",
    processing: "#fff8e1",
    shipped: "#fff8e1",
    pending_payment: "#fff3e0",
    pending: "#fff3e0",
    draft: "#f5f5f5",
    cancelled: "#ffebee",
    failed: "#ffebee",
    refunded: "#ede7f6",
  };
  return map[s] || "#f5f5f5";
};