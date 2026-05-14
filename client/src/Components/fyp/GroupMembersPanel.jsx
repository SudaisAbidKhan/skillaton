export default function GroupMembersPanel({ group, isLeader }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Group Members</h2>
        <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded font-semibold">
          {group.members.length}/2 members
        </span>
      </div>

      <div className="space-y-3">
        {group.members.map((member) => {
          const isGroupLeader = member._id === group.leaderId;
          return (
            <div
              key={member._id}
              className={`bg-slate-900 border rounded-lg p-4 ${
                isGroupLeader
                  ? "border-yellow-600/50 bg-yellow-900/10"
                  : "border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{member.name}</h3>
                    {isGroupLeader && (
                      <span className="bg-yellow-900/30 text-yellow-400 text-xs px-2 py-0.5 rounded">
                        Group Leader
                      </span>
                    )}
                    {isLeader && !isGroupLeader && (
                      <span className="bg-emerald-900/30 text-emerald-400 text-xs px-2 py-0.5 rounded">
                        Partner
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{member.email}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {member.studentId} • {member.department} • Sem{" "}
                    {member.semester}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {group.members.length < 2 && (
        <div className="mt-4 p-3 bg-slate-900 border border-dashed border-slate-600 rounded-lg text-center">
          <p className="text-slate-400 text-sm">
            Waiting for more members to join...
          </p>
        </div>
      )}
    </div>
  );
}
