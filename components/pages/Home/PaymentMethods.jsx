export default function PaymentMethods() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-subheading text-forest-500 mb-3">
            SECURE PAYMENTS
          </p>
          <h2 className="font-luxury text-3xl text-forest-800">We Accept</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <PaymentItem label="Visa">
            <svg className="w-16 h-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#1A1F71" />
              <path
                d="M17.5 20.5L14 11.5H16L18.5 18.5L21 11.5H23L19.5 20.5H17.5Z"
                fill="white"
              />
              <path d="M24 11.5H26V20.5H24V11.5Z" fill="white" />
              <path
                d="M31 11.5C32.933 11.5 34.5 13.067 34.5 15C34.5 16.933 32.933 18.5 31 18.5H29V20.5H27V11.5H31ZM31 16.5C31.8284 16.5 32.5 15.8284 32.5 15C32.5 14.1716 31.8284 13.5 31 13.5H29V16.5H31Z"
                fill="#F7B600"
              />
            </svg>
          </PaymentItem>

          <PaymentItem label="Mastercard">
            <svg className="w-16 h-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#EB001B" />
              <circle cx="28" cy="16" r="10" fill="#F79E1B" />
              <circle cx="20" cy="16" r="10" fill="#FF5F00" />
            </svg>
          </PaymentItem>

          <PaymentItem label="Amex">
            <svg className="w-16 h-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#006FCF" />
              <path d="M12 16L14 11H16L14 16L16 21H14L12 16Z" fill="white" />
              <path d="M18 11H24L22 16L24 21H18L20 16L18 11Z" fill="white" />
            </svg>
          </PaymentItem>

          <PaymentItem label="RuPay">
            <svg className="w-16 h-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#5F259F" />
              <path
                d="M18 12H22C23.1 12 24 12.9 24 14C24 15.1 23.1 16 22 16H18V12Z"
                fill="white"
              />
              <path
                d="M18 16H22C23.1 16 24 16.9 24 18C24 19.1 23.1 20 22 20H18V16Z"
                fill="#FF9900"
              />
              <path
                d="M26 16C26 18.2091 27.7909 20 30 20C32.2091 20 34 18.2091 34 16C34 13.7909 32.2091 12 30 12C27.7909 12 26 13.7909 26 16Z"
                fill="white"
              />
            </svg>
          </PaymentItem>

          <PaymentItem label="UPI">
            <svg className="w-16 h-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#00BAF2" />
              <path d="M20 12H24L26 16L24 20H20L22 16L20 12Z" fill="white" />
              <path d="M26 12H30L32 16L30 20H26L28 16L26 12Z" fill="#0097D3" />
            </svg>
          </PaymentItem>

          <PaymentItem label="Net Banking">
            <svg className="w-16 h-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#142688" />
              <path
                d="M18 18V14H20C21.1046 14 22 14.8954 22 16C22 17.1046 21.1046 18 20 18H18Z"
                fill="white"
              />
              <path d="M24 14H28V18H24V14Z" fill="#FF9900" />
            </svg>
          </PaymentItem>
        </div>

        <p className="text-center mt-8 font-sans text-xs text-cream-600">
          Powered by
          Razorpay
        </p>
      </div>
    </section>
  );
}

function PaymentItem({ label, children }) {
  return (
    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
      {children}
      <span className="font-sans text-xs tracking-widest text-cream-600 uppercase">
        {label}
      </span>
    </div>
  );
}