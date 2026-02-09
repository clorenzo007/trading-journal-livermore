import { useEffect, useRef, useState } from "react";

/**
 * Inline Editable Table Cell.
 * Allows editing value directly within a table.
 * 
 * Modes:
 * - Text input
 * - Number input
 * - Select dropdown
 * - Textarea
 * 
 * Features:
 * - Double click to edit.
 * - Esc to cancel, Enter/Blur to save.
 */
export default function EditableCell({
  value,
  type = "text",
  onSave,
  options = [],
  className = "",
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const startEdit = () => {
    setEditing(true);
    setError(null);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    setError(null);
  };

  const save = async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);
      await onSave(draft);
      setEditing(false);
    } catch {
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  };

  if (editing) {
    return (
      <td className={`px-2 py-1 ${className}`}>
        {type === "select" ? (
          <select
            ref={inputRef}
            value={draft || ""}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKey}
            className="bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 w-full"
          >
            <option value="">—</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            ref={inputRef}
            value={draft || ""}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKey}
            className="bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 w-full"
          />
        ) : (
          <input
            ref={inputRef}
            type={type}
            value={draft || ""}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKey}
            className="bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 w-full"
          />
        )}

        {loading && <div className="text-xs text-zinc-400 mt-1">Saving…</div>}
        {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
      </td>
    );
  }

  return (
    <td
      onDoubleClick={startEdit}
      className={`px-2 py-1 cursor-pointer hover:bg-zinc-800 ${className}`}
      title="Double click to edit"
    >
      {value ?? "—"}
    </td>
  );
}
