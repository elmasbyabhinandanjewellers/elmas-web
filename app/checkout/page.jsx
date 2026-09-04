"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCustomer } from "@/context/CustomerContext";
import { useDiscounts } from "@/context/DiscountContext";
import { useOrders } from "@/context/OrderContext";
import { useGiftMessageCards } from "@/context/GiftMessageCardContext";

import CheckoutItems from "@/components/pages/checkout/CheckoutItems";
import DeliveryModeSelector from "@/components/pages/checkout/DeliveryModeSelector";
import SavedAddressGrid from "@/components/pages/checkout/SavedAddressGrid";
import AddressForm from "@/components/pages/checkout/AddressForm";
import OrderSummary from "@/components/pages/checkout/OrderSummary";
import GiftMessageCardBox from "@/components/pages/checkout/GiftMessageCardBox";

const GUEST_CART_KEY = "elmas_guest_cart";

const emptyAddress = {
  fullName: "",
  mobile: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  addressType: "home",
};

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const getProductId = (item) =>
  item?.product?._id || item?.productId || item?.product;

const normalizeFrontendAddress = (address = {}) => ({
  fullName: address.fullName || "",
  mobile: address.mobile || "",
  line1: address.line1 || "",
  line2: address.line2 || "",
  landmark: address.landmark || "",
  city: address.city || "",
  state: address.state || "",
  country: address.country || "India",
  postalCode: address.postalCode || "",
  addressType: address.addressType || "home",
});

