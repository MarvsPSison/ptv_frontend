import { useApp } from "./AppContext";
import "./AdminOverview.css";
import { Users, Clock, FileText, CalendarCheck, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminOverview({ setActiveTab }) {
  const { interns, getRenderedHours, getInternAttendance, getInternReports } = useApp();

  const activeInterns  = interns.filter(i => i.status === "active");
  const pendingInterns = interns.filter(i => i.status === "pending");

  const totalRendered = interns.reduce((acc, i) => acc + getRenderedHours(i.id), 0);

  const totalReports = interns.reduce((acc, i) => acc + getInternReports(i.id).length, 0);

  const totalPresent = interns.reduce((acc, i) => {
    return acc + getInternAttendance(i.id).filter(r => r.status === "On Time" || r.status === "Late").length;
  }, 0);

  const statCards = [
    { label: "Active Interns",   value: activeInterns.length,       sub: `${pendingInterns.length} pending approval`, cls: "adm-ov-card-blue",   icon: <Users size={20} /> },
    { label: "Total Hours Logged", value: `${Math.floor(totalRendered)}h`, sub: "Across all interns",              cls: "adm-ov-card-gold",   icon: <Clock size={20} /> },
    { label: "Reports Submitted", value: totalReports,              sub: "All time",                               cls: "adm-ov-card-crimson", icon: <FileText size={20} /> },
    { label: "Attendance Records", value: totalPresent,             sub: "Present days logged",                    cls: "adm-ov-card-green",  icon: <CalendarCheck size={20} /> },
  ];

  return (
    <div className="adm-tab-overview">

      {/* Stat Cards */}
      <div className="adm-ov-cards">
        {statCards.map(({ label, value, sub, cls, icon }) => (
          <div key={label} className={`adm-ov-card ${cls}`}>
            <div className="adm-ov-card-top">
              <p className="adm-ov-card-label">{label}</p>
              <span className="adm-ov-card-icon">{icon}</span>
            </div>
            <p className="adm-ov-card-value">{value}</p>
            <p className="adm-ov-card-sub">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {pendingInterns.length > 0 && (
        <div className="adm-panel adm-ov-pending">
          <div className="adm-ov-pending-header">
            <AlertCircle size={16} className="adm-ov-pending-icon" />
            <h3 className="adm-panel-title" style={{ marginBottom: 0 }}>
              Pending Approvals ({pendingInterns.length})
            </h3>
          </div>
          <div className="adm-ov-pending-list">
            {pendingInterns.map(i => (
              <div key={i.id} className="adm-ov-pending-row">
                <div className="adm-ov-pending-info">
                  <p className="adm-ov-pending-name">{i.name}</p>
                  <p className="adm-ov-pending-meta">{i.course} · {i.school}</p>
                </div>
                <span className="adm-ov-pending-date">Registered {i.registeredAt}</span>
                <button
                  className="adm-btn adm-btn-gold"
                  style={{ fontSize: "12px", padding: "6px 14px" }}
                  onClick={() => setActiveTab("interns")}
                >
                  Review →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intern Progress Table */}
      <div className="adm-panel">
        <div className="adm-ov-table-header">
          <h3 className="adm-panel-title" style={{ marginBottom: 0 }}>Intern Progress</h3>
          <button
            className="adm-btn adm-btn-ghost"
            style={{ fontSize: "12px" }}
            onClick={() => setActiveTab("interns")}
          >
            View All →
          </button>
        </div>

        {activeInterns.length === 0 ? (
          <div className="adm-empty-state">
            <Users size={28} />
            <p>No active interns yet.</p>
            <p style={{ fontSize: "12px" }}>Approved interns will appear here.</p>
          </div>
        ) : (
          <div className="adm-ov-table-wrap">
            <table className="adm-ov-table">
              <thead>
                <tr>
                  <th>Intern</th>
                  <th>Department</th>
                  <th>Progress</th>
                  <th>Hours</th>
                  <th>Attendance</th>
                  <th>Reports</th>
                </tr>
              </thead>
              <tbody>
                {activeInterns.map(i => {
                  const rendered  = getRenderedHours(i.id);
                  const required  = Number(i.requiredHours) || 0;
                  const pct       = required > 0 ? Math.min(100, Math.round((rendered / required) * 100)) : 0;
                  const attLog    = getInternAttendance(i.id);
                  const presentDays = attLog.filter(r => r.status === "On Time" || r.status === "Late").length;
                  const reports   = getInternReports(i.id);

                  return (
                    <tr key={i.id}>
                      <td>
                        <div className="adm-ov-intern-cell">
                          <div className="adm-ov-avatar">
                            {i.photo
                              ? <img src={i.photo} alt={i.name} />
                              : i.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="adm-ov-intern-name">{i.name}</p>
                            <p className="adm-ov-intern-school">{i.school}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="adm-ov-dept-tag">
                          {i.department || <span style={{ color: "#9ca3af" }}>Unassigned</span>}
                        </span>
                      </td>
                      <td>
                        <div className="adm-ov-progress-wrap">
                          <div className="adm-ov-progress-bar">
                            <div className="adm-ov-progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="adm-ov-progress-pct">{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="adm-ov-hrs">
                          {Math.floor(rendered)}h
                          <span className="adm-ov-hrs-total"> / {required || "—"}h</span>
                        </span>
                      </td>
                      <td>
                        <span className="adm-ov-count">{presentDays} days</span>
                      </td>
                      <td>
                        <span className="adm-ov-count">{reports.length}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="adm-panel">
        <h3 className="adm-panel-title">Recent Attendance Activity</h3>
        {(() => {
          const allRecords = interns.flatMap(i =>
            getInternAttendance(i.id).map(r => ({ ...r, internName: i.name }))
          ).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

          if (allRecords.length === 0) return (
            <div className="adm-empty-state">
              <TrendingUp size={28} />
              <p>No attendance records yet.</p>
            </div>
          );

          return (
            <div className="adm-ov-activity-list">
              {allRecords.map(r => (
                <div key={r.id} className="adm-ov-activity-row">
                  <div className="adm-ov-activity-left">
                    <p className="adm-ov-activity-name">{r.internName}</p>
                    <p className="adm-ov-activity-date">
                      {new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="adm-ov-activity-right">
                    <span className="adm-ov-activity-time">
                      {r.timeIn ?? "—"} → {r.timeOut ?? "—"}
                    </span>
                    <span className={`adm-ov-status-badge adm-ov-status-${r.status?.toLowerCase().replace(" ", "-")}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
}