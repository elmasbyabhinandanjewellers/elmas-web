'use client';
import { useState } from 'react';

export default function ImageMagnifier({ src, alt, magnifierHeight = 150, magnifierWidth = 150, zoomLevel = 2.5 }) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  const mouseEnter = (e) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const mouseMove = (e) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  const mouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onMouseEnter={mouseEnter}
        onMouseMove={mouseMove}
        onMouseLeave={mouseLeave}
      />
      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifierWidth / 2}px`,
            opacity: '1',
            border: '2px solid #1b4332',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        />
      )}
    </div>
  );
}
