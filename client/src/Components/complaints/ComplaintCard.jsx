import { useState } from "react";

const statusColors = {
  submitted: "bg-blue-900/30 text-blue-400 border-blue-700/50",
  under_review: "bg-yellow-900/30 text-yellow-400 border-yellow-700/50",
  acknowledged: "bg-purple-900/30 text-purple-400 border-purple-700/50",
  resolved: "bg-emerald-900/30 text-emerald-400 border-emerald-700/50",
  rejected: "bg-red-900/30 text-red-400 border-red-700/50",
};

const categoryEmoji = {
  academic: "📚",
  facility: "🏢",
  harassment: "🚨",
  administration: "📋",
  other: "❓",
};

export default function ComplaintCard({ complaint, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-600/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">
              {categoryEmoji[complaint.category] || "📋"}
            </span>
            <h3 className="text-white font-semibold">{complaint.title}</h3>
          </div>
          <p className="text-slate-400 text-sm">
            {new Date(complaint.createdAt).toLocaleDateString()} at{" "}
            {new Date(complaint.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              statusColors[complaint.status] || "bg-slate-700 text-slate-400"
            }`}
          >
            {complaint.status.replace("_", " ")}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              complaint.priority === "critical"
                ? "bg-red-900 text-red-300"
                : complaint.priority === "high"
                  ? "bg-orange-900 text-orange-300"
                  : complaint.priority === "medium"
                    ? "bg-yellow-900 text-yellow-300"
                    : "bg-blue-900 text-blue-300"
            }`}
          >
            {complaint.priority}
          </span>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
        {complaint.description}
      </p>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-700 pt-3 mt-3">
          <div className="mb-3">
            <p className="text-slate-300 text-sm mb-2">Full Description:</p>
            <p className="text-slate-400 text-sm">{complaint.description}</p>
          </div>

          {complaint.adminResponse && (
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <p className="text-slate-300 text-xs font-semibold mb-1">
                Admin Response:
              </p>
              <p className="text-slate-400 text-sm">
                {complaint.adminResponse}
              </p>
              {complaint.respondedAt && (
                <p className="text-slate-500 text-xs mt-2">
                  Responded on{" "}
                  {new Date(complaint.respondedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
        >
          {expanded ? "Show less" : "View details"}
        </button>
        {complaint.status === "submitted" && (
          <button
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
