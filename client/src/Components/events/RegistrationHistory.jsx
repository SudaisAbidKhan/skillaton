export default function RegistrationHistory({ registration, onCancel }) {
  const { event } = registration;
  const status = registration.registration.status;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-600/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Event Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-semibold text-lg">{event.title}</h3>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                status === "registered"
                  ? "bg-emerald-900 text-emerald-300"
                  : status === "attended"
                    ? "bg-blue-900 text-blue-300"
                    : "bg-red-900 text-red-300"
              }`}
            >
              {status}
            </span>
          </div>

          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-400">
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
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>
                {event.registeredCount}/{event.capacity} seats
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>📝</span>
              <span>
                Registered{" "}
                {new Date(
                  registration.registration.registrationDate,
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {status === "registered" && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg font-semibold transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
