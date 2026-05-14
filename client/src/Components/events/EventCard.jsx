export default function EventCard({ event, isRegistered, onRegister }) {
  const spotsLeft =
    event.seatsAvailable || event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-600/50 transition-colors flex flex-col h-full">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-semibold text-lg flex-1 line-clamp-2">
            {event.title}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
              event.category === "workshop"
                ? "bg-blue-900 text-blue-300"
                : event.category === "seminar"
                  ? "bg-purple-900 text-purple-300"
                  : event.category === "sports"
                    ? "bg-orange-900 text-orange-300"
                    : "bg-emerald-900 text-emerald-300"
            }`}
          >
            {event.category}
          </span>
        </div>
        <p className="text-slate-400 text-sm line-clamp-2">
          {event.description}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm text-slate-400 flex-1">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🕐</span>
          <span>
            {new Date(event.eventDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span className="line-clamp-1">{event.location}</span>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Capacity</span>
          <span
            className={`text-xs font-semibold ${isFull ? "text-red-400" : "text-emerald-400"}`}
          >
            {event.registeredCount}/{event.capacity}
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all ${
              isFull ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{
              width: `${(event.registeredCount / event.capacity) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onRegister}
        disabled={isRegistered || isFull}
        className={`w-full py-2 rounded-lg font-semibold transition-colors text-sm ${
          isRegistered
            ? "bg-emerald-900/30 text-emerald-400 cursor-default"
            : isFull
              ? "bg-red-900/30 text-red-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-600 text-white"
        }`}
      >
        {isRegistered ? "✓ Registered" : isFull ? "Event Full" : "Register Now"}
      </button>
    </div>
  );
}
