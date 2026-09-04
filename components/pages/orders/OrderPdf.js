"use client";

import { fmt, unSnake, placedOn } from "@/components/pages/orders/pdfHelpers";

const BRAND = {
  name: "Elmas by Abhinandan Jewellers",
  tagline: "Handcrafted Silver • Gold • Antiques",
  emerald: "#1E5C43",
  emeraldDark: "#123728",
  gold: "#C9A84C",
  softGold: "#F8E7C9",
  cream: "#FBF7EF",
  creamDark: "#E8DCC8",
  ink: "#1B1B1B",
  muted: "#7A6A52",
};

function addressBlock(addr) {
  if (!addr) {
    return `<em style="color:${BRAND.muted};font-family:Jost,sans-serif;font-size:12px">Not provided</em>`;
  }

  return [
    addr.fullName
      ? `<strong style="font-weight:600;color:${BRAND.ink}">${addr.fullName}</strong>`
      : "",
    addr.line1,
    addr.line2,
    addr.landmark
      ? `<span style="color:${BRAND.muted}">Near ${addr.landmark}</span>`
      : "",
    `${addr.city || ""}${addr.city && addr.state ? ", " : ""}${
      addr.state || ""
    }${addr.postalCode ? ` — ${addr.postalCode}` : ""}`,
    addr.country,
    addr.mobile
      ? `<span style="color:${BRAND.muted}">Mob: ${addr.mobile}</span>`
      : "",
  ]
    .filter(Boolean)
    .join("<br>");
}

function itemsRows(order) {
  return (order.items || [])
    .map(
      (item, index) => `
      <tr style="background:${index % 2 === 0 ? "#FFFFFF" : "#FFFDF8"}">
        <td style="padding:16px 14px;vertical-align:top">
          <div style="display:flex;align-items:center;gap:14px">
            ${
              item.image
                ? `<img src="${item.image}" alt="" style="width:60px;height:60px;object-fit:contain;border:1px solid ${BRAND.creamDark};flex-shrink:0;background:${BRAND.cream};padding:4px" crossorigin="anonymous"/>`
                : `<div style="width:60px;height:60px;background:${BRAND.cream};border:1px solid ${BRAND.creamDark};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:22px;color:${BRAND.gold}">◇</div>`
            }

            <div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:16px;color:${
                BRAND.emeraldDark
              };font-weight:600;line-height:1.35">
                ${item.productName || item.title || "—"}
              </div>

              ${
                item.productCode
                  ? `<div style="font-family:'Jost',sans-serif;font-size:10px;color:${BRAND.muted};margin-top:4px;letter-spacing:0.12em;text-transform:uppercase">SKU: ${item.productCode}</div>`
                  : ""
              }
            </div>
          </div>
        </td>

        <td style="padding:16px 12px;text-align:center;font-family:'Jost',sans-serif;font-size:13px;color:${BRAND.emerald};vertical-align:middle;font-weight:600">
          ${item.quantity}
        </td>

        <td style="padding:16px 12px;text-align:right;font-family:'Jost',sans-serif;font-size:13px;color:${BRAND.ink};vertical-align:middle">
          ${fmt(item.unitPrice)}
        </td>

        <td style="padding:16px 12px;text-align:right;font-family:'Jost',sans-serif;font-size:13px;color:${BRAND.muted};vertical-align:middle">
          ${item.gstRate ?? 3}%
        </td>

        <td style="padding:16px 14px;text-align:right;font-family:'Jost',sans-serif;font-size:13px;font-weight:700;color:${BRAND.emeraldDark};vertical-align:middle">
          ${fmt(item.finalLineTotal || item.subtotal)}
        </td>
      </tr>`
    )
    .join("");
}

