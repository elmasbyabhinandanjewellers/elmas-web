export default function SearchDropdownLoader() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 bg-white">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-cream-300 border-t-forest-700 animate-spin" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full border-2 border-forest-300 border-b-forest-700 animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-4 h-4 text-forest-700 animate-pulse"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <p className="mt-4 font-luxury text-base text-forest-800">
        Searching Elmas
      </p>
      <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-forest-500">
        Finding products, categories and collections
      </p>
    </div>
  );
}