export default function SessionFilter({ value, onChange }) {
  const options = ["All", "Asia", "London", "NY", "Europe", "Other"];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3 py-1 rounded text-sm border ${
            value === o
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
