import React from 'react';

const LOGOS = [
  'LeetCode',
  'HackerRank',
  'NPTEL',
  'Coursera',
  'Oracle',
  'LinkedIn',
];

const LogoSelector = ({ selected = [], onToggle }) => {
  const max = 4;
  const isSelected = (name) => selected.includes(name);
  const canSelectMore = selected.length < max;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white/90">Logo Selection (Choose exactly 4)</h4>
        <span className={`text-xs ${selected.length === max ? 'text-[#10b981]' : 'text-white/70'}`}>
          {selected.length}/{max}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {LOGOS.map((name) => {
          const active = isSelected(name);
          const disabled = !active && !canSelectMore;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onToggle(name)}
              disabled={disabled}
              aria-pressed={active}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl border p-2 text-center text-xs font-medium transition ${
                active
                  ? 'border-[#3b82f6]/50 bg-[#3b82f6]/15 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
                  : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
              } ${disabled ? 'opacity-50' : ''}`}
            >
              <div className="mb-1 h-6 w-6 rounded-full bg-white/30" aria-hidden />
              <span>{name}</span>
            </button>
          );
        })}
      </div>
      {selected.length !== max && (
        <p className="mt-2 text-xs text-[#ef4444]">Please select exactly 4 logos.</p>
      )}
    </div>
  );
};

export default LogoSelector;
