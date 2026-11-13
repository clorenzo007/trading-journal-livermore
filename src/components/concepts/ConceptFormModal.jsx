import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ConceptFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    items: [],
    note: "",
  });

  const [newItem, setNewItem] = useState("");
  const { t } = useLanguage();

  /* New State for Images */
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        items: initialData.items || [],
        note: initialData.note || "",
      });
      
      // Combine legacy image and new images array for preview
      const existingImages = initialData.images?.map(img => img.url) || [];
      if (existingImages.length === 0 && initialData.image?.url) {
        existingImages.push(initialData.image.url);
      }
      setImagePreviews(existingImages);
    } else {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        items: [],
        note: "",
      });
      setImagePreviews([]);
    }
    setFiles([]);
  }, [initialData, isOpen]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (files.length > 0 || !initialData) { // If creating new or has files
       // Note: logic is slightly modified. 
       // For edit: we only send NEW files. Old files are preserved by backend logic (append).
       // If we wanted to delete old files, we'd need a delete tracking mechanism.
       // For now, simple append.
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle || ""); // Ensure string
    data.append("description", formData.description || "");
    data.append("note", formData.note || "");
    data.append("items", JSON.stringify(formData.items)); 
    
    if (files.length > 0) {
       files.forEach(file => {
         data.append("files", file);
       });
    }

    // Pass data even if no files (for text updates)
    onSubmit(data);
    
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
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-xl font-bold text-white">
            {initialData ? t("Edit Concept") : t("New Concept")}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t("Images (Optional)")}</label>
            <div className="space-y-4">
              {/* Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 shrink-0 relative group">
                      <img src={src} alt={`${t("Preview")} ${idx}`} className="w-full h-full object-cover" />
                      {/* TODO: Add delete button for specific images if we implement delete logic */}
                    </div>
                  ))}
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer w-full"
              />
              <p className="text-xs text-zinc-500">
                {t("Select one or more files. New files will be appended to existing ones.")}
              </p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t("Title")}</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder={t("e.g. Liquidity")}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t("Subtitle (Optional)")}</label>
            <input
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder={t("e.g. Bullish Impulse")}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t("Description (Optional)")}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors min-h-[100px]"
              placeholder={t("Detailed explanation...")}
            />
          </div>

          {/* Items List */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t("Key Points / Items")}</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                placeholder={t("Add a point...")}
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
                <li key={i} className="flex gap-2 items-center bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300">
                  <input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...formData.items];
                      newItems[i] = e.target.value;
                      setFormData({ ...formData, items: newItems });
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-zinc-300 placeholder-zinc-600 focus:text-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                    tabIndex="-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t("Note (Optional)")}</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder={t("Important note...")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {initialData ? t("Save Changes") : t("Create Concept")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
