export default function StatCard({ title, value, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${color} p-3 rounded-lg text-white text-xl group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
