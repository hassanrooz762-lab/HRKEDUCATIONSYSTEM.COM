import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CrestProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'full';
  showText?: boolean;
}

export const Crest: React.FC<CrestProps> = ({
  size = 'md',
  variant = 'light',
  showText = true,
}) => {
  const { isUrdu } = useLanguage();

  const iconSize = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  const textSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const subSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Visual Emblem Shield */}
      <div className={`relative ${iconSize} flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 100 115"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Shield Border */}
          <path
            d="M50 4L92 20V58C92 84 72 104 50 112C28 104 8 84 8 58V20L50 4Z"
            className="fill-red-800 stroke-yellow-500"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Accent Inset */}
          <path
            d="M50 11L85 24V56C85 78 68 96 50 103C32 96 15 78 15 56V24L50 11Z"
            className="fill-red-950 stroke-yellow-400/40"
            strokeWidth="1.5"
          />

          {/* Central Heraldic Ribbon Header */}
          <path
            d="M20 28H80V36H20V28Z"
            className="fill-yellow-500"
          />
          <text
            x="50"
            y="34"
            textAnchor="middle"
            fill="#7f1d1d"
            fontSize="6.5"
            fontWeight="900"
            letterSpacing="1.5"
            fontFamily="sans-serif"
          >
            PESHAWAR CANTT
          </text>

          {/* Open Academic Book */}
          <path
            d="M50 64C44 60 34 60 26 62V78C34 76 44 76 50 80C56 76 66 76 74 78V62C66 60 56 60 50 64Z"
            fill="#F8FAFC"
            stroke="#0F172A"
            strokeWidth="1"
          />
          <line x1="50" y1="64" x2="50" y2="80" stroke="#0F172A" strokeWidth="1.5" />

          {/* Knowledge Torch Flame */}
          <path
            d="M50 42C48 45 47 48 48 51C49 53 51 54 50 56C49 54 46 51 47 48C48 45 50 43 50 42Z"
            fill="#F59E0B"
          />
          <path
            d="M50 40C52 44 54 47 52 50C51 52 49 53 50 55C52 53 55 49 53 45C52 42 50 40 50 40Z"
            fill="#EF4444"
          />
          <rect x="48" y="55" width="4" height="6" rx="1" fill="#D97706" />

          {/* HRK Monogram in Center */}
          <text
            x="50"
            y="94"
            textAnchor="middle"
            fill="#FBBF24"
            fontSize="11"
            fontWeight="900"
            letterSpacing="2.5"
            fontFamily="serif"
          >
            HRK
          </text>

          {/* Stars */}
          <circle cx="34" cy="50" r="1.8" fill="#FBBF24" />
          <circle cx="66" cy="50" r="1.8" fill="#FBBF24" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif-brand font-bold tracking-tight ${textSize} ${
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              HRK <span className="text-red-700">EDUCATION SYSTEM</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold tracking-wider ${subSize} ${
                variant === 'dark' ? 'text-yellow-400' : 'text-red-800'
              }`}
            >
              {isUrdu ? 'پشاور کینٹ، پاکستان' : 'Peshawar Cantt, Pakistan'}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            <span className={`hidden sm:inline-block ${subSize} ${variant === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
              {isUrdu ? 'قیام: ۲۰۱۵' : 'Est. 2015'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
