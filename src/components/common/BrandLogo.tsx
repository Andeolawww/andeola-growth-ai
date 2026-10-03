import React from 'react';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const textSizes = {
    sm: 'text-sm tracking-tight',
    md: 'text-base tracking-tight',
    lg: 'text-xl tracking-tight',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold select-none ${className}`}>
      {/* Abstract Growth & Connection Emblem with AG initials */}
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-900/30 border border-blue-400/20 shrink-0 group`}
      >
        <span className="relative z-10 font-mono tracking-tighter">AG</span>
        {/* Subtle accent glow node */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`${textSizes[size]} font-extrabold tracking-wide text-white uppercase`}>
              Andeola
            </span>
            <span className="text-xs uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 tracking-wider">
              Growth AI
            </span>
          </div>
          {size === 'lg' && (
            <span className="text-[10px] text-slate-400 tracking-normal mt-0.5 font-medium">
              Autonomous Prospecting Engine
            </span>
          )}
        </div>
      )}
    </div>
  );
};
