/**
 * Column Filter Component.
 * Used in tables to filter data by specific columns.
 * Supports:
 * - Text search (contains).
 * - Number range (min/max).
 */
export default function ColumnFilter({ value, onChange, type = "text" }) {
  if (type === "number") {
    return (
      <div className="flex gap-1">
        <input
          type="number"
          placeholder="min"
          value={value?.min ?? ""}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          className="w-16 px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded"
        />
        <input
          type="number"
          placeholder="max"
          value={value?.max ?? ""}
          onChange={(e) => onChange({ ...value, max: e.target.value })}
          className="w-16 px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded"
        />
      </div>
    );
  }

  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded"
    />
  );
}
