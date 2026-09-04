"use client";

export default function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="border border-cream-300 p-5 bg-cream-50">
      <Icon size={18} className="text-forest-700 mb-3" />
      <p className="font-sans text-[10px] tracking-widest uppercase text-cream-600 mb-1">
        {title}
      </p>
      <p className="font-sans text-sm font-medium text-forest-800">{value}</p>
    </div>
  );
}