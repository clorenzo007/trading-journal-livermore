import { useState } from "react";
import Modal from "./Modal";

export default function PromptModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "Enter value...",
  type = "text",
}) {
  const [value, setValue] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(value);
    setValue("");
  };

  return (
    <Modal open={open} onClose={() => { setValue(""); onClose(); }}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-2 text-center">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
           </svg>
        </div>
        
        <div className="px-4">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h2>
          <p className="text-sm text-zinc-400 mb-6">{message}</p>
          
          <input
            autoFocus
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => { setValue(""); onClose(); }}
            className="flex-1 bg-zinc-800/80 rounded-2xl py-3 hover:bg-zinc-700 transition-all font-semibold text-sm text-zinc-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 bg-indigo-600 rounded-2xl py-3 hover:bg-indigo-500 transition-all font-bold text-sm shadow-lg shadow-indigo-900/20"
          >
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
}
