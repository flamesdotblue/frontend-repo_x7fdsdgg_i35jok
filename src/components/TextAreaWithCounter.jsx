import React, { useEffect, useMemo, useState } from 'react';

const countWords = (text) => {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
};

const TextAreaWithCounter = ({
  label,
  value,
  onChange,
  minWords = 0,
  maxWords = 200,
  placeholder,
  id,
}) => {
  const [touched, setTouched] = useState(false);
  const words = useMemo(() => countWords(value || ''), [value]);
  const withinRange = words >= minWords && words <= maxWords;

  useEffect(() => {
    if (touched && !withinRange) return;
  }, [touched, withinRange]);

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-white/90">
        {label}
      </label>
      <textarea
        id={id}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        className={`min-h-[110px] w-full resize-y rounded-xl border bg-white/10 p-3 text-white placeholder-white/50 outline-none backdrop-blur-md transition focus:ring-2 focus:ring-blue-400/60 ${
          withinRange ? 'border-white/20' : 'border-[#ef4444]/60'
        }`}
      />
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className={`${withinRange ? 'text-white/60' : 'text-[#ef4444]'} `}>
          {minWords > 0 || maxWords < 999 ? `Words: ${words} (min ${minWords}${maxWords ? `, max ${maxWords}` : ''})` : `Words: ${words}`}
        </span>
        {!withinRange && (
          <span className="text-[#ef4444]">Please keep between {minWords} and {maxWords} words.</span>
        )}
      </div>
    </div>
  );
};

export default TextAreaWithCounter;
