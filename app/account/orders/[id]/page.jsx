"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import { useOrders } from "@/context/OrderContext";
import {
  ArrowLeft,
  Printer,
  Package,
  CreditCard,
  CheckCircle2,
  Circle,
  XCircle,
  Truck,
  MapPin,
  CalendarDays,
  Hash,
} from "lucide-react";

import AccountSidebar from "@/components/pages/orders/AccountSidebar";
import OrderInfoCards from "@/components/pages/orders/OrderInfoCards";
import OrderItems from "@/components/pages/orders/OrderItems";
import AddressBox from "@/components/pages/orders/AddressBox";
import ShippingDetails from "@/components/pages/orders/ShippingDetails";
import PaymentSummary from "@/components/pages/orders/PaymentSummary";
import OrderNotFound from "@/components/pages/orders/OrderNotFound";
import OrderSkeleton from "@/components/pages/orders/OrderSkeleton";
import { unSnake } from "@/components/pages/orders/pdfHelpers";

const SHIPMENT_PROVIDERS = {
  bluedart: { label: "Blue Dart", trackingLabel: "AWB Number" },
  dtdc: { label: "DTDC", trackingLabel: "Consignment Number" },
  delhivery: { label: "Delhivery", trackingLabel: "AWB / Tracking ID" },
  xpressbees: { label: "XpressBees", trackingLabel: "AWB Number" },
  india_post: { label: "India Post", trackingLabel: "Consignment Number" },
  other: { label: "Other", trackingLabel: "Tracking ID / AWB Number" },
};

const formatDate = (date) => {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

const getShipmentProviderData = (order) => {
  const rawProvider = order?.shipmentProvider || order?.carrier || "";
  const providerKey = String(rawProvider).toLowerCase();
  const providerData = SHIPMENT_PROVIDERS[providerKey];

  return {
    providerName: providerData?.label || rawProvider || "-",
    trackingLabel: providerData?.trackingLabel || "Tracking ID / AWB Number",
  };
};

function OrderTimeline({ status }) {
  const currentStatus = status || "pending_payment";
  const isCancelled = currentStatus === "cancelled";

  const milestones = isCancelled
    ? ["pending_payment", "confirmed", "cancelled"]
    : ["pending_payment", "confirmed", "processing", "shipped", "delivered"];

  const currentIndex = milestones.indexOf(currentStatus);

  return (
    <div className="rounded-3xl border border-cream-300 bg-cream-100/60 p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-forest-500">
            Order Journey
          </p>
          <h3 className="mt-1 font-luxury text-2xl text-forest-800">
            Track Your Order
          </h3>
        </div>

        <span
          className={`rounded-full px-4 py-2 font-sans text-[10px] uppercase tracking-[0.18em] ${
            isCancelled
              ? "bg-red-50 text-red-700"
              : "bg-forest-700 text-cream-100"
          }`}
        >
          {unSnake(currentStatus)}
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="relative flex min-w-[720px] items-start justify-between">
          <div className="absolute left-[7%] right-[7%] top-5 h-[2px] bg-cream-300" />

          {milestones.map((item, index) => {
            const completed = isCancelled
              ? index <= currentIndex
              : currentIndex >= index;

            const active = item === currentStatus;
            const cancelledStep = item === "cancelled";

            return (
              <div
                key={item}
                className="relative z-10 flex w-full flex-col items-center text-center"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition-all ${
                    cancelledStep
                      ? "border-red-600 bg-red-600 text-white"
                      : completed
                        ? "border-forest-700 bg-forest-700 text-cream-100"
                        : "border-cream-300 bg-white text-cream-600"
                  }`}
                >
                  {cancelledStep ? (
                    <XCircle size={18} />
                  ) : completed ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={14} />
                  )}
                </div>

                <p
                  className={`mt-3 max-w-[120px] font-sans text-[10px] uppercase tracking-[0.16em] ${
                    active
                      ? cancelledStep
                        ? "text-red-700"
                        : "text-forest-800"
                      : completed
                        ? "text-forest-700"
                        : "text-cream-600"
                  }`}
                >
                  {unSnake(item)}
                </p>

                {active && (
                  <span
                    className={`mt-2 h-1.5 w-1.5 rounded-full ${
                      cancelledStep ? "bg-red-600" : "bg-forest-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ShipmentTrackingCard({ order }) {
  const shouldShow =
    order?.orderStatus === "shipped" ||
    order?.orderStatus === "delivered" ||
    order?.shipmentProvider ||
    order?.carrier ||
    order?.trackingNumber ||
    order?.estimatedDeliveryDate;

  if (!shouldShow) return null;

  const { providerName, trackingLabel } = getShipmentProviderData(order);

  return (
    <div className="rounded-3xl border border-cream-300 bg-cream-100/50 p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
          <Truck size={18} />
        </div>

        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-forest-500">
            Shipment Tracking
          </p>
          <h3 className="mt-1 font-luxury text-2xl text-forest-800">
            Delivery Details
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-cream-300 bg-white/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-forest-700">
            <Truck size={15} />
            <span className="font-sans text-[10px] uppercase tracking-[0.18em]">
              Provider
            </span>
          </div>
          <p className="font-sans text-sm font-semibold text-forest-900">
            {providerName}
          </p>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-forest-700">
            <Hash size={15} />
            <span className="font-sans text-[10px] uppercase tracking-[0.18em]">
              {trackingLabel}
            </span>
          </div>
          <p className="font-sans text-sm font-semibold text-forest-900 break-all">
            {order?.trackingNumber || "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-forest-700">
            <CalendarDays size={15} />
            <span className="font-sans text-[10px] uppercase tracking-[0.18em]">
              {order?.deliveredAt ? "Delivered At" : "Estimated Delivery"}
            </span>
          </div>
          <p className="font-sans text-sm font-semibold text-forest-900">
            {order?.deliveredAt
              ? formatDate(order.deliveredAt)
              : formatDate(order?.estimatedDeliveryDate)}
          </p>
        </div>
      </div>

      {order?.trackingUrl && (
        <div className="mt-4">
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-forest-700 hover:text-forest-900"
          >
            Track shipment online
            <MapPin size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { customer, customerToken, customerAuthReady, logoutCustomer } =
    useCustomer();

  const { currentOrder, orderLoading, getOrderById, downloadOrderInvoicePdf } =
    useOrders();

  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const order = currentOrder;

  useEffect(() => {
    if (!customerAuthReady) return;

    if (!customerToken) {
      router.replace("/auth/login");
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        await getOrderById(id);
      } catch (error) {
        console.error("Order fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOrder();
  }, [customerAuthReady, customerToken, id]);

  const handleLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  const handlePrintOrder = async () => {
    if (!order?._id || invoiceLoading) return;

    try {
      setInvoiceLoading(true);
      await downloadOrderInvoicePdf(order._id);
    } catch (error) {
      console.error("Invoice download error:", error);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const totals = useMemo(() => {
    if (!order) return [];

    return [
      ["Subtotal", order.subtotal],
      ["Discount", order.discountAmount || order.couponDiscountAmount],
      ["Shipping", order.shippingCharge],
      ["Gift Message Card", order.giftMessageCard?.amount],
      ["Final Amount", order.finalPrice || order.totalAmount],
    ].filter(([, value]) => value !== undefined && value !== null);
  }, [order]);

  if (!customerToken) return null;

  const pageLoading = loading;

  return (
    <div className="min-h-screen bg-cream-100 py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700 mb-5"
          >
            <ArrowLeft size={14} /> Back to Orders
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-subheading text-forest-500 mb-3">
                ORDER DETAILS
              </p>

              <h1 className="font-luxury text-3xl md:text-5xl text-forest-800 mb-2">
                {order?.orderId ? `Order: #${order.orderId}` : "Order Details"}
              </h1>

              <p className="font-sans text-sm text-cream-700 break-all">
                {customer?.email}
              </p>
            </div>

            {order && !pageLoading && (
              <button
                type="button"
                onClick={handlePrintOrder}
                disabled={invoiceLoading}
                className="no-print inline-flex items-center gap-2 px-5 py-2.5 font-sans text-xs tracking-widest uppercase border border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-cream-100 transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer size={14} />
                {invoiceLoading ? "Printing..." : "Print Order"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <AccountSidebar active="orders" onLogout={handleLogout} />

          <div className="lg:col-span-3">
            <div className="bg-white border border-cream-300 p-4 sm:p-6 md:p-8">
              {pageLoading ? (
                <OrderSkeleton />
              ) : !order ? (
                <OrderNotFound />
              ) : (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <OrderInfoCards
                        icon={Package}
                        title="Order Status"
                        value={unSnake(order?.orderStatus || "pending_payment")}
                        subtitle={`Order Type: ${unSnake(
                          order?.orderType || "confirmed",
                        )}`}
                        tone="green"
                      />

                      <OrderInfoCards
                        icon={CreditCard}
                        title="Payment Status"
                        value={unSnake(order?.paymentStatus || "pending")}
                        subtitle={`Via ${unSnake(
                          order?.paymentMethod || "razorpay",
                        )}`}
                      />
                    </div>

                    <OrderTimeline status={order?.orderStatus} />

                    <ShipmentTrackingCard order={order} />
                  </div>

                  <OrderItems items={order.items} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddressBox
                      title="Shipping Address"
                      data={order.shippingAddress}
                    />

                    <AddressBox
                      title="Billing Address"
                      data={order.billingAddress}
                    />
                  </div>

                  <ShippingDetails order={order} />

                  <PaymentSummary totals={totals} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}