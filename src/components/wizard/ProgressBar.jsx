export default function ProgressBar({ steps, current }) {
  const total = steps.length;
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>
          Step {current + 1} / {total}
        </span>
        <span>{steps[current]}</span>
      </div>

      <div className="w-full h-2 bg-zinc-800 rounded">
        <div
          className="h-2 bg-indigo-600 rounded transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
