"use client";

const WORD_LIMIT = 50;

const fmt = (p) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(p || 0);

const countWords = (value = "") => {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
};

export default function GiftMessageCardBox({
  giftMessageCards = [],
  giftMessageCardLoading,
  giftMessageCard,
  setGiftMessageCard,
}) {
  const enabled = giftMessageCard?.enabled;
  const selectedOption = giftMessageCard?.selectedOption;
  const message = giftMessageCard?.message || "";
  const wordCount = countWords(message);

  const handleToggle = (checked) => {
    if (!checked) {
      setGiftMessageCard({
        enabled: false,
        message: "",
        pricingMode: "predefined",
        selectedOption: "",
      });
      return;
    }

    setGiftMessageCard((prev) => ({
      ...prev,
      enabled: true,
      pricingMode: "predefined",
    }));
  };

  const handleMessageChange = (value) => {
    const words = value.trim() ? value.trim().split(/\s+/) : [];

    if (words.length > WORD_LIMIT) {
      return;
    }

    setGiftMessageCard((prev) => ({
      ...prev,
      message: value,
    }));
  };

  return (
    <section className="bg-white border border-cream-300 p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-forest-500 mb-2">
            GIFT MESSAGE CARD
          </p>

          <h2 className="font-luxury text-2xl text-forest-800">
            Add a Personal Note
          </h2>

          <p className="font-sans text-sm text-cream-700 mt-2 leading-6">
            Include a handcrafted message card with your order for gifting.
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="relative">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className="peer sr-only"
            />

            <div
              className="
        w-6 h-6 rounded-full border-2 border-cream-400
        bg-white transition-all duration-300
        peer-checked:bg-forest-700
        peer-checked:border-forest-700
        peer-hover:border-forest-500
        shadow-sm
        flex items-center justify-center
      "
            >
              <svg
                className="w-3.5 h-3.5 text-white opacity-0 scale-50 transition-all duration-300 peer-checked:opacity-100 peer-checked:scale-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* subtle luxury glow */}
            <div
              className="
        absolute inset-0 rounded-full
        bg-forest-700/10 blur-md scale-150
        opacity-0 peer-checked:opacity-100
        transition-opacity duration-300
      "
            />
          </div>

          <div>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-forest-700 block">
              Add Gift Card
            </span>

            <span className="font-sans text-xs text-cream-600">
              Include a personalised message
            </span>
          </div>
        </label>
      </div>

      {enabled && (
        <div className="space-y-5">
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-forest-600 mb-3">
              Choose Card Option
            </p>

            {giftMessageCardLoading ? (
              <div className="bg-cream-100 border border-cream-200 p-4 font-sans text-xs text-cream-700">
                Loading gift card options...
              </div>
            ) : giftMessageCards.length === 0 ? (
              <div className="bg-cream-100 border border-cream-200 p-4 font-sans text-xs text-cream-700">
                No gift message card options available.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {giftMessageCards.map((option) => {
                  const active = selectedOption === option._id;

                  return (
                    <button
                      key={option._id}
                      type="button"
                      onClick={() =>
                        setGiftMessageCard((prev) => ({
                          ...prev,
                          enabled: true,
                          pricingMode: "predefined",
                          selectedOption: option._id,
                          amount: Number(option.price || 0),
                          label: option.title,
                        }))
                      }
                      className={`text-left border p-4 transition-colors ${
                        active
                          ? "border-forest-700 bg-cream-100"
                          : "border-cream-300 hover:border-forest-400"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-sans text-sm text-forest-800 font-medium">
                            {option.title}
                          </p>

                          {option.description && (
                            <p className="font-sans text-xs text-cream-700 mt-1 leading-5">
                              {option.description}
                            </p>
                          )}
                        </div>

                        <span className="font-luxury text-lg text-forest-800">
                          {fmt(option.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-sans text-[10px] tracking-widest uppercase text-forest-600">
                Message
              </label>

              <span
                className={`font-sans text-[10px] ${
                  wordCount >= WORD_LIMIT ? "text-red-600" : "text-cream-600"
                }`}
              >
                {wordCount}/{WORD_LIMIT} words
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              rows={4}
              placeholder="Write your message here..."
              className="w-full min-h-[120px] max-h-[180px] overflow-y-auto border border-cream-300 bg-white px-4 py-3 font-sans text-sm text-forest-800 focus:outline-none focus:border-forest-600 resize-none custom-thin-scroll"
            />

            <p className="font-sans text-xs text-cream-600 mt-2">
              This message will be printed on your selected gift card.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
