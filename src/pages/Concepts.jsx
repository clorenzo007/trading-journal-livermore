import { useEffect, useState } from "react";
import {
  getConcepts,
  createConcept,
  updateConcept,
  deleteConcept,
  updateConceptsOrder,
} from "../api/concepts";
import FullscreenViewer from "../components/FullscreenViewer";

/**
 * Concepts / Playbook Page.
 * A knowledge base for the user's trading concepts and strategies (e.g., ICT concepts).
 * 
 * Features:
 * - Sidebar navigation for quick access to concepts.
 * - Rich content display with text, lists, and images.
 * - CRUD operations for concepts.
 * - Reorder capability.
 */
export default function Concepts() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingConcept, setEditingConcept] = useState(null);
  const [viewer, setViewer] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getConcepts();
      setConcepts(data);
    } catch (err) {
      console.error(err);
      setError("Error cargando conceptos. Por favor revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  const openAdd = () => {
    setEditingConcept({ title: "", subtitle: "", description: "", items: [""], note: "" });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingConcept(c);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este concepto?")) return;
    try {
      await deleteConcept(id);
      setConcepts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Error eliminando concepto");
    }
  };

  const moveConcept = async (idx, direction) => {
    const newConcepts = [...concepts];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newConcepts.length) return;

    // Swap
    [newConcepts[idx], newConcepts[targetIdx]] = [newConcepts[targetIdx], newConcepts[idx]];
    
    // Optimistic update
    setConcepts(newConcepts);

    try {
      const orders = newConcepts.map((c, i) => ({ id: c._id, order: i }));
      await updateConceptsOrder(orders);
    } catch (err) {
      console.error("Failed to update order", err);
      load(); // Rollback
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 font-geist">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Contenido
            </h2>

            <nav className="space-y-2 text-sm">
              {concepts.map((c) => (
                <NavLink key={c._id} href={`#${c._id}`}>{c.title}</NavLink>
              ))}
              {concepts.length === 0 && !loading && <p className="text-zinc-600 italic">Sin conceptos</p>}
            </nav>
          </div>
        </aside>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 space-y-12 text-zinc-200">
          {/* ===== HEADER ===== */}
          <header className="flex justify-between items-end">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-zinc-100 italic tracking-tight">ICT Concepts</h1>
              <p className="text-zinc-500 font-medium">
                Tu biblioteca personalizada de conceptos operativos
              </p>
            </div>
            <button
              onClick={openAdd}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-zinc-500/10 active:scale-95"
            >
              + Nuevo Concepto
            </button>
          </header>

          {loading ? (
            <div className="py-20 text-center text-zinc-500 font-medium animate-pulse">Sincronizando biblioteca...</div>
          ) : (
            <div className="space-y-16">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
                  {error}
                </div>
              )}

              {!error && concepts.map((concept) => (
                <Section key={concept._id} id={concept._id} title={concept.title}>
                  <Card>
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-zinc-100">{concept.subtitle || concept.title}</h3>
                            <div className="flex items-center gap-3">
                               <div className="flex flex-col gap-1 mr-2">
                                  <button onClick={() => moveConcept(concepts.indexOf(concept), -1)} className="text-zinc-600 hover:text-zinc-300 transition-colors">▲</button>
                                  <button onClick={() => moveConcept(concepts.indexOf(concept), 1)} className="text-zinc-600 hover:text-zinc-300 transition-colors">▼</button>
                               </div>
                               <button onClick={() => openEdit(concept)} className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest">Editar</button>
                               <button onClick={() => handleDelete(concept._id)} className="text-xs font-bold text-rose-900/60 hover:text-rose-400 transition-colors uppercase tracking-widest">Borrar</button>
                            </div>
                         </div>
                        
                        {concept.description && (
                          <p className="text-zinc-400 text-sm leading-relaxed mb-4">{concept.description}</p>
                        )}

                        {concept.items && concept.items.length > 0 && (
                          <ul className="space-y-3">
                            {concept.items.filter(i => i.trim()).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-zinc-300 text-sm">
                                 <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-2 shrink-0" />
                                 {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        {concept.note && (
                          <div className="mt-6 pt-6 border-t border-zinc-800/50">
                            <Note>
                              {concept.note}
                            </Note>
                          </div>
                        )}
                      </div>

                      {concept.image?.url && (
                        <div className="w-full lg:w-72 shrink-0">
                          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Diagrama / Visual</div>
                          <div 
                            className="aspect-square bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center cursor-zoom-in group"
                            onClick={() => setViewer(concept.image.url)}
                          >
                            <img src={concept.image.url} alt={concept.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </Section>
              ))}

              {!error && concepts.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                   <p className="text-zinc-600 text-sm font-medium">Comienza por añadir tu primer concepto de trading</p>
                </div>
              )}
            </div>
          )}
          
          <div className="pt-20 border-t border-zinc-800">
             <a
                href="/entries"
                className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
              >
                Ver setups de entrada detallados <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
          </div>
        </main>
      </div>

      {showModal && (
        <ConceptModal
          initial={editingConcept}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            load();
          }}
        />
      )}

      {viewer && <FullscreenViewer src={viewer} onClose={() => setViewer(null)} />}
    </div>
  );
}

/* ================= MODAL COMPONENT ================= */

function ConceptModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initial._id);

  const addItem = () => setForm({ ...form, items: [...form.items, ""] });
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  const updateItem = (idx, val) => {
    const next = [...form.items];
    next[idx] = val;
    setForm({ ...form, items: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let payload = form;
      if (form.localFile) {
        const formData = new FormData();
        Object.keys(form).forEach(key => {
          if (key === 'items') {
            formData.append(key, JSON.stringify(form[key]));
          } else if (key === 'localFile') {
            formData.append('file', form[key]);
          } else {
            formData.append(key, form[key]);
          }
        });
        payload = formData;
      }

      if (isEdit) {
        await updateConcept(initial._id, payload);
      } else {
        await createConcept(payload);
      }
      onSaved();
    } catch (err) {
      alert("Error al guardar el concepto");
    } finally {
      setLoading(false);
    }
  };

  async function handleImageSelect(file) {
    if (!file) return;
    setForm({ ...form, localFile: file, localPreview: URL.createObjectURL(file) });
    
    // If editing, we still allow immediate upload if preferred, 
    // but now we also support saving everything together.
    // For now, let's just stage it.
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-[2rem] w-full max-w-2xl p-8 my-auto space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-300"
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {isEdit ? "Editar Concepto" : "Nuevo Concepto"}
            </h2>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Información técnica</p>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-all">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Título de Sección (Barra Lateral)">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="form-input"
              placeholder="Ej: Liquidez"
            />
          </InputGroup>
          <InputGroup label="Subtítulo Principal (Opcional)">
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="form-input"
              placeholder="Ej: External Range Liquidity"
            />
          </InputGroup>
        </div>

        <InputGroup label="Descripción">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="form-input min-h-[100px] py-3"
            placeholder="Explica el concepto brevemente..."
          />
        </InputGroup>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Puntos Clave / Pasos</label>
            <button type="button" onClick={addItem} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">+ Añadir punto</button>
          </div>
          <div className="space-y-2">
            {form.items.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={item}
                  onChange={(e) => updateItem(idx, e.target.value)}
                  className="form-input"
                  placeholder={`Punto ${idx + 1}`}
                />
                <button 
                  type="button" 
                  onClick={() => removeItem(idx)} 
                  className="px-3 text-zinc-600 hover:text-rose-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Imagen / Diagrama">
            <input
              type="file"
              onChange={(e) => handleImageSelect(e.target.files[0])}
              className="text-xs text-zinc-500 file:bg-zinc-800 file:text-zinc-200 file:border-none file:rounded-lg file:px-3 file:py-1.5 file:mr-4 file:hover:bg-zinc-700 transition-all cursor-pointer"
            />
            {form.localPreview && (
              <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-zinc-800">
                <img src={form.localPreview} className="w-full h-full object-cover" />
              </div>
            )}
          </InputGroup>
          <InputGroup label="Nota / Recomendación">
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="form-input h-20"
              placeholder="Consejos o advertencias..."
            />
          </InputGroup>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
          >
            Descartar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl text-sm font-bold text-white transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            {loading ? "Sincronizando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

/* ===== UI HELPERS ===== */

function Section({ id, title, children }) {
  return (
    <section id={id} className="space-y-6 scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children }) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-[2rem] p-8 shadow-2xl hover:border-zinc-700/50 transition-colors">
      {children}
    </div>
  );
}

function Note({ children }) {
  return (
    <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-2xl p-6 text-sm text-indigo-200/80 leading-relaxed italic">
      <span className="text-indigo-400 font-bold mr-2 not-italic tracking-widest uppercase text-[10px]">Insider Tip</span> {children}
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="block text-zinc-500 hover:text-zinc-100 font-medium transition-all hover:translate-x-1"
    >
      {children}
    </a>
  );
}
