export default function RecentActivity() {
  const activities = [
    {
      type: "complaint",
      text: "Complaint submitted",
      time: "2 hours ago",
      icon: "📋",
    },
    { type: "event", text: "Event registered", time: "1 day ago", icon: "📅" },
    { type: "fyp", text: "Group formed", time: "3 days ago", icon: "📚" },
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 pb-4 border-b border-slate-700 last:border-b-0"
          >
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                {activity.text}
              </p>
              <p className="text-slate-400 text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-center text-xs mt-4">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