const getGuestCart = () => {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export default function CheckoutPage() {
  const router = useRouter();

  const {
    customer,
    customerToken,
    customerAuthReady,
    refreshCustomer,
    addAddress,
  } = useCustomer();

  const {
    availableDiscounts,
    discountLoading,
    fetchAvailableDiscountsForOrder,
    validateDiscount,
  } = useDiscounts();

  const { createWebsiteCheckout, verifyWebsiteCheckoutPayment, orderLoading } =
    useOrders();

  const { giftMessageCards, giftMessageCardLoading, fetchGiftMessageCards } =
    useGiftMessageCards();

  const [cart, setCart] = useState({ items: [], total: 0 });

  const [guestCustomerInfo, setGuestCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [deliveryMode, setDeliveryMode] = useState("home_delivery");

  const [selectedShippingAddressId, setSelectedShippingAddressId] =
    useState("");
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState("");

  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [manualShippingEntry, setManualShippingEntry] = useState(false);

  const [manualBillingEntry, setManualBillingEntry] = useState(false);
  const [billingAddress, setBillingAddress] = useState(emptyAddress);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [saveShippingAddress, setSaveShippingAddress] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);

  const [giftMessageCard, setGiftMessageCard] = useState({
    enabled: false,
    message: "",
    pricingMode: "predefined",
    selectedOption: "",
    amount: 0,
    label: "",
  });

  const [checkoutSessionId] = useState(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `checkout_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  });

  const addresses = customer?.addresses || [];
  const hasSavedAddresses = addresses.length > 0;

  useEffect(() => {
    if (!customerAuthReady) return;
    loadCheckout();
  }, [customerAuthReady, customerToken]);

  useEffect(() => {
    fetchGiftMessageCards({ status: "active", limit: 100 });
  }, []);

  useEffect(() => {
    if (!customer) {
      setSelectedShippingAddressId("");
      setSelectedBillingAddressId("");
      setShippingAddress(emptyAddress);
      setBillingAddress(emptyAddress);
      setManualShippingEntry(true);
      setManualBillingEntry(false);
      setBillingSameAsShipping(true);
      setSaveShippingAddress(false);
      return;
    }

    const defaultAddress =
      customer.addresses?.find((addr) => addr.isDefault) ||
      customer.addresses?.[0];

    if (defaultAddress) {
      const clean = normalizeFrontendAddress(defaultAddress);

      setSelectedShippingAddressId(defaultAddress._id);
      setSelectedBillingAddressId(defaultAddress._id);
      setShippingAddress(clean);
      setBillingAddress(clean);

      setManualShippingEntry(false);
      setManualBillingEntry(false);
      setBillingSameAsShipping(true);
      setSaveShippingAddress(false);
      return;
    }

    setSelectedShippingAddressId("");
    setSelectedBillingAddressId("");
    setShippingAddress(emptyAddress);
    setBillingAddress(emptyAddress);
    setManualShippingEntry(true);
    setManualBillingEntry(false);
    setBillingSameAsShipping(true);
    setSaveShippingAddress(true);
  }, [customer?._id]);

  useEffect(() => {
    if (!cart.items.length) return;

    const payload = {
      items: cart.items.map((item) => ({
        product: getProductId(item),
        quantity: Number(item.quantity || 1),
      })),
      shippingCharge: 0,
    };

    if (customer?._id) {
      payload.customerId = customer._id;
    }

    fetchAvailableDiscountsForOrder(payload);
  }, [customer?._id, cart.items.length]);

  const loadCheckout = async () => {
    setLoading(true);

    try {
      let items = [];

      if (customerToken) {
        const freshCustomer = await refreshCustomer();
        items = freshCustomer?.cart || customer?.cart || [];
      } else {
        items = getGuestCart().map((item) => ({
          ...item,
          product: item.productSnapshot || item.product || {},
        }));
      }

      const total = items.reduce((sum, item) => {
        const price =
          Number(item.product?.selling_price || 0) > 0
            ? Number(item.product.selling_price)
            : Number(item.product?.price || 0);

        return sum + price * Number(item.quantity || 1);
      }, 0);

      setCart({ items, total });
    } catch (error) {
      toast.error(error?.message || "Failed to load checkout");
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    const subtotal = Number(cart.total || 0);

    const giftMessageCardAmount =
      giftMessageCard?.enabled && giftMessageCard?.selectedOption
        ? Number(giftMessageCard.amount || 0)
        : 0;

    const discount =
      appliedCoupon?.discountAmount || appliedCoupon?.discount || 0;

    const finalAmount = Math.max(
      0,
      Number(
        (subtotal + giftMessageCardAmount - Number(discount || 0)).toFixed(2),
      ),
    );

    return {
      subtotal,
      gstAmount: 0,
      giftMessageCardAmount,
      discountAmount: Number(discount || 0),
      finalAmount,
    };
  }, [cart.total, appliedCoupon, giftMessageCard]);

  const finalAmount = totals.finalAmount;

  const handleSelectSavedAddress = (address, type) => {
    const cleanAddress = normalizeFrontendAddress(address);

    if (type === "shipping") {
      setManualShippingEntry(false);
      setSelectedShippingAddressId(address._id);
      setShippingAddress(cleanAddress);
      setSaveShippingAddress(false);

      if (billingSameAsShipping) {
        setSelectedBillingAddressId(address._id);
        setBillingAddress(cleanAddress);
      }
    }

    if (type === "billing") {
      setManualBillingEntry(false);
      setSelectedBillingAddressId(address._id);
      setBillingAddress(cleanAddress);
    }
  };

  const validateAddress = (address, label) => {
    if (!address.fullName?.trim()) {
      toast.error(`Please enter ${label} full name`);
      return false;
    }

    if (!address.mobile?.trim() || address.mobile.trim().length < 10) {
      toast.error(`Please enter valid ${label} mobile number`);
      return false;
    }

    if (!address.line1?.trim()) {
      toast.error(`Please enter ${label} address line`);
      return false;
    }

    if (!address.city?.trim()) {
      toast.error(`Please enter ${label} city`);
      return false;
    }

    if (!address.state?.trim()) {
      toast.error(`Please enter ${label} state`);
      return false;
    }

    if (!address.postalCode?.trim()) {
      toast.error(`Please enter ${label} pincode`);
      return false;
    }

    return true;
  };

  const validateCheckout = () => {
    if (!cart.items.length) {
      toast.error("Your cart is empty");
      return false;
    }

    if (!customerToken) {
      if (!guestCustomerInfo.firstName.trim()) {
        toast.error("Please enter your first name");
        return false;
      }

      // if (!guestCustomerInfo.email.trim()) {
      //   toast.error("Please enter your email");
      //   return false;
      // }

      if (
        !guestCustomerInfo.mobile.trim() ||
        guestCustomerInfo.mobile.trim().length < 10
      ) {
        toast.error("Please enter valid WhatsApp number");
        return false;
      }
    }

    if (deliveryMode === "home_delivery") {
      if (!validateAddress(shippingAddress, "shipping")) return false;
    }

    const finalBillingAddress =
      billingSameAsShipping && deliveryMode === "home_delivery"
        ? shippingAddress
        : billingAddress;

    if (!validateAddress(finalBillingAddress, "billing")) return false;

    if (giftMessageCard.enabled) {
      if (!giftMessageCard.selectedOption) {
        toast.error("Please select a gift message card option");
        return false;
      }

      if (!giftMessageCard.message.trim()) {
        toast.error("Please enter a gift message");
        return false;
      }

      const wordCount = giftMessageCard.message.trim().split(/\s+/).length;

      if (wordCount > 50) {
        toast.error("Gift message cannot exceed 50 words");
        return false;
      }
    }

    return true;
  };

  const applyCoupon = async (directCode = "") => {
    const finalCode = String(directCode || couponCode || "")
      .trim()
      .toUpperCase();

    if (!finalCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponError("");

    try {
      const result = await validateDiscount({
        code: finalCode,
        customerId: customer?._id,
        items: cart.items.map((item) => ({
          product: getProductId(item),
          quantity: Number(item.quantity || 1),
        })),
        shippingCharge: 0,
      });

      const discount =
        result?.discount || result?.coupon || result?.data?.discount || null;

      const discountAmount =
        result?.discountAmount ||
        result?.data?.discountAmount ||
        result?.amount ||
        0;

      setAppliedCoupon({
        ...(discount || {}),
        code: finalCode,
        discountAmount,
      });

      toast.success("Coupon applied successfully");
      setCouponCode("");
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(
        error?.response?.data?.message || error?.message || "Invalid coupon",
      );
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  const handleCreateSavedAddressIfNeeded = async () => {
    if (!customerToken) return;
    if (deliveryMode !== "home_delivery") return;
    if (!manualShippingEntry) return;
    if (!saveShippingAddress) return;
    if (selectedShippingAddressId) return;

    await addAddress({
      ...shippingAddress,
      isDefault: addresses.length === 0,
    });
  };

  const handlePayment = async () => {
    if (!validateCheckout()) return;

    try {
      setProcessing(true);

      await handleCreateSavedAddressIfNeeded();

      const isLoaded = await loadRazorpay();

      if (!isLoaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        setProcessing(false);
        return;
      }

      const finalBillingAddress =
        billingSameAsShipping && deliveryMode === "home_delivery"
          ? shippingAddress
          : billingAddress;

      const orderPayload = {
        checkoutSessionId,

        ...(customer?._id
          ? { customer: customer._id }
          : {
              customerInfo: {
                firstName: guestCustomerInfo.firstName.trim(),
                lastName: guestCustomerInfo.lastName.trim(),
                ...(guestCustomerInfo.email.trim() && {
                  email: guestCustomerInfo.email.trim(),
                }),
                mobile: guestCustomerInfo.mobile.trim(),
              },
              isGuestCheckout: true,
            }),

        source: "web",
        deliveryMode,
        paymentCollectionMode: "razorpay_checkout",
        couponCode: appliedCoupon?.code || null,

        saveShippingAddress:
          Boolean(customerToken) &&
          deliveryMode === "home_delivery" &&
          manualShippingEntry &&
          saveShippingAddress,

        billingSameAsShipping:
          deliveryMode === "home_delivery" ? billingSameAsShipping : false,

        shippingAddress:
          deliveryMode === "home_delivery" ? shippingAddress : undefined,

        billingAddress: finalBillingAddress,

        items: cart.items.map((item) => ({
          product: getProductId(item),
          quantity: Number(item.quantity || 1),
        })),

        giftMessageCard: giftMessageCard.enabled
          ? {
              enabled: true,
              message: giftMessageCard.message,
              pricingMode: "predefined",
              selectedOption: giftMessageCard.selectedOption,
            }
          : {
              enabled: false,
            },
      };

      const checkout = await createWebsiteCheckout(orderPayload);

      const razorpayOrderId = checkout?.razorpayOrderId;
      const checkoutToken = checkout?.checkoutToken;

      if (!razorpayOrderId || !checkoutToken) {
        toast.error("Failed to create checkout session");
        setProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(Number(checkout.finalPrice || finalAmount) * 100),
        currency: "INR",
        name: "Elmas by Abhinandan Jewellers",
        description:
          deliveryMode === "store_collection"
            ? "In-store collection order"
            : "Luxury purchase order",
        order_id: razorpayOrderId,

        handler: async (paymentResponse) => {
          try {
            const paidOrder = await verifyWebsiteCheckoutPayment({
              checkoutToken,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            toast.success("Payment successful! Your order has been placed.");

            if (customerToken) {
              await refreshCustomer();
              router.push(`/account/orders/${paidOrder._id}`);
            } else {
              localStorage.removeItem(GUEST_CART_KEY);
              router.push(`/order-success?orderId=${paidOrder._id}&guest=true`);
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message ||
                error?.message ||
                "Payment verification failed",
            );
          } finally {
            setProcessing(false);
          }
        },

        prefill: {
          name: finalBillingAddress.fullName || guestCustomerInfo.firstName,
          email: customer?.email || guestCustomerInfo.email,
          contact: finalBillingAddress.mobile || guestCustomerInfo.mobile,
        },

        notes: {
          checkoutSessionId,
          deliveryMode,
        },

        theme: {
          color: "#1E5C43",
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        toast.error(
          "Payment failed: " +
            (response.error?.description || "Please try again"),
        );
        setProcessing(false);
      });

      rzp.open();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to place order",
      );
      setProcessing(false);
    }
  };

  if (!customerAuthReady) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="font-sans text-sm tracking-widest text-forest-700 uppercase">
          Loading checkout...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      <div className="bg-cream-200 py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subheading text-forest-500 mb-2">
            PRIVATE ACQUISITION
          </p>

          <h1 className="font-luxury text-4xl md:text-5xl text-forest-800">
            Complete Your Order
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-cream-200 h-20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-12">
            <div className="space-y-10">
              <CheckoutItems items={cart.items} />

              {!customerToken && (
                <section className="bg-white border border-cream-300 p-6">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-forest-500 mb-2">
                    Guest Checkout
                  </p>

                  <h2 className="font-luxury text-2xl text-forest-800 mb-5">
                    Contact Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      value={guestCustomerInfo.firstName}
                      onChange={(e) =>
                        setGuestCustomerInfo((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      placeholder="First Name"
                      className="border border-cream-300 focus:outline-none px-4 py-3 text-sm"
                    />

                    <input
                      value={guestCustomerInfo.lastName}
                      onChange={(e) =>
                        setGuestCustomerInfo((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      placeholder="Last Name"
                      className="border border-cream-300 focus:outline-none px-4 py-3 text-sm"
                    />

                    <input
                      value={guestCustomerInfo.email}
                      onChange={(e) =>
                        setGuestCustomerInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Email (Optional)"
                      className="border border-cream-300 focus:outline-none px-4 py-3 text-sm md:col-span-2"
                    />

                    <input
                      value={guestCustomerInfo.mobile}
                      onChange={(e) =>
                        setGuestCustomerInfo((prev) => ({
                          ...prev,
                          mobile: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        }))
                      }
                      placeholder="WhatsApp Number"
                      className="border border-cream-300 focus:outline-none px-4 py-3 text-sm md:col-span-2"
                    />
                  </div>
                </section>
              )}

              <DeliveryModeSelector />

              <section className="bg-white border border-cream-300 p-6">
                <div className="flex items-start justify-between gap-5 flex-col md:flex-row">
                  <div className="flex-1">
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-forest-500 mb-2">
                      HANDCRAFTED DELIVERY
                    </p>

                    <h2 className="font-luxury text-2xl text-forest-800 mb-4">
                      Crafted & Delivered To You
                    </h2>
                  </div>

                  <div className="bg-cream-100 border border-cream-200 p-5 w-full md:max-w-[360px]">
                    <p className="font-sans text-xs tracking-[0.2em] uppercase text-forest-500 mb-4">
                      Important Note
                    </p>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-forest-700 mt-[2px]">•</span>
                        <p className="text-sm text-cream-700 font-sans leading-6">
                          Every masterpiece at Elmas is handcrafted exclusively
                          with meticulous artistry and precision.
                        </p>
                      </li>

                      <li className="flex items-start gap-3">
                        <span className="text-forest-700 mt-[2px]">•</span>
                        <p className="text-sm text-cream-700 font-sans leading-6">
                          Estimated crafting & delivery timeline:
                          <span className="font-semibold text-forest-700">
                            {" "}
                            10–15 business days
                          </span>{" "}
                          after successful payment.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {deliveryMode === "home_delivery" && (
                <section>
                  <h2 className="font-luxury text-2xl text-forest-800 mb-5">
                    Shipping Address
                  </h2>

                  {hasSavedAddresses && (
                    <SavedAddressGrid
                      addresses={addresses}
                      selectedId={selectedShippingAddressId}
                      onSelect={(addr) =>
                        handleSelectSavedAddress(addr, "shipping")
                      }
                      type="shipping"
                    />
                  )}

                  <AddressForm
                    title="Shipping Address"
                    address={shippingAddress}
                    setAddress={(value) => {
                      setShippingAddress(value);

                      if (billingSameAsShipping) {
                        setBillingAddress(value);
                      }
                    }}
                    manualEntry={manualShippingEntry}
                    setManualEntry={setManualShippingEntry}
                    onManualStart={() => {
                      setSelectedShippingAddressId("");
                      setShippingAddress(emptyAddress);
                      setManualShippingEntry(true);
                      setSaveShippingAddress(
                        Boolean(customerToken) && !hasSavedAddresses,
                      );

                      if (billingSameAsShipping) {
                        setSelectedBillingAddressId("");
                        setBillingAddress(emptyAddress);
                      }
                    }}
                  />

                  {customerToken &&
                    manualShippingEntry &&
                    !selectedShippingAddressId && (
                      <label className="flex items-center gap-4 mt-5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={saveShippingAddress}
                          onChange={(e) =>
                            setSaveShippingAddress(e.target.checked)
                          }
                        />
                        <span className="font-sans text-sm text-forest-700">
                          Save this address for future orders
                        </span>
                      </label>
                    )}

                  <label className="flex items-center gap-4 mt-6 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(e) => {
                        setBillingSameAsShipping(e.target.checked);

                        if (e.target.checked) {
                          setBillingAddress(shippingAddress);
                          setSelectedBillingAddressId(
                            selectedShippingAddressId,
                          );
                          setManualBillingEntry(false);
                        } else {
                          setSelectedBillingAddressId("");
                          setBillingAddress(emptyAddress);
                          setManualBillingEntry(!hasSavedAddresses);
                        }
                      }}
                    />

                    <span className="font-sans text-sm text-forest-700">
                      Billing address same as shipping address
                    </span>
                  </label>
                </section>
              )}

              {!billingSameAsShipping && (
                <section>
                  <h2 className="font-luxury text-2xl text-forest-800 mb-5">
                    Billing Address
                  </h2>

                  {hasSavedAddresses && (
                    <SavedAddressGrid
                      addresses={addresses}
                      selectedId={selectedBillingAddressId}
                      onSelect={(addr) =>
                        handleSelectSavedAddress(addr, "billing")
                      }
                    />
                  )}

                  <AddressForm
                    title="Billing Address"
                    address={billingAddress}
                    setAddress={setBillingAddress}
                    manualEntry={manualBillingEntry}
                    setManualEntry={setManualBillingEntry}
                    onManualStart={() => {
                      setSelectedBillingAddressId("");
                      setBillingAddress(emptyAddress);
                      setManualBillingEntry(true);
                    }}
                  />
                </section>
              )}

              <GiftMessageCardBox
                giftMessageCards={giftMessageCards}
                giftMessageCardLoading={giftMessageCardLoading}
                giftMessageCard={giftMessageCard}
                setGiftMessageCard={setGiftMessageCard}
              />
            </div>

            <OrderSummary
              cart={cart}
              totals={totals}
              finalAmount={finalAmount}
              deliveryMode={deliveryMode}
              processing={processing || orderLoading}
              handlePayment={handlePayment}
              customerToken={customerToken}
              couponProps={{
                couponCode,
                setCouponCode,
                appliedCoupon,
                couponError,
                applyCoupon,
                removeCoupon,
                availableCoupons: availableDiscounts,
                showCoupons,
                setShowCoupons,
                discountLoading,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
