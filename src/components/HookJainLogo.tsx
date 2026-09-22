import React, { useState } from 'react';

interface HookJainLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const HookJainLogo: React.FC<HookJainLogoProps> = ({
  className = "w-10 h-10",
  showText = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // If the image asset loads cleanly, render it
  if (!imgError) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 shadow-md ${className}`}>
        <img
          src="/hook_jain_logo.jpg"
          alt="Hook Jain"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-110"
        />
      </div>
    );
  }

  // High-fidelity vector SVG fallback of the Hook Jain monogram
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800 shadow-md p-1.5 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.15)]"
      >
        {/* Monogram H & J */}
        {/* Left vertical bar of H */}
        <rect x="22" y="24" width="10" height="46" rx="2" fill="currentColor" />
        
        {/* Crossbar of H */}
        <rect x="30" y="44" width="28" height="9" fill="currentColor" />
        
        {/* Right vertical bar of H and stem of J */}
        <path
          d="M56 24 H66 V56 C66 65 59 72 49 72 C42 72 36 68 34 63 L41 58 C42 61 45 64 49 64 C54 64 57 60 57 55 V24 Z"
          fill="currentColor"
        />

        {/* Dynamic Curved Swoosh cutting diagonally across H & J */}
        <path
          d="M20 68 C35 52 58 39 82 34 C64 42 42 57 26 73 Z"
          fill="white"
          opacity="0.95"
        />

        {/* Text HOOK JAIN underneath if requested */}
        {showText && (
          <text
            x="50"
            y="92"
            textAnchor="middle"
            fill="currentColor"
            fontSize="8"
            fontWeight="700"
            letterSpacing="2.5"
            fontFamily="system-ui, sans-serif"
            opacity="0.9"
          >
            HOOK JAIN
          </text>
        )}
      </svg>
    </div>
  );
};
