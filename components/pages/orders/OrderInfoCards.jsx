"use client";

export default function OrderInfoCard({
  icon: Icon,
  title,
  value,
  subtitle,
  tone = "default",
}) {
  const toneClass =
    tone === "green"
      ? "bg-forest-700 text-cream-100 border-forest-700"
      : tone === "gold"
      ? "bg-cream-200 text-forest-800 border-cream-300"
      : "bg-cream-50 text-forest-800 border-cream-300";

  return (
    <div className={`border p-5 ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`font-sans text-[10px] tracking-widest uppercase mb-1 ${
              tone === "green" ? "text-cream-200" : "text-cream-600"
            }`}
          >
            {title}
          </p>

          <p className="font-sans text-sm font-semibold break-words capitalize">
            {value || "—"}
          </p>

          {subtitle && (
            <p
              className={`font-sans text-xs mt-2 leading-5 ${
                tone === "green" ? "text-cream-200" : "text-cream-600"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 ${
              tone === "green"
                ? "bg-white/10 text-cream-100"
                : "bg-cream-100 text-forest-700"
            }`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}