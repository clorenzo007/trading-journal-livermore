import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function ConceptFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    items: [],
    note: "",
  });

  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        items: initialData.items || [],
        note: initialData.note || "",
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        items: [],
        note: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setFormData({ ...formData, items: [...formData.items, newItem] });
    setNewItem("");
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit Concept" : "New Concept"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Liquidity"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Subtitle (Optional)</label>
            <input
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Bullish Impulse"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors min-h-[100px]"
              placeholder="Detailed explanation..."
            />
          </div>

          {/* Items List */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Key Points / Items</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                placeholder="Add a point..."
              />
              <button
                type="button"
                onClick={addItem}
                className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <ul className="space-y-2">
              {formData.items.map((item, i) => (
                <li key={i} className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Note (Optional)</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder="Important note..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {initialData ? "Save Changes" : "Create Concept"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
