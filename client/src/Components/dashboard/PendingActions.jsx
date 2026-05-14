import { useEffect, useState } from "react";
import {
  getPendingPartnerRequests,
  getPendingSupervisorRequests,
} from "../../api/fyp.js";

export default function PendingActions() {
  const [pendingPartner, setPendingPartner] = useState(0);
  const [pendingSupervisor, setPendingSupervisor] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingActions();
  }, []);

  const fetchPendingActions = async () => {
    try {
      const [partnerRes, supervisorRes] = await Promise.all([
        getPendingPartnerRequests(),
        getPendingSupervisorRequests(),
      ]).catch(() => []);

      setPendingPartner(partnerRes?.data?.requests?.length || 0);
      setPendingSupervisor(supervisorRes?.data?.requests?.length || 0);
    } catch (error) {
      console.error("Error fetching pending actions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">Pending Actions</h2>

      <div className="space-y-3">
        {pendingPartner > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-blue-600 transition-colors">
            <div>
              <p className="text-white font-semibold">Partner Requests</p>
              <p className="text-slate-400 text-sm">
                {pendingPartner} pending request(s)
              </p>
            </div>
            <div className="bg-orange-900/30 text-orange-400 px-3 py-1 rounded text-sm font-semibold">
              {pendingPartner}
            </div>
          </div>
        )}

        {pendingSupervisor > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-blue-600 transition-colors">
            <div>
              <p className="text-white font-semibold">Supervisor Requests</p>
              <p className="text-slate-400 text-sm">
                {pendingSupervisor} pending request(s)
              </p>
            </div>
            <div className="bg-purple-900/30 text-purple-400 px-3 py-1 rounded text-sm font-semibold">
              {pendingSupervisor}
            </div>
          </div>
        )}

        {pendingPartner === 0 && pendingSupervisor === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No pending actions</p>
          </div>
        )}
      </div>
    </div>
  );
}
