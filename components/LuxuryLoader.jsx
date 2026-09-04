'use client';

export default function LuxuryLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-24 h-24 rounded-full border-2 border-cream-300 border-t-forest-700 animate-spin" />
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-forest-300 border-b-forest-700 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        
        {/* Center logo/icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-forest-700 animate-pulse">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="absolute bottom-32">
        <p className="font-luxury text-2xl text-forest-800 tracking-wider animate-pulse">
          ELMAS
        </p>
        <p className="font-sans text-xs tracking-widest text-cream-600 text-center mt-2">
          LOADING EXCELLENCE
        </p>
      </div>
    </div>
  );
}
