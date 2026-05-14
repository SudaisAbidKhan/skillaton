export default function PartnerRequestCard({ request, onAccept, onReject }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-600/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">
            {request.fromStudentId.name}
          </h3>
          <p className="text-slate-400 text-sm">
            {request.fromStudentId.email} • {request.fromStudentId.studentId}
          </p>
          <p className="text-slate-400 text-sm">
            {request.fromStudentId.department || "Department"} • Semester{" "}
            {request.fromStudentId.semester || "-"}
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-semibold">
          Pending
        </span>
      </div>

      {request.message && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4">
          <p className="text-slate-300 text-sm">
            <strong>Message:</strong> {request.message}
          </p>
        </div>
      )}

      <p className="text-slate-400 text-sm mb-4">
        Sent on {new Date(request.createdAt).toLocaleDateString()}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onAccept}
          className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Accept & Form Group
        </button>
        <button
          onClick={onReject}
          className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
