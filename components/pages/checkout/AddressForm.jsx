"use client";

export default function AddressForm({
  title,
  address,
  setAddress,
  manualEntry,
  setManualEntry,
  onManualStart,
}) {
  const update = (key, value) => {
    setAddress({
      ...address,
      [key]: value,
    });
  };

  const openManual = () => {
    onManualStart?.();
    setManualEntry(true);
  };

  return (
    <div className="mt-5">
      {!manualEntry ? (
        <button
          type="button"
          onClick={openManual}
          className="font-sans text-xs tracking-[0.18em] uppercase text-forest-700 border-b border-forest-500 hover:text-forest-800"
        >
          + Enter Address Manually
        </button>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="font-sans text-xs tracking-[0.18em] uppercase text-forest-600">
              {title}
            </p>

            <button
              type="button"
              onClick={() => setManualEntry(false)}
              className="font-sans text-[10px] tracking-[0.15em] uppercase text-cream-700 hover:text-forest-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" value={address.fullName} onChange={(v) => update("fullName", v)} />
            <Input label="Contact Number" value={address.mobile} onChange={(v) => update("mobile", v)} />
            <Input label="Address Line 1" value={address.line1} onChange={(v) => update("line1", v)} className="md:col-span-2" />
            <Input label="Address Line 2" value={address.line2} onChange={(v) => update("line2", v)} className="md:col-span-2" />
            <Input label="Landmark" value={address.landmark} onChange={(v) => update("landmark", v)} className="md:col-span-2" />
            <Input label="City" value={address.city} onChange={(v) => update("city", v)} />
            <Input label="State" value={address.state} onChange={(v) => update("state", v)} />
            <Input label="Postal Code" value={address.postalCode} onChange={(v) => update("postalCode", v)} />
          </div>
        </>
      )}
    </div>
  );
}

function Input({ label, value, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="font-sans text-[10px] tracking-[0.18em] uppercase text-forest-600 block mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-cream-400 bg-transparent py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-700 transition-colors"
      />
    </div>
  );
}