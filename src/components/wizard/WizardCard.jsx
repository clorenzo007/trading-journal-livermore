export default function WizardCard({ title, children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-lg">
      {title && (
        <div className="border-b border-zinc-800 pb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
