import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  getConcepts, 
  createConcept, 
  updateConcept, 
  deleteConcept, 
  updateConceptsOrder 
} from "../api/concepts";
import { Plus, Edit2, Trash2, Save, MoveVertical } from "lucide-react";
import ConceptFormModal from "../components/concepts/ConceptFormModal";

export default function Concepts() {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState(null);

  useEffect(() => {
    loadConcepts();
  }, []);

  const loadConcepts = async () => {
    try {
      const data = await getConcepts();
      setConcepts(data);
    } catch (err) {
      console.error("Failed to load concepts", err);
    } finally {
      setLoading(false);
    }
  };

  const handeSave = async (formData) => {
    console.log("Saving concept...", { editingConcept, formData });
    try {
      if (editingConcept) {
        console.log("Updating existing concept:", editingConcept._id);
        await updateConcept(editingConcept._id, formData);
      } else {
        console.log("Creating new concept");
        await createConcept(formData);
      }
      loadConcepts();
      setEditingConcept(null);
    } catch (err) {
      console.error("Error saving concept", err);
      alert("Failed to save concept: " + (err.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this concept?")) return;
    try {
      await deleteConcept(id);
      loadConcepts();
    } catch (err) {
      console.error("Error deleting concept", err);
      alert("Failed to delete concept");
    }
  };

  const openNewModal = () => {
    setEditingConcept(null);
    setIsModalOpen(true);
  };

  const openEditModal = (concept) => {
    setEditingConcept(concept);
    setIsModalOpen(true);
  };

  // Helper to slugify title for IDs
  const toSlug = (text) => text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  return (
    <div className="w-full px-6 py-6 fade-in">
      <ConceptFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handeSave}
        initialData={editingConcept}
      />

      <div className="max-w-7xl mx-auto flex gap-8">

        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Contenido
            </h2>

            <nav className="space-y-2 text-sm flex flex-col">
              {concepts.map((c) => (
                <a
                  key={c._id}
                  href={`#${toSlug(c.title)}`}
                  className="block text-zinc-400 hover:text-white hover:bg-zinc-800/50 px-3 py-2 rounded-md transition-colors"
                >
                  {c.title}
                </a>
              ))}
              <button 
                onClick={openNewModal}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 px-3 py-2 mt-4 font-medium"
              >
                <Plus size={16} /> New Concept
              </button>
            </nav>
          </div>
        </aside>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 space-y-12 text-zinc-200">

          {/* ===== HEADER ===== */}
          <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-zinc-100">
                ICT Concepts
              </h1>
              <p className="text-zinc-400">
                Liquidez, estructura, dirección y criterios de entrada.
              </p>
            </div>
            <button
              onClick={openNewModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Add Concept
            </button>
          </header>

          {/* ===== LIST ===== */}
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Loading concepts...</div>
          ) : concepts.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-900/50">
              <p className="mb-4">No concepts found.</p>
              <button onClick={openNewModal} className="text-indigo-400 hover:underline">
                Create your first concept
              </button>
            </div>
          ) : (
            concepts.map((concept) => (
              <section 
                key={concept._id} 
                id={toSlug(concept.title)} 
                className="scroll-mt-24 group relative"
              >
                <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                  <h2 className="text-2xl font-semibold text-zinc-100">
                    {concept.title}
                  </h2>
                  <div className="flex gap-2 opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(concept)}
                      className="p-1.5 text-zinc-400 hover:text-indigo-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(concept._id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm hover:border-zinc-700 transition-colors">
                  {concept.image?.url && (
                    <div className="mb-6 rounded-lg overflow-hidden border border-zinc-700 shadow-md">
                      <img 
                        src={concept.image.url} 
                        alt={concept.title} 
                        className="w-full max-h-[500px] object-contain bg-black/50" 
                      />
                    </div>
                  )}

                  {concept.subtitle && (
                    <h3 className="text-xl font-bold text-white mb-2">
                      {concept.subtitle}
                    </h3>
                  )}

                  {concept.description && (
                    <div className="text-zinc-300 mb-4 whitespace-pre-wrap">
                      {concept.description}
                    </div>
                  )}

                  {concept.items && concept.items.length > 0 && (
                    <ul className="list-decimal list-inside space-y-2 text-zinc-300 mb-4">
                      {concept.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {concept.note && (
                    <div className="mt-4 bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-300">
                      <strong className="text-indigo-400 block mb-1">Nota:</strong> {concept.note}
                    </div>
                  )}
                  
                   {/* Special Link Case for "Entradas" - keeping legacy link if title matches */}
                   {concept.title.toLowerCase().includes("entrada") && (
                      <Link
                        to="/entries"
                        className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        → Ver setups de entrada
                      </Link>
                   )}
                </div>
              </section>
            ))
          )}

        </main>
      </div>
    </div>
  );
}
