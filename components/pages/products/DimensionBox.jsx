export const DimensionBox =({ label, value }) => {
  return (
    <div className="border border-cream-300 bg-cream-50 p-5">
      <p className="font-sans text-[10px] tracking-widest uppercase text-cream-600 mb-2">
        {label}
      </p>
      <p className="font-luxury text-2xl text-forest-800">
        {value ? `${value} inches` : "N/A"}
      </p>
    </div>
  );
}