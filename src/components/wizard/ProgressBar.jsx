/**
 * Wizard Progress Bar.
 * Visual indicator of the current step in the wizard.
 */
export default function ProgressBar({ step, totalSteps }) {
  const safeTotal = Number(totalSteps) || 1;
  const safeStep = Number(step) || 1;

  const percent = Math.min(100, Math.max(0, (safeStep / safeTotal) * 100));

  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-zinc-400 mb-1">
        <span>
          Step {safeStep} / {safeTotal}
        </span>
        <span>{Math.round(percent)}%</span>
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
