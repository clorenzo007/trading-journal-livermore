import { useEffect, useState } from "react";
import {
  getSetups,
  createSetup,
  updateSetup,
  deleteSetup,
  uploadSetupImage,
} from "../api/setups";
import FullscreenViewer from "../components/FullscreenViewer";

export default function Entries() {
  const [setups, setSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSetup, setEditingSetup] = useState(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await getSetups();
      setSetups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const openAdd = () => {
    setEditingSetup({ title: "", description: "", type: "Bullish" });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditingSetup(s);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este setup?")) return;
    try {
      await deleteSetup(id);
      setSetups((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Error eliminando setup");
    }
  };

  const bullishSetups = setups.filter((s) => s.type === "Bullish");
  const bearishSetups = setups.filter((s) => s.type === "Bearish");

  return (
    <div className="w-full px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-12 text-zinc-200">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-100">Entry Setups</h1>
            <p className="text-zinc-400">
              Configuraciones operativas personalizadas
            </p>
          </div>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
          >
            + Nuevo Setup
          </button>
        </header>

        {loading ? (
          <div className="py-20 text-center text-zinc-500">Cargando setups...</div>
        ) : (
          <>
            {/* ===== ALCISTAS ===== */}
            <section className="space-y-8">
              <SectionTitle>Tendencias Alcistas</SectionTitle>
              {bullishSetups.length === 0 && (
                <div className="text-zinc-600 text-sm italic">Sin setups alcistas</div>
              )}
              <div className="grid grid-cols-1 gap-8">
                {bullishSetups.map((s) => (
                  <SetupCard
                    key={s._id}
                    setup={s}
                    onEdit={() => openEdit(s)}
                    onDelete={() => handleDelete(s._id)}
                    onView={(url) => setViewer(url)}
                  />
                ))}
              </div>
            </section>

            {/* ===== BAJISTAS ===== */}
            <section className="space-y-8">
              <SectionTitle>Tendencias Bajistas</SectionTitle>
              {bearishSetups.length === 0 && (
                <div className="text-zinc-600 text-sm italic">Sin setups bajistas</div>
              )}
              <div className="grid grid-cols-1 gap-8">
                {bearishSetups.map((s) => (
                  <SetupCard
                    key={s._id}
                    setup={s}
                    onEdit={() => openEdit(s)}
                    onDelete={() => handleDelete(s._id)}
                    onView={(url) => setViewer(url)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {showModal && (
        <SetupModal
          initial={editingSetup}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            load();
          }}
        />
      )}

      {viewer && (
        <FullscreenViewer src={viewer} onClose={() => setViewer(null)} />
      )}
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function SectionTitle({ children }) {
  return (
    <h2 className="text-2xl font-semibold text-zinc-100 border-b border-zinc-800 pb-2">
      {children}
    </h2>
  );
}

function SetupCard({ setup, onEdit, onDelete, onView }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-zinc-100">{setup.title}</h3>
          <p className="text-sm text-zinc-400">{setup.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-rose-900/20 rounded-lg text-zinc-400 hover:text-rose-400 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <ImageBlock src={setup.theoryImage?.url} label="Teoría" onClick={() => onView(setup.theoryImage?.url)} />
        <ImageBlock src={setup.exampleImage?.url} label="Ejemplo" onClick={() => onView(setup.exampleImage?.url)} />
      </div>
    </div>
  );
}

function ImageBlock({ src, label, onClick }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
        {label}
      </div>
      <div 
        className={`aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center ${src ? 'cursor-zoom-in' : ''}`}
        onClick={src ? onClick : undefined}
      >
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-cover hover:scale-105 transition-transform" />
        ) : (
          <span className="text-zinc-700 text-xs italic">Sin imagen</span>
        )}
      </div>
    </div>
  );
}

function SetupModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initial._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let saved;
      if (isEdit) {
        saved = await updateSetup(initial._id, form);
      } else {
        saved = await createSetup(form);
      }
      onSaved(saved);
    } catch (err) {
      alert("Error guardando setup");
    } finally {
      setLoading(false);
    }
  };

  async function handleImageUpload(field, file) {
    if (!initial._id) {
       alert("Primero guarda el setup antes de subir imágenes");
       return;
    }
    try {
      setLoading(true);
      const updated = await uploadSetupImage(initial._id, field, file);
      setForm(updated);
    } catch (err) {
      alert("Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 space-y-6 shadow-2xl"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {isEdit ? "Editar Setup" : "Nuevo Setup"}
          </h2>
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Título</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
              placeholder="Ej: Sweep + BOS"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="Bullish">Bullish</option>
              <option value="Bearish">Bearish</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none h-20"
            placeholder="Breve explicación del setup..."
          />
        </div>

        {isEdit && (
          <div className="grid grid-cols-2 gap-4 pt-2">
             <div className="space-y-2 text-center">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Img Teoría</div>
                <input type="file" onChange={(e) => handleImageUpload("theory", e.target.files[0])} className="text-xs w-full"/>
             </div>
             <div className="space-y-2 text-center">
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Img Ejemplo</div>
                <input type="file" onChange={(e) => handleImageUpload("example", e.target.files[0])} className="text-xs w-full"/>
             </div>
          </div>
        )}

        {!isEdit && (
          <div className="text-xs text-zinc-500 italic bg-zinc-800/30 p-2 rounded">
            Nota: Podrás subir imágenes una vez que guardes el setup básico.
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? "Guardando..." : "Guardar Setup"}
          </button>
        </div>
      </form>
    </div>
  );
}
