import { useEffect, useState } from "react";
import { getAnnouncements } from "../../api/notifications.js";

export default function AnnouncementWidget({ announcements }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Recent Announcements</h2>
        <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded">
          {announcements?.length || 0}
        </span>
      </div>

      {announcements && announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">
                  {announcement.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    announcement.priority === "high"
                      ? "bg-red-900/30 text-red-400"
                      : "bg-blue-900/30 text-blue-400"
                  }`}
                >
                  {announcement.priority}
                </span>
              </div>
              <p className="text-slate-400 text-xs line-clamp-2">
                {announcement.description}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No announcements</p>
        </div>
      )}
    </div>
  );
}
