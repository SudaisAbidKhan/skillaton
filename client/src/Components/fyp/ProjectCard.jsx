export default function ProjectCard({ project }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          <p className="text-slate-400 text-sm mt-1">
            Status:{" "}
            <span className="font-semibold text-blue-400 capitalize">
              {project.status}
            </span>
          </p>
        </div>
        {project.supervisorId && (
          <div className="bg-emerald-900/30 border border-emerald-700/50 px-3 py-1 rounded">
            <p className="text-emerald-400 text-xs font-semibold">
              ✓ Supervisor Assigned
            </p>
            <p className="text-emerald-400 text-sm">
              {project.supervisorId.name}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-white font-semibold mb-2">Description</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div>
          <p className="text-slate-400 text-xs font-semibold mb-1">Created</p>
          <p className="text-white text-sm">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        {project.supervisorId && (
          <div>
            <p className="text-slate-400 text-xs font-semibold mb-1">
              Supervisor Email
            </p>
            <p className="text-white text-sm">{project.supervisorId.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
