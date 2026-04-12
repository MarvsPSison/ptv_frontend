import { useApp } from "./AppContext";
import "./AdminOverview.css";
import { Users, FileText, CalendarCheck, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminOverview({ setActiveTab, activeOIC }) {
  const { interns: realInterns, getRenderedHours, getInternAttendance, getInternReports } = useApp();

const MOCK_INTERNS = [
  { id: 1, name: "Maria Santos",    email: "maria@email.com",  photo: null, school: "UP Diliman",       course: "BS Computer Science",         department: "IT",             supervisor: "Cyril Collao",      startDate: "2026-01-06", endDate: "2026-04-30", requiredHours: 486, status: "active",  approved: true,  registeredAt: "01/06/2026" },
  { id: 2, name: "Jose Reyes",      email: "jose@email.com",   photo: null, school: "DLSU Manila",      course: "BS Information Technology",   department: "Transmitter",    supervisor: "Ricky Galeza",      startDate: "2026-01-06", endDate: "2026-04-30", requiredHours: 486, status: "active",  approved: true,  registeredAt: "01/06/2026" },
  { id: 3, name: "Ana Dela Cruz",   email: "ana@email.com",    photo: null, school: "Ateneo de Manila", course: "BS Electronics Engineering",  department: "Studio",         supervisor: "Aljune Urrutia",    startDate: "2026-01-13", endDate: "2026-05-07", requiredHours: 486, status: "active",  approved: true,  registeredAt: "01/13/2026" },
  { id: 4, name: "Carlo Mendoza",   email: "carlo@email.com",  photo: null, school: "PLM Manila",       course: "BS Computer Engineering",     department: "TOC",            supervisor: "Narciso Rodriguez", startDate: "2026-01-13", endDate: "2026-05-07", requiredHours: 486, status: "active",  approved: true,  registeredAt: "01/13/2026" },
  { id: 5, name: "Nina Villanueva", email: "nina@email.com",   photo: null, school: "FEU Manila",       course: "BS Information Systems",      department: "Uplink",         supervisor: "Joselito Tanggol",  startDate: "2026-02-03", endDate: "2026-05-28", requiredHours: 486, status: "active",  approved: true,  registeredAt: "02/03/2026" },
  { id: 6, name: "Ramon Garcia",    email: "ramon@email.com",  photo: null, school: "TUP Manila",       course: "BS Electronics Technology",   department: "TV Maintenance", supervisor: "Darius Dela Cruz",  startDate: "2026-02-03", endDate: "2026-05-28", requiredHours: 486, status: "active",  approved: true,  registeredAt: "02/03/2026" },
  { id: 7, name: "Lea Bautista",    email: "lea@email.com",    photo: null, school: "UST Manila",       course: "BS Communication Technology", department: "OB Van",         supervisor: "Lyndon Valderama",  startDate: "2026-02-10", endDate: "2026-06-04", requiredHours: 486, status: "pending", approved: false, registeredAt: "02/10/2026" },
  { id: 8, name: "Marco Reyes",     email: "marco@email.com",  photo: null, school: "PUP Manila",       course: "BS Electrical Engineering",   department: "IT",             supervisor: "Cyril Collao",      startDate: "2026-02-10", endDate: "2026-06-04", requiredHours: 486, status: "pending", approved: false, registeredAt: "02/10/2026" },
];

const MOCK_ATTENDANCE = {
  1: [
    { id: "a101", date: "2026-04-10", timeIn: "08:02 AM", timeOut: "05:05 PM", timeInMs: 1744243320000, timeOutMs: 1744275900000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h 3m" },
    { id: "a102", date: "2026-04-09", timeIn: "08:15 AM", timeOut: "05:00 PM", timeInMs: 1744156500000, timeOutMs: 1744189200000, breakMins: "60", status: "On Time",  flagged: false, duration: "7h 45m" },
    { id: "a103", date: "2026-04-08", timeIn: "08:00 AM", timeOut: "05:10 PM", timeInMs: 1744070400000, timeOutMs: 1744103400000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h 10m" },
    { id: "a104", date: "2026-04-07", timeIn: "08:45 AM", timeOut: "05:00 PM", timeInMs: 1743990600000, timeOutMs: 1744016400000, breakMins: "60", status: "Late",     flagged: true,  duration: "7h 15m", adminNote: "Late arrival noted." },
  ],
  2: [
    { id: "a201", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
    { id: "a202", date: "2026-04-09", timeIn: "08:10 AM", timeOut: "05:05 PM", timeInMs: 1744157400000, timeOutMs: 1744189500000, breakMins: "60", status: "On Time",  flagged: false, duration: "7h 55m" },
    { id: "a203", date: "2026-04-08", timeIn: "08:05 AM", timeOut: "05:00 PM", timeInMs: 1744071300000, timeOutMs: 1744102800000, breakMins: "60", status: "On Time",  flagged: false, duration: "7h 55m" },
  ],
  3: [
    { id: "a301", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
    { id: "a302", date: "2026-04-09", timeIn: "09:05 AM", timeOut: "05:00 PM", timeInMs: 1744160700000, timeOutMs: 1744189200000, breakMins: "60", status: "Late",     flagged: true,  duration: "6h 55m", adminNote: "Arrived 1 hour late." },
    { id: "a303", date: "2026-04-07", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1743984000000, timeOutMs: 1744016400000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
  ],
  4: [
    { id: "a401", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
    { id: "a402", date: "2026-04-09", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744156800000, timeOutMs: 1744189200000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
  ],
  5: [
    { id: "a501", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
    { id: "a502", date: "2026-04-09", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744156800000, timeOutMs: 1744189200000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
    { id: "a503", date: "2026-04-08", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744070400000, timeOutMs: 1744102800000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
  ],
  6: [
    { id: "a601", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time",  flagged: false, duration: "8h" },
    { id: "a602", date: "2026-04-08", timeIn: "08:25 AM", timeOut: "05:00 PM", timeInMs: 1744072500000, timeOutMs: 1744102800000, breakMins: "60", status: "Late",     flagged: true,  duration: "7h 35m", adminNote: "Late — no prior notice." },
  ],
};

const MOCK_REPORTS = {
  1: [
    { id: "r101", date: "2026-04-10", title: "Daily Activity Report", description: "Assisted in network configuration and server monitoring tasks.", type: "daily", status: "approved", submittedAt: "Apr 10, 05:10 PM", comments: [{ role: "admin", text: "Good work, keep it up!", time: "Apr 10, 10:30 AM" }] },
    { id: "r102", date: "2026-04-09", title: "Daily Activity Report", description: "Performed software updates and documented system changes.",       type: "daily", status: "approved", submittedAt: "Apr 9, 05:05 PM",  comments: [] },
    { id: "r103", date: "2026-04-08", title: "Daily Activity Report", description: "Troubleshot workstation issues and set up new employee accounts.",  type: "daily", status: "pending",  submittedAt: "Apr 8, 05:00 PM",  comments: [] },
  ],
  2: [
    { id: "r201", date: "2026-04-10", title: "Daily Activity Report", description: "Monitored transmitter signal levels and logged hourly readings.",   type: "daily", status: "approved", submittedAt: "Apr 10, 05:00 PM", comments: [{ role: "admin", text: "Readings look consistent.", time: "Apr 10, 11:00 AM" }] },
    { id: "r202", date: "2026-04-09", title: "Daily Activity Report", description: "Assisted in routine transmitter maintenance and antenna cleaning.", type: "daily", status: "pending",  submittedAt: "Apr 9, 05:00 PM",  comments: [] },
  ],
  3: [
    { id: "r301", date: "2026-04-10", title: "Daily Activity Report", description: "Assisted in studio setup for the evening news broadcast.",          type: "daily", status: "approved", submittedAt: "Apr 10, 05:15 PM", comments: [] },
    { id: "r302", date: "2026-04-08", title: "Daily Activity Report", description: "Helped with lighting adjustments during production rehearsal.",     type: "daily", status: "pending",  submittedAt: "Apr 8, 05:00 PM",  comments: [] },
  ],
  4: [
    { id: "r401", date: "2026-04-10", title: "Daily Activity Report", description: "Monitored TOC screens and reported anomalies to shift supervisor.", type: "daily", status: "approved", submittedAt: "Apr 10, 05:00 PM", comments: [] },
  ],
  5: [
    { id: "r501", date: "2026-04-10", title: "Daily Activity Report", description: "Monitored uplink signal and assisted in dish alignment.",           type: "daily", status: "pending",  submittedAt: "Apr 10, 05:00 PM", comments: [] },
    { id: "r502", date: "2026-04-09", title: "Daily Activity Report", description: "Logged satellite schedules and coordinated with TOC for live feeds.",type: "daily", status: "approved", submittedAt: "Apr 9, 05:00 PM",  comments: [{ role: "admin", text: "Great coordination with TOC.", time: "Apr 9, 03:00 PM" }] },
  ],
  6: [
    { id: "r601", date: "2026-04-10", title: "Daily Activity Report", description: "Assisted in preventive maintenance of studio monitors.",            type: "daily", status: "approved", submittedAt: "Apr 10, 05:00 PM", comments: [] },
  ],
};

const allInterns = realInterns.length > 0 ? realInterns : MOCK_INTERNS;
const interns = activeOIC ? allInterns.filter(i => i.department === activeOIC.department) : allInterns;
const mockGetAttendance = (id) => MOCK_ATTENDANCE[id] || [];
const mockGetReports    = (id) => MOCK_REPORTS[id]    || [];
const mockGetHours      = (id) => {
  const log = MOCK_ATTENDANCE[id] || [];
  return log.filter(r => r.timeOut).reduce((acc, r) => acc + (r.timeOutMs - r.timeInMs - (parseInt(r.breakMins) || 0) * 60000) / 3600000, 0);
};
const getInternAttendanceFn = realInterns.length > 0 ? getInternAttendance : mockGetAttendance;
const getInternReportsFn    = realInterns.length > 0 ? getInternReports    : mockGetReports;
const getRenderedHoursFn    = realInterns.length > 0 ? getRenderedHours    : mockGetHours;

  const activeInterns  = interns.filter(i => i.status === "active");
  const pendingInterns = interns.filter(i => i.status === "pending");

 const totalReports = interns.reduce((acc, i) => acc + getInternReportsFn(i.id).length, 0);

  const totalPresent = interns.reduce((acc, i) => {
    return acc + getInternAttendanceFn(i.id).filter(r => r.status === "On Time" || r.status === "Late").length;
  }, 0);

  const statCards = [
    { label: "Active Interns",   value: activeInterns.length,       sub: `${pendingInterns.length} pending approval`, cls: "adm-ov-card-blue",   icon: <Users size={20} /> },
    { label: "Total Interns", value: interns.length, sub: `${activeInterns.length} active · ${pendingInterns.length} pending`, cls: "adm-ov-card-gold", icon: <Users size={20} /> },
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
                {!activeOIC && (
                  <button
                    className="adm-btn adm-btn-gold"
                    style={{ fontSize: "12px", padding: "6px 14px" }}
                    onClick={() => setActiveTab("interns")}
                  >
                    Review →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intern Progress Table */}
      <div className="adm-panel">
        <div className="adm-ov-table-header">
          <h3 className="adm-panel-title" style={{ marginBottom: 0 }}>Intern Progress</h3>
          {!activeOIC && (
            <button
              className="adm-btn adm-btn-ghost"
              style={{ fontSize: "12px" }}
              onClick={() => setActiveTab("interns")}
            >
              View All →
            </button>
          )}
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
                  const rendered  = getRenderedHoursFn(i.id);
                  const required  = Number(i.requiredHours) || 0;
                  const pct       = required > 0 ? Math.min(100, Math.round((rendered / required) * 100)) : 0;
                  const attLog    = getInternAttendanceFn(i.id);
                  const presentDays = attLog.filter(r => r.status === "On Time" || r.status === "Late").length;
                  const reports   = getInternReportsFn(i.id);

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
            getInternAttendanceFn(i.id).map(r => ({ ...r, internName: i.name }))
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