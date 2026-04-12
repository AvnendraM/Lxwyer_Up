import React from 'react';

const GoldenStars = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 3 + 1; // 1px to 4px
          const left = Math.random() * 100 + '%';
          const animationDuration = Math.random() * 20 + 20 + 's';
          const animationDelay = Math.random() * -40 + 's';
          const opacity = Math.random() * 0.4 + 0.1; // Subtle opacity
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-[#d4af37]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: left,
                bottom: '-10px',
                opacity: opacity,
                boxShadow: `0 0 ${size * 2}px #d4af37`,
                animation: `floatUp ${animationDuration} linear infinite`,
                animationDelay: animationDelay,
              }}
            />
          );
        })}
      </div>
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
          50% {
             transform: translateY(-50vh) scale(1.2) rotate(180deg);
             opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) scale(0.8) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GoldenStars;
