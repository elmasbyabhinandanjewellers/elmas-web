"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useCustomer } from "@/context/CustomerContext";
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  Plus,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import LuxuryLoader from "@/components/LuxuryLoader";

const emptyForm = {
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
  isDefault: false,
};

export function AddressContent() {
  const router = useRouter();

  const {
    customer,
    customerToken,
    customerAuthReady,
    logoutCustomer,
    refreshCustomer,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useCustomer();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!customerAuthReady) return;

    if (!customerToken) {
      router.replace("/auth/login");
      return;
    }

    loadAddresses();
  }, [customerAuthReady, customerToken]);

  const loadAddresses = async () => {
    setLoading(true);
    const freshCustomer = await refreshCustomer();
    setAddresses(freshCustomer?.addresses || customer?.addresses || []);
    setLoading(false);
  };

  useEffect(() => {
    const editId = searchParams.get("edit");

    if (!editId || !addresses.length) return;

    const addressToEdit = addresses.find((addr) => addr._id === editId);

    if (addressToEdit) {
      handleEditClick(addressToEdit);
    }
  }, [addresses, searchParams]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAddressId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  const handleAddClick = () => {
    setEditingAddressId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddressId(address._id);
    setFormData({
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
      isDefault: Boolean(address.isDefault),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, formData);
        toast.success("Address updated successfully");
      } else {
        await addAddress(formData);
        toast.success("Address saved successfully");
      }

      resetForm();
      router.replace("/account/addresses");
      await loadAddresses();
    } catch (error) {
      toast.error(error?.message || "Failed to save address");
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error?.message || "Failed to delete address");
    }
  };

  const handleMakeDefault = async (address) => {
    try {
      await updateAddress(address._id, {
        ...address,
        isDefault: true,
      });

      toast.success("Default address updated");
      await loadAddresses();
    } catch (error) {
      toast.error(error?.message || "Failed to update default address");
    }
  };

  if (!customerAuthReady) {
    return <LuxuryLoader />;
  }

  if (!customerToken) return null;

  return (
    <div className="min-h-screen bg-cream-100 py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <p className="section-subheading text-forest-500 mb-3">MY ACCOUNT</p>
          <h1 className="font-luxury text-5xl text-forest-800 mb-2">
            Saved Addresses
          </h1>
          <p className="font-sans text-sm text-cream-700">{customer?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AccountSidebar active="addresses" onLogout={handleLogout} />

          <div className="lg:col-span-3">
            <div className="bg-white border border-cream-300 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8 pb-6 border-b border-cream-200">
                <div>
                  <h2 className="font-luxury text-3xl text-forest-800">
                    Saved Addresses
                  </h2>
                  <p className="font-sans text-sm text-cream-700 mt-1">
                    Manage your shipping and billing addresses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddClick}
                  className="btn-primary inline-flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  <Plus size={16} /> ADD NEW ADDRESS
                </button>
              </div>

              {showForm && (
                <form
                  onSubmit={handleSubmit}
                  className="mb-8 p-6 border border-cream-300 bg-cream-50"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="font-luxury text-2xl text-forest-800">
                        {editingAddressId ? "Edit Address" : "Add New Address"}
                      </h3>
                      <p className="font-sans text-xs text-cream-600 mt-1">
                        {editingAddressId
                          ? "Update your saved address details."
                          : "Add a new address for faster checkout."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-cream-700 hover:text-red-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name *"
                      value={formData.fullName}
                      onChange={(v) =>
                        setFormData({ ...formData, fullName: v })
                      }
                    />
                    <Input
                      label="Phone Number *"
                      value={formData.mobile}
                      onChange={(v) => setFormData({ ...formData, mobile: v })}
                    />

                    <Input
                      className="md:col-span-2"
                      label="Address Line 1 *"
                      value={formData.line1}
                      onChange={(v) => setFormData({ ...formData, line1: v })}
                    />

                    <Input
                      className="md:col-span-2"
                      label="Address Line 2"
                      value={formData.line2}
                      onChange={(v) => setFormData({ ...formData, line2: v })}
                    />

                    <Input
                      className="md:col-span-2"
                      label="Landmark"
                      value={formData.landmark}
                      onChange={(v) =>
                        setFormData({ ...formData, landmark: v })
                      }
                    />

                    <Input
                      label="City *"
                      value={formData.city}
                      onChange={(v) => setFormData({ ...formData, city: v })}
                    />

                    <Input
                      label="State *"
                      value={formData.state}
                      onChange={(v) => setFormData({ ...formData, state: v })}
                    />

                    <Input
                      label="Pincode *"
                      value={formData.postalCode}
                      onChange={(v) =>
                        setFormData({ ...formData, postalCode: v })
                      }
                    />

                    <div>
                      <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
                        Address Type
                      </label>
                      <select
                        value={formData.addressType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addressType: e.target.value,
                          })
                        }
                        className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 bg-white focus:outline-none focus:border-forest-600"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3 mt-2">
                      <input
                        id="isDefault"
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isDefault: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="isDefault"
                        className="font-sans text-sm text-forest-700"
                      >
                        Set as default address
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button type="submit" className="btn-primary">
                      {editingAddressId ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-outline"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <div className="text-center py-8">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin size={64} className="mx-auto text-cream-300 mb-4" />
                  <p className="font-luxury text-2xl text-forest-800 mb-2">
                    No Addresses Saved
                  </p>
                  <p className="font-sans text-sm text-cream-700">
                    Add your first address to continue
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className="border border-cream-300 p-6 relative bg-white"
                    >
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 bg-forest-700 text-white text-[9px] tracking-widest px-2 py-1">
                          DEFAULT
                        </span>
                      )}

                      <p className="font-sans text-[10px] tracking-widest uppercase text-forest-500 mb-2">
                        {address.addressType || "home"}
                      </p>

                      <p className="font-sans text-sm font-semibold text-forest-800 mb-2 pr-20">
                        {address.fullName}
                      </p>

                      <p className="font-sans text-sm text-cream-700 mb-1">
                        {address.line1}
                      </p>

                      {address.line2 && (
                        <p className="font-sans text-sm text-cream-700 mb-1">
                          {address.line2}
                        </p>
                      )}

                      {address.landmark && (
                        <p className="font-sans text-sm text-cream-700 mb-1">
                          Landmark: {address.landmark}
                        </p>
                      )}

                      <p className="font-sans text-sm text-cream-700 mb-1">
                        {address.city}, {address.state} {address.postalCode}
                      </p>

                      <p className="font-sans text-sm text-cream-700 mb-5">
                        {address.mobile}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-cream-200">
                        <button
                          type="button"
                          onClick={() => handleEditClick(address)}
                          className="font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700 flex items-center gap-1"
                        >
                          <Edit size={12} /> EDIT
                        </button>

                        {!address.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleMakeDefault(address)}
                            className="font-sans text-xs tracking-widest uppercase text-forest-600 hover:text-forest-700"
                          >
                            MAKE DEFAULT
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(address._id)}
                          className="font-sans text-xs tracking-widest uppercase text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={12} /> DELETE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="font-sans text-xs tracking-widest uppercase text-forest-700 mb-2 block">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={label.includes("*")}
        className="w-full border border-cream-300 px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600"
      />
    </div>
  );
}

