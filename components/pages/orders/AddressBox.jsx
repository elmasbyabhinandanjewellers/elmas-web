"use client";

export default function AddressBox({ title, data }) {
  if (!data) return null;
  return (
    <div className="border border-cream-300 p-5">
      <h3 className="font-luxury text-xl text-forest-800 mb-3">{title}</h3>
      <p className="font-sans text-sm text-forest-800 mb-1">{data.fullName}</p>
      <p className="font-sans text-sm text-cream-700">{data.line1}</p>
      {data.line2 && (
        <p className="font-sans text-sm text-cream-700">{data.line2}</p>
      )}
      <p className="font-sans text-sm text-cream-700">
        {data.city}, {data.state} {data.postalCode}
      </p>
      <p className="font-sans text-sm text-cream-700">{data.mobile}</p>
    </div>
  );
}