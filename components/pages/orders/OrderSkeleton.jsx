"use client";

export default function OrderSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-cream-300 w-1/3" />
      <div className="h-24 bg-cream-200" />
      <div className="h-24 bg-cream-200" />
    </div>
  );
}