"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomer } from "@/context/CustomerContext";
import { ArrowLeft, Printer } from "lucide-react";

import { fmt } from "@/components/pages/orders/pdfHelpers";
import generateOrderPDF from "@/components/pages/orders/OrderPdf";

import AccountSidebar from "@/components/pages/orders/AccountSidebar";
import OrderInfoCards from "@/components/pages/orders/OrderInfoCards";
import OrderItems from "@/components/pages/orders/OrderItems";
import AddressBox from "@/components/pages/orders/AddressBox";
import ShippingDetails from "@/components/pages/orders/ShippingDetails";
import PaymentSummary from "@/components/pages/orders/PaymentSummary";
import OrderNotFound from "@/components/pages/orders/OrderNotFound";
import OrderSkeleton from "@/components/pages/orders/OrderSkeleton";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    customer,
    customerToken,
    customerAuthReady,
    logoutCustomer,
    refreshCustomer,
  } = useCustomer();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerAuthReady) return;
    if (!customerToken) {
      router.replace("/auth/login");
      return;
    }
    const loadOrder = async () => {
      setLoading(true);
      const freshCustomer = await refreshCustomer();
      const orders = freshCustomer?.orders || customer?.orders || [];
      const found = orders.find((item) => item._id === id);
      setOrder(found || null);
      setLoading(false);
    };
    loadOrder();
  }, [customerAuthReady, customerToken, id]);

  const handleLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  const totals = useMemo(() => {
    if (!order) return [];
    return [
      ["Subtotal", order.subtotal],
      ["Discount", order.discountAmount || order.couponDiscountAmount],
      ["GST", order.gstTotal],
      ["Shipping", order.shippingCharge],
      ["Gift Message Card", order.giftMessageCard?.amount],
      ["Final Amount", order.finalPrice || order.totalAmount],
    ].filter(([, value]) => value !== undefined && value !== null);
  }, [order]);

  if (!customerToken) return null;

  return (
    <div className="min-h-screen bg-cream-100 py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

            {/* Print button */}
            {order && !loading && (
              <button
                type="button"
                onClick={() => generateOrderPDF(order, customer)}
                className="no-print inline-flex items-center gap-2 px-5 py-2.5 font-sans text-xs tracking-widest uppercase border border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-cream-100 transition-all duration-300 mt-2"
              >
                <Printer size={14} />
                Print Order
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <AccountSidebar active="orders" onLogout={handleLogout} />

          <div className="lg:col-span-3">
            <div className="bg-white border border-cream-300 p-4 sm:p-6 md:p-8">
              {loading ? (
                <OrderSkeleton />
              ) : !order ? (
                <OrderNotFound />
              ) : (
                <div className="space-y-8">
                  <OrderInfoCards order={order} />
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