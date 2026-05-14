export default function StatusBadge({ status, type = "default" }) {
  const statusStyles = {
    submitted: "bg-blue-900/30 text-blue-400",
    pending: "bg-yellow-900/30 text-yellow-400",
    accepted: "bg-emerald-900/30 text-emerald-400",
    rejected: "bg-red-900/30 text-red-400",
    active: "bg-emerald-900/30 text-emerald-400",
    inactive: "bg-slate-700 text-slate-400",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${
        statusStyles[status] || "bg-slate-700 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}
