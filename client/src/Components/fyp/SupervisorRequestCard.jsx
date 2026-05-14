import { useState } from "react";

export default function SupervisorRequestCard({ request, onAccept, onReject }) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    onReject(rejectReason);
    setShowRejectForm(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-600/50 transition-colors">
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="text-white font-semibold text-lg">
              {request.supervisorId.name}
            </h3>
            <p className="text-slate-400 text-sm">
              {request.supervisorId.email}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-semibold">
              Request #{request.requestNumber}
            </span>
            <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-semibold">
              {request.status}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <p className="text-slate-300 text-sm">
            <strong>Project:</strong> {request.projectId.title}
          </p>
          <p className="text-slate-400 text-xs mt-2 line-clamp-2">
            {request.projectId.description}
          </p>
        </div>
      </div>

      {showRejectForm ? (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Rejection Reason (Optional)
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why you're rejecting this request..."
            rows="3"
            className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          ></textarea>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleReject}
              className="flex-1 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Confirm Rejection
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason("");
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Accept
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Reject
          </button>
        </div>
      )}

      <p className="text-slate-500 text-xs mt-4">
        Sent on {new Date(request.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