function totalsRows(order) {
  const totals = [
    ["Subtotal", order.subtotal],
    ["Discount", order.discountAmount || order.couponDiscountAmount],
    ["GST", order.gstTotal],
    ["Shipping", order.shippingCharge],
    ["Gift Message Card", order.giftMessageCard?.amount],
    ["Grand Total", order.finalPrice || order.totalAmount],
  ].filter(([, value]) => value !== undefined && value !== null && value !== 0);

  return totals
    .map(([label, value], index) => {
      const isLast = index === totals.length - 1;

      return `
      <tr>
        <td style="
          padding:${isLast ? "16px 18px 12px" : "7px 18px"};
          text-align:right;
          font-family:'Jost',sans-serif;
          font-size:12px;
          font-weight:${isLast ? "700" : "400"};
          color:${isLast ? BRAND.emeraldDark : BRAND.muted};
          border-top:${isLast ? `2px solid ${BRAND.gold}` : "none"};
          text-transform:uppercase;
          letter-spacing:0.14em;
        ">
          ${label}
        </td>

        <td style="
          padding:${isLast ? "16px 0 12px" : "7px 0"};
          text-align:right;
          font-family:${isLast ? "'Cormorant Garamond',serif" : "'Jost',sans-serif"};
          font-size:${isLast ? "22px" : "13px"};
          font-weight:${isLast ? "700" : "500"};
          color:${isLast ? BRAND.emerald : BRAND.ink};
          border-top:${isLast ? `2px solid ${BRAND.gold}` : "none"};
          min-width:125px;
        ">
          ${fmt(value)}
        </td>
      </tr>`;
    })
    .join("");
}

function orderInfoBlock(order) {
  const fields = [
    order.paymentMethod && {
      label: "Payment",
      value: unSnake(order.paymentMethod),
    },
    order.paymentStatus && {
      label: "Payment Status",
      value: unSnake(order.paymentStatus),
    },
    order.orderStatus && {
      label: "Order Status",
      value: unSnake(order.orderStatus),
    },
    order.deliveryMode && {
      label: "Delivery",
      value: unSnake(order.deliveryMode),
    },
    order.couponCode && { label: "Coupon", value: order.couponCode },
    order.trackingNumber && { label: "Tracking", value: order.trackingNumber },
    order.carrier && { label: "Carrier", value: order.carrier },
  ].filter(Boolean);

  if (!fields.length) return "";

  return `
    <div style="font-family:'Jost',sans-serif;font-size:12px;color:${BRAND.ink};line-height:2.05">
      ${fields
        .map(
          (field) => `
          <div style="display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed ${BRAND.creamDark};padding:3px 0">
            <span style="color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.12em;font-size:9px">${field.label}</span>
            <span style="color:${BRAND.emeraldDark};font-weight:500;text-align:right">${field.value}</span>
          </div>`
        )
        .join("")}
    </div>`;
}

function notesBlock(order) {
  let html = "";

  if (order.notes) {
    html += `
      <div style="margin-bottom:16px">
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.gold};margin-bottom:8px;font-weight:600">
          Order Notes
        </div>

        <div style="font-family:'Jost',sans-serif;font-size:12px;color:${BRAND.muted};line-height:1.7;background:${BRAND.cream};border:1px solid ${BRAND.creamDark};padding:14px 16px">
          ${order.notes}
        </div>
      </div>`;
  }

  if (order.giftMessageCard?.enabled && order.giftMessageCard?.message) {
    html += `
      <div>
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.gold};margin-bottom:8px;font-weight:600">
          Gift Message
        </div>

        <div style="
          font-family:'Cormorant Garamond',serif;
          font-size:17px;
          font-style:italic;
          color:${BRAND.emeraldDark};
          background:linear-gradient(135deg,#F9F4EA,#FFFFFF);
          border:1px solid ${BRAND.gold};
          padding:18px 20px;
          line-height:1.55;
          position:relative;
        ">
          <span style="font-size:26px;color:${BRAND.gold};line-height:0">“</span>
          ${order.giftMessageCard.message}
          <span style="font-size:26px;color:${BRAND.gold};line-height:0">”</span>
        </div>
      </div>`;
  }

  return html;
}