function AccountSidebar({ active, onLogout }) {
  const itemClass = (key) =>
    `flex items-center gap-3 px-4 py-3 font-sans text-sm transition-colors ${
      active === key
        ? "text-white bg-forest-700"
        : "text-forest-800 hover:bg-cream-100"
    }`;

  return (
    <div className="lg:col-span-1">
      <div className="bg-white border border-cream-300 p-4 sm:p-6 overflow-x-auto lg:overflow-visible">
        <nav className="flex lg:block gap-2 lg:space-y-2 min-w-max lg:min-w-0">
          <Link href="/account/orders" className={itemClass("orders")}>
            <Package size={18} /> <span>My Orders</span>
          </Link>
          <Link href="/wishlist" className={itemClass("wishlist")}>
            <Heart size={18} /> <span>Wishlist</span>
          </Link>
          <Link href="/account/addresses" className={itemClass("addresses")}>
            <MapPin size={18} /> <span>Addresses</span>
          </Link>
          <Link href="/account/profile" className={itemClass("profile")}>
            <User size={18} /> <span>Profile</span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex lg:w-full items-center gap-3 px-4 py-3 font-sans text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default function AddressesPage() {
  return (
    <Suspense fallback={null}>
      <AddressContent />
    </Suspense>
  );
}
