import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Reusable Mobile-Friendly Search and Select Input.
 * Displays a custom dropdown overlay that supports full text wrapping,
 * preventing mobile keyboard autocomplete truncation.
 */
export default function SearchSelect({ label, value, onChange, placeholder, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const containerRef = useRef(null);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Normalize options to objects with { id, text }
  const normalizedOptions = options.map((opt, index) => {
    if (typeof opt === "string") {
      return { id: `string-${index}-${opt}`, text: opt };
    }
    return { id: opt._id || opt.id || `obj-${index}`, text: opt.title || opt.name || opt.text || "" };
  });

  // Filter options based on user typing
  const filteredOptions = normalizedOptions.filter(opt =>
    opt.text.toLowerCase().includes((value || "").toLowerCase())
  );

  const handleSelect = (text) => {
    onChange(text);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block text-sm text-zinc-400 mb-1">{label}</label>}
      <input
        type="text"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
        value={value || ""}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.text)}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors break-words whitespace-normal"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2.5 text-sm text-zinc-500 italic">
              {value?.trim() ? t("No matches found.") : t("No options available.")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
