export default function ProgressBar({ step, totalSteps }) {
  const percent = (step / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>Paso {step}</span>
        <span>{totalSteps}</span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded">
        <div
          className="h-2 bg-blue-600 rounded transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
