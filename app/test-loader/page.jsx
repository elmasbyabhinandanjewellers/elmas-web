'use client';
import { useState } from 'react';
import LuxuryLoader from '@/components/LuxuryLoader';
import Link from 'next/link';

export default function TestLoaderPage() {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <div className="min-h-screen bg-cream-100 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-luxury text-5xl text-forest-800 mb-6">Luxury Loader Demo</h1>
        <p className="font-sans text-base text-cream-700 mb-8">
          Click the button below to see the premium luxury loader in action.
        </p>
        
        <button
          onClick={() => {
            setShowLoader(true);
            setTimeout(() => setShowLoader(false), 3000);
          }}
          className="btn-primary mb-4"
        >
          SHOW LOADER (3 seconds)
        </button>
        
        <div className="mt-8">
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
        
        {showLoader && <LuxuryLoader />}
      </div>
    </div>
  );
}
