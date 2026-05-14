export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
