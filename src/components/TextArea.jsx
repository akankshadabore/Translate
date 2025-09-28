import { useState } from 'react';

function TextArea({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <textarea
        className={`w-full p-4 border-2 rounded-xl resize-none transition-all duration-200 min-h-[120px] 
          ${focused 
            ? 'border-indigo-400 shadow-lg shadow-indigo-100 bg-indigo-50/30' 
            : 'border-gray-200 hover:border-gray-300'
          } 
          focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400`}
        rows="5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={5000}
      />
      
      {value && (
        <div className="absolute bottom-2 right-3 text-xs text-gray-400 bg-white px-1 rounded">
          {value.length}/5000
        </div>
      )}
      
      {focused && (
        <div className="absolute -top-1 left-4 px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full transform -translate-y-1/2">
          Type here
        </div>
      )}
    </div>
  );
}

export default TextArea;