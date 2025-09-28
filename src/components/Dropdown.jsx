import { useState, useEffect, useRef } from "react";

export const languages = [
  { code: "auto", label: "Auto Detect", flag: "🔍" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "zh-CN", label: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-TW", label: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "pt-BR", label: "Portuguese (Brazil)", flag: "🇧🇷" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "tr", label: "Turkish", flag: "🇹🇷" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "sv", label: "Swedish", flag: "🇸🇪" },
  { code: "da", label: "Danish", flag: "🇩🇰" },
  { code: "no", label: "Norwegian", flag: "🇳🇴" },
  { code: "fi", label: "Finnish", flag: "🇫🇮" },
  { code: "pl", label: "Polish", flag: "🇵🇱" },
  { code: "cs", label: "Czech", flag: "🇨🇿" },
  { code: "sk", label: "Slovak", flag: "🇸🇰" },
  { code: "hu", label: "Hungarian", flag: "🇭🇺" },
  { code: "ro", label: "Romanian", flag: "🇷🇴" },
  { code: "bg", label: "Bulgarian", flag: "🇧🇬" },
  { code: "hr", label: "Croatian", flag: "🇭🇷" },
  { code: "sr", label: "Serbian", flag: "🇷🇸" },
  { code: "uk", label: "Ukrainian", flag: "🇺🇦" },
  { code: "th", label: "Thai", flag: "🇹🇭" },
  { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
  { code: "id", label: "Indonesian", flag: "🇮🇩" },
  { code: "ms", label: "Malay", flag: "🇲🇾" },
  { code: "tl", label: "Filipino", flag: "🇵🇭" },
  { code: "sw", label: "Swahili", flag: "🇰🇪" },
  { code: "he", label: "Hebrew", flag: "🇮🇱" },
  { code: "fa", label: "Persian", flag: "🇮🇷" },
  { code: "ur", label: "Urdu", flag: "🇵🇰" },
  { code: "bn", label: "Bengali", flag: "🇧🇩" },
  { code: "ta", label: "Tamil", flag: "🇱🇰" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
  { code: "pa", label: "Punjabi", flag: "🇮🇳" },
];

function Dropdown({ 
  value, 
  onChange, 
  includeAutoDetect = false, 
  placeholder = "Select language",
  excludeValue = null 
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  let availableLanguages = languages;
  
  if (!includeAutoDetect) {
    availableLanguages = availableLanguages.filter(lang => lang.code !== "auto");
  }
  
  if (excludeValue) {
    availableLanguages = availableLanguages.filter(lang => lang.code !== excludeValue);
  }
  
  const filteredLanguages = availableLanguages.filter(lang =>
    lang.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLang = languages.find((l) => l.code === value);

  const handleSelect = (langCode) => {
    onChange(langCode);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`w-full flex justify-between items-center px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white
          ${open 
            ? 'border-indigo-400 shadow-lg shadow-indigo-100' 
            : 'border-gray-200 hover:border-gray-300'
          }`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          {selectedLang?.flag && <span className="text-lg">{selectedLang.flag}</span>}
          <span className="font-medium text-gray-700">
            {selectedLang?.label || placeholder}
          </span>
          {selectedLang?.code === "auto" && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              Smart
            </span>
          )}
        </div>
        
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border-2 border-indigo-200 rounded-xl shadow-xl z-20 overflow-hidden max-h-80">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
          
          <ul className="max-h-60 overflow-y-auto">
            {includeAutoDetect && filteredLanguages.some(lang => lang.code === "auto") && (
              <li>
                <button
                  onClick={() => handleSelect("auto")}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100
                    ${value === "auto" ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}`}
                >
                  <span className="text-lg">🔍</span>
                  <div>
                    <span className="font-medium">Auto Detect</span>
                    <div className="text-xs text-gray-500">Let AI detect the language</div>
                  </div>
                  {value === "auto" && (
                    <span className="ml-auto text-blue-500">✓</span>
                  )}
                </button>
              </li>
            )}

            {filteredLanguages.filter(lang => lang.code !== "auto").length > 0 ? (
              filteredLanguages.filter(lang => lang.code !== "auto").map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors duration-150 flex items-center gap-3
                      ${value === lang.code ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'}
                      ${excludeValue === lang.code ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={excludeValue === lang.code}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {value === lang.code && (
                      <span className="ml-auto text-indigo-500">✓</span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-500 text-sm text-center">
                No languages found matching "{searchTerm}"
              </li>
            )}
          </ul>

          <div className="p-2 text-xs text-gray-500 text-center bg-gray-50 border-t">
            {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} available
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;