function signatureStampSection() {
  return `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;padding-top:26px;border-top:1px solid ${BRAND.creamDark};margin-bottom:34px">
      <div style="text-align:center">
        <div style="width:178px;height:68px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;background:${BRAND.cream};border:1px solid ${BRAND.creamDark};padding:8px">
          <svg width="160" height="55" viewBox="0 0 160 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 42 C25 10, 40 8, 50 28 C58 44, 62 18, 75 14 C88 10, 90 36, 102 32 C114 28, 116 18, 128 22 C138 25, 144 38, 148 34" stroke="${BRAND.emeraldDark}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 44 L148 44" stroke="${BRAND.gold}" stroke-width="0.7" stroke-dasharray="2 3" opacity="0.5"/>
          </svg>
        </div>
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.muted}">
          Authorised Signature
        </div>
      </div>

      <div style="text-align:center;padding:0 20px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:15px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.emeraldDark};margin-bottom:8px;font-weight:600">
          Thank you for your order
        </div>
        <div style="width:90px;height:1px;background:${BRAND.gold};margin:0 auto"></div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:12px;color:${BRAND.muted};margin-top:8px;font-style:italic">
          Crafted with devotion, delivered with care
        </div>
      </div>

      <div style="text-align:center">
        <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="52" cy="52" r="47" stroke="${BRAND.emerald}" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.55"/>
          <circle cx="52" cy="52" r="37" stroke="${BRAND.gold}" stroke-width="0.9" opacity="0.65"/>
          <text x="52" y="42" text-anchor="middle" font-family="Jost,sans-serif" font-size="8" letter-spacing="3" fill="${BRAND.emerald}" font-weight="700">ELMAS</text>
          <text x="52" y="56" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="11" fill="${BRAND.emeraldDark}" font-weight="600">Verified</text>
          <text x="52" y="69" text-anchor="middle" font-family="Jost,sans-serif" font-size="7" letter-spacing="2" fill="${BRAND.muted}">ORDER</text>
        </svg>
      </div>
    </div>`;
}

export default function generateOrderPDF(order, customer) {
  const logoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/logo.png`
      : "/logo.png";

  const orderDate = placedOn(order.createdAt);

  const dateOnly = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN")
    : "-";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Order ${order.orderId}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      background:#F3EADB;
      color:${BRAND.ink};
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
      font-family:'Jost',sans-serif;
    }
    @page{size:A4;margin:0}
    @media print{
      body{margin:0;background:#fff}
      .no-print{display:none!important}
      .page{box-shadow:none!important;margin:0!important}
    }
  </style>
</head>

<body>
<div class="page" style="
  width:100%;
  max-width:794px;
  margin:0 auto;
  background:#fff;
  min-height:1123px;
  position:relative;
  overflow:hidden;
">

  <div style="
    position:absolute;
    top:410px;
    left:50%;
    transform:translateX(-50%);
    font-family:'Cormorant Garamond',serif;
    font-size:120px;
    letter-spacing:0.18em;
    color:${BRAND.emerald};
    opacity:0.035;
    pointer-events:none;
    z-index:0;
    white-space:nowrap;
  ">
    ELMAS
  </div>

  <div style="
    background:linear-gradient(135deg,${BRAND.emeraldDark},${BRAND.emerald});
    padding:34px 42px 30px;
    position:relative;
    border-bottom:4px solid ${BRAND.gold};
    overflow:hidden;
  ">
    <div style="position:absolute;right:-70px;top:-90px;width:260px;height:260px;border-radius:50%;background:${BRAND.gold};opacity:0.08"></div>
    <div style="position:absolute;left:-90px;bottom:-130px;width:260px;height:260px;border-radius:50%;border:1px solid ${BRAND.gold};opacity:0.16"></div>

    <div style="display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2">
      <div style="display:flex;align-items:center;gap:18px">
        <div style="width:76px;height:76px;background:#fff;border:1px solid ${BRAND.gold};display:flex;align-items:center;justify-content:center;padding:10px">
          <img src="${logoUrl}" alt="Logo" style="max-height:58px;max-width:58px;object-fit:contain" onerror="this.style.display='none'"/>
        </div>

        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;letter-spacing:0.05em;color:#fff;font-weight:600;line-height:1">
            ${BRAND.name}
          </div>
          <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:${BRAND.softGold};margin-top:10px">
            ${BRAND.tagline}
          </div>
        </div>
      </div>

      <div style="text-align:right">
       

        <div style="font-family:'Cormorant Garamond',serif;font-size:30px;color:#fff;font-weight:600;letter-spacing:0.04em">
          #${order.orderId || "-"}
        </div>

        <div style="font-family:'Jost',sans-serif;font-size:11px;color:${BRAND.softGold};margin-top:6px;letter-spacing:0.06em">
          ${orderDate}
        </div>
      </div>
    </div>
  </div>

  <div style="padding:34px 42px 180px;position:relative;z-index:2">

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      background:${BRAND.cream};
      border:1px solid ${BRAND.creamDark};
      border-left:4px solid ${BRAND.gold};
      padding:14px 18px;
      margin-bottom:30px;
    ">
      <div>
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:4px">
          Order Status
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:${BRAND.emeraldDark};font-weight:700;text-transform:capitalize">
          ${unSnake(order.orderStatus || "confirmed")}
        </div>
      </div>

      <div style="text-align:right">
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.muted};margin-bottom:4px">
          Payment
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:${BRAND.emeraldDark};font-weight:700;text-transform:capitalize">
          ${unSnake(order.paymentStatus || "paid")}
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-bottom:34px">
      <div style="background:#fff;border:1px solid ${BRAND.creamDark};padding:18px;min-height:150px">
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.gold};margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid ${BRAND.gold};font-weight:700">
          Billed To
        </div>
        <div style="font-family:'Jost',sans-serif;font-size:12px;color:${BRAND.ink};line-height:1.85">
          ${addressBlock(order.billingAddress)}
        </div>
      </div>

      <div style="background:#fff;border:1px solid ${BRAND.creamDark};padding:18px;min-height:150px">
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.gold};margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid ${BRAND.gold};font-weight:700">
          ${
            order.deliveryMode === "store_collection"
              ? "Collection"
              : "Shipped To"
          }
        </div>
        <div style="font-family:'Jost',sans-serif;font-size:12px;color:${BRAND.ink};line-height:1.85">
          ${
            order.deliveryMode === "store_collection"
              ? `<strong style="color:${BRAND.emeraldDark}">${BRAND.name}</strong><br/>Meerut, Uttar Pradesh<br/><span style="color:${BRAND.muted}">Our team will call once ready.</span>`
              : addressBlock(order.shippingAddress)
          }
        </div>
      </div>

      <div style="background:#fff;border:1px solid ${BRAND.creamDark};padding:18px;min-height:150px">
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.gold};margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid ${BRAND.gold};font-weight:700">
          Order Info
        </div>
        ${orderInfoBlock(order)}
      </div>
    </div>

    <div style="margin-bottom:30px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:${BRAND.emeraldDark};letter-spacing:0.03em">
            Curated Masterpieces
          </div>
          <div style="font-family:'Jost',sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.muted};margin-top:2px">
            ${order.items?.length || 0} item(s) handcrafted for you
          </div>
        </div>

        <div style="height:1px;background:${BRAND.gold};width:160px"></div>
      </div>

      <table style="width:100%;border-collapse:collapse;border:1.5px solid ${BRAND.creamDark};background:#fff">
        <thead>
          <tr style="background:${BRAND.emeraldDark}">
            <th style="padding:13px 14px;text-align:left;font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.softGold};font-weight:600">Product</th>
            <th style="padding:13px 12px;text-align:center;font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.softGold};font-weight:600;width:60px">Qty</th>
            <th style="padding:13px 12px;text-align:right;font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.softGold};font-weight:600;width:100px">Unit</th>
            <th style="padding:13px 12px;text-align:right;font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.softGold};font-weight:600;width:60px">GST</th>
            <th style="padding:13px 14px;text-align:right;font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.softGold};font-weight:600;width:115px">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsRows(order)}</tbody>
      </table>
    </div>

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:34px;margin-bottom:38px">
      <div style="flex:1">
        ${notesBlock(order)}
      </div>

      <div style="
        min-width:315px;
        background:${BRAND.cream};
        border:1px solid ${BRAND.creamDark};
        padding:12px 18px;
      ">
        <div style="font-family:'Jost',sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${BRAND.gold};font-weight:700;margin-bottom:6px;text-align:right">
          Investment Summary
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tbody>${totalsRows(order)}</tbody>
        </table>
      </div>
    </div>

    ${signatureStampSection()}
  </div>

  <div style="
    background:${BRAND.cream};
    padding:10px 42px;
    text-align:center;
    border-top:1px solid ${BRAND.creamDark};
    position:absolute;
    bottom:86px;
    left:0;
    right:0;
  ">
    <div style="
      font-family:'Jost',sans-serif;
      font-size:8px;
      letter-spacing:0.12em;
      text-transform:uppercase;
      color:${BRAND.muted};
      line-height:1.5;
    ">
      © ${new Date().getFullYear()} ${BRAND.name}. All rights reserved. Handcrafted luxury with verified quality.
    </div>
  </div>

  <div style="
    background:${BRAND.emeraldDark};
    padding:16px 42px;
    position:absolute;
    bottom:0;
    left:0;
    right:0;
    min-height:86px;
    border-top:1px solid rgba(201,168,76,0.35);
  ">
    <div style="
      display:grid;
      grid-template-columns:1.2fr 1fr 0.8fr;
      align-items:center;
      gap:18px;
    ">
      <div>
        <div style="
          font-family:'Cormorant Garamond',serif;
          font-size:14px;
          color:${BRAND.gold};
          letter-spacing:0.08em;
          margin-bottom:5px;
          white-space:nowrap;
        ">
          ${BRAND.name}
        </div>

        <div style="
          font-family:'Jost',sans-serif;
          font-size:8.5px;
          color:${BRAND.softGold};
          letter-spacing:0.06em;
          line-height:1.6;
        ">
          This is a computer-generated invoice for your Elmas order.
        </div>
      </div>

      <div style="
        text-align:center;
        font-family:'Jost',sans-serif;
        font-size:8.5px;
        color:${BRAND.softGold};
        line-height:1.8;
        letter-spacing:0.06em;
      ">
        <div>
          <span style="color:${BRAND.gold};font-weight:700">☎</span>
          +91 9876543210
        </div>

        <div>
          <span style="color:${BRAND.gold};font-weight:700">✉</span>
          support@elmasbyabhinandanjewellers.com
        </div>
      </div>

      <div style="
        text-align:right;
        font-family:'Cormorant Garamond',serif;
        font-size:13px;
        color:${BRAND.gold};
        letter-spacing:0.12em;
      ">
        ${order.orderId || "-"}
        <div style="
          font-family:'Jost',sans-serif;
          font-size:8.5px;
          color:${BRAND.softGold};
          margin-top:4px;
          letter-spacing:0.08em;
        ">
          ${dateOnly}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="no-print" style="text-align:center;padding:28px;background:#F3EADB">
  <button onclick="window.print()" style="
    font-family:'Jost',sans-serif;
    font-size:11px;
    letter-spacing:0.18em;
    text-transform:uppercase;
    background:${BRAND.emerald};
    color:#fff;
    border:1px solid ${BRAND.gold};
    padding:15px 46px;
    cursor:pointer;
    box-shadow:0 12px 28px rgba(30,92,67,0.22);
  ">
    Print / Save as PDF
  </button>
</div>

</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}