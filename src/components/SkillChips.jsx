import React from 'react';

const Chip = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
      active
        ? 'bg-[#3b82f6]/20 text-white ring-1 ring-[#3b82f6]/40'
        : 'bg-white/10 text-white/80 hover:bg-white/20 ring-1 ring-white/15'
    }`}
    aria-pressed={active}
  >
    {label}
  </button>
);

const SkillChips = ({ title, options = [], selected = [], onToggle, otherValue, onOtherChange }) => {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-white/90">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Chip key={opt} label={opt} active={selected.includes(opt)} onClick={() => onToggle(opt)} />
        ))}
      </div>
      <div className="mt-3">
        <label className="mb-1 block text-xs text-white/70">Others</label>
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="e.g., AWS, Figma"
          className="w-full rounded-lg border border-white/20 bg-white/10 p-2 text-white placeholder-white/50 outline-none backdrop-blur-md focus:ring-2 focus:ring-blue-400/60"
        />
      </div>
    </div>
  );
};

export default SkillChips;
