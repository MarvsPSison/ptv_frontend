import { CheckCircle2, Timer, CalendarCheck, FileText, Clock, CalendarDays, TrendingUp } from "lucide-react";
import "./InternDashTab.css";

export default function DashboardTab({
  intern, reports, attendanceLog, liveTime,
  autoRenderedHrsDisplay, progress, hrsRemaining,
  totalWorkingDays, remainingWorkingDays, hrsPerDay,
  totalAttDays, totalAttHours, existingToday,
  isTimedIn, isTimedOut, setActiveTab, setModal,
}) {
  return (
    <div className="ids-tab-dashboard">

      {/* Greeting */}
      <div className="ids-dash-greeting">
        <div>
          <h2 className="ids-dash-hello">
            {(() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; })()},
            {" "}<span className="ids-dash-hello-name">{intern.name || "Intern"}</span>!
          </h2>
          <p className="ids-dash-hello-date">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* OJT Banner */}
      <div className="ids-ojt-banner">
        <div className="ids-ojt-banner-left">
          <div className="ids-ojt-banner-label">OJT Progress</div>
          <div className="ids-ojt-banner-hrs">
            <span className="ids-ojt-big">{autoRenderedHrsDisplay}h</span>
            <span className="ids-ojt-total"> / {intern.requiredHours || "—"}h</span>
          </div>
          <div className="ids-ojt-banner-sub">Accumulated hours for your entire OJT program</div>
        </div>
        <div className="ids-ojt-banner-right">
          <div className="ids-ojt-pct-row">
            <span>{progress}% complete</span>
            <span>{hrsRemaining !== null ? `${Math.floor(hrsRemaining)}h remaining` : ""}</span>
          </div>
          <div className="ids-ojt-track">
            <div className="ids-ojt-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Bold Stat Cards */}
      <div className="ids-bold-stats">
        {[
          { label: "TOTAL DAYS",  value: totalAttDays, sub: "All time", cls: "bold-amber", icon: <CalendarCheck size={20} /> },
          { label: "TOTAL HOURS", value: `${Math.floor(autoRenderedHrsDisplay)}h`, sub: "All time", cls: "bold-blue", icon: <Clock size={20} /> },
          { label: "THIS MONTH",
            value: (() => {
              const now = new Date();
              return attendanceLog.filter(r => {
                const d = new Date(r.date + "T00:00:00");
                return r.timeOut && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length + " days";
            })(),
            sub: (() => {
              const now = new Date();
              return `${Math.floor(attendanceLog.filter(r => {
                const d = new Date(r.date + "T00:00:00");
                return r.timeOut && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).reduce((a, r) => a + (r.timeOutMs - r.timeInMs - (parseInt(r.breakMins) || 0) * 60000) / 3600000, 0))}h worked`;
            })(),
            cls: "bold-orange", icon: <CalendarDays size={20} />
          },
          { label: "AVG / DAY", value: totalAttDays > 0 ? `${Math.floor(totalAttHours / totalAttDays)}h` : "—", sub: "All time avg", cls: "bold-pink", icon: <TrendingUp size={20} /> },
        ].map(({ label, value, sub, cls, icon }) => (
          <div key={label} className={`ids-bold-card ${cls}`}>
            <div className="ids-bold-card-top">
              <p className="ids-bold-card-label">{label}</p>
              <span className="ids-bold-card-icon">{icon}</span>
            </div>
            <p className="ids-bold-card-value">{value}</p>
            <p className="ids-bold-card-sub">{sub}</p>
          </div>
        ))}
      </div>

      {/* Clock + Recent Records */}
      <div className="ids-dash-bottom">

        {/* Analog Clock */}
        <div className="ids-panel ids-clock-panel">
          <svg className="ids-analog-clock" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="96" fill="white" stroke="#e2e6f0" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="#f5f6fa" strokeWidth="1" />
            {[...Array(60)].map((_, i) => {
              const angle = (i * 6 - 90) * (Math.PI / 180);
              const isMajor = i % 5 === 0;
              const r1 = isMajor ? 76 : 83;
              return (
                <line key={i}
                  x1={100 + r1 * Math.cos(angle)} y1={100 + r1 * Math.sin(angle)}
                  x2={100 + 88 * Math.cos(angle)} y2={100 + 88 * Math.sin(angle)}
                  stroke={isMajor ? "#0d1b4b" : "#e2e6f0"}
                  strokeWidth={isMajor ? 2 : 1} strokeLinecap="round" />
              );
            })}
            {[12,3,6,9].map((n, i) => {
              const angle = (i * 90 - 90) * (Math.PI / 180);
              return (
                <text key={n} x={100 + 63 * Math.cos(angle)} y={100 + 63 * Math.sin(angle)}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="13" fontWeight="700" fill="#0d1b4b" fontFamily="DM Sans, sans-serif">{n}</text>
              );
            })}
            <line x1="100" y1="100"
              x2={100 + 44 * Math.cos(((liveTime.getHours() % 12) * 30 + liveTime.getMinutes() * 0.5 - 90) * Math.PI / 180)}
              y2={100 + 44 * Math.sin(((liveTime.getHours() % 12) * 30 + liveTime.getMinutes() * 0.5 - 90) * Math.PI / 180)}
              stroke="#0d1b4b" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="100"
              x2={100 + 62 * Math.cos((liveTime.getMinutes() * 6 - 90) * Math.PI / 180)}
              y2={100 + 62 * Math.sin((liveTime.getMinutes() * 6 - 90) * Math.PI / 180)}
              stroke="#0d1b4b" strokeWidth="2.5" strokeLinecap="round" />
            <line
              x1={100 - 14 * Math.cos((liveTime.getSeconds() * 6 - 90) * Math.PI / 180)}
              y1={100 - 14 * Math.sin((liveTime.getSeconds() * 6 - 90) * Math.PI / 180)}
              x2={100 + 70 * Math.cos((liveTime.getSeconds() * 6 - 90) * Math.PI / 180)}
              y2={100 + 70 * Math.sin((liveTime.getSeconds() * 6 - 90) * Math.PI / 180)}
              stroke="#9b1c31" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="5" fill="#0d1b4b" />
            <circle cx="100" cy="100" r="2.5" fill="white" />
          </svg>

          <div className="ids-clock-time">
            {liveTime.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
          </div>
          <div className="ids-clock-date">
            {liveTime.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </div>

          <div className="ids-clock-status-row">
            {!existingToday && (
              <button className="ids-clock-timebtn ids-clock-timebtn-in" onClick={() => setModal({ type: "timeIn" })}>
                Clock In
              </button>
            )}
            {isTimedIn && (
              <>
                <span className="ids-clock-pill ids-clock-pill-active"><Timer size={12} /> In Progress</span>
                <button className="ids-clock-timebtn ids-clock-timebtn-out" onClick={() => setModal({ type: "timeOut" })}>
                  Clock Out
                </button>
              </>
            )}
            {isTimedOut && (
              <span className="ids-clock-pill ids-clock-pill-done"><CheckCircle2 size={12} /> Day Complete</span>
            )}
          </div>
          {existingToday && (
            <div className="ids-clock-timings">
              <div className="ids-clock-timing-item"><span>Time In</span><strong>{existingToday.timeIn}</strong></div>
              <div className="ids-clock-timing-item"><span>Time Out</span><strong>{existingToday.timeOut || "—"}</strong></div>
            </div>
          )}
          {existingToday && existingToday.timeOut && (
            <div className="ids-clock-total-bar">
              Total: <strong style={{ color: "#0d1b4b" }}>
                {Math.floor((existingToday.timeOutMs - existingToday.timeInMs - (parseInt(existingToday.breakMins) || 0) * 60000) / 3600000)} hours
              </strong>
              {intern.requiredHours && (
                <span style={{ color: "#9ca3af" }}> / {(Number(intern.requiredHours) / (totalWorkingDays || 1)).toFixed(1)} required</span>
              )}
            </div>
          )}
        </div>

        {/* Recent Records */}
        <div className="ids-panel ids-recent-panel">
          <div className="ids-recent-header">
            <h3 className="ids-panel-title" style={{ marginBottom: 0 }}>Recent Records</h3>
            <button className="ids-recent-viewall" onClick={() => setActiveTab("attendance")}>View all →</button>
          </div>
          {attendanceLog.length === 0 ? (
            <div className="ids-empty-state" style={{ marginTop: "16px" }}>
              <CalendarCheck size={28} /><p>No attendance records yet.</p>
            </div>
          ) : (
            <div className="ids-recent-list">
              {attendanceLog.slice(0, 6).map((r) => (
                <div key={r.id} className="ids-recent-row">
                  <div className="ids-recent-row-left">
                    <span className="ids-recent-row-date">
                      {new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {r.note && <span className="ids-recent-row-note">{r.note}</span>}
                  </div>
                  <div className="ids-recent-row-right">
                    <span className="ids-recent-row-hrs">{r.timeOut ? `${Math.floor((r.timeOutMs - r.timeInMs - (parseInt(r.breakMins) || 0) * 60000) / 3600000)}h` : "—"}</span>
                    <span className={`ids-recent-row-status ${r.status === "On Time" ? "status-on" : r.status === "Late" ? "status-late" : r.status === "Half Day" ? "status-half" : ""}`}>
                      {r.timeOut ? r.status : "In progress"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="ids-panel ids-dash-reports-panel">
          <div className="ids-recent-header">
            <h3 className="ids-panel-title" style={{ marginBottom: 0 }}>Recent Reports</h3>
            <button className="ids-recent-viewall" onClick={() => setActiveTab("reporting")}>View all →</button>
          </div>
          {reports.length === 0 ? (
            <div className="ids-empty-state" style={{ marginTop: "16px" }}>
              <FileText size={28} /><p>No reports submitted yet.</p>
            </div>
          ) : (
            <div className="ids-dash-reports-list">
              {reports.slice(0, 3).map(r => (
                <div key={r.id} className="ids-dash-report-row">
                  <div className="ids-dash-report-left">
                    <span className="ids-dash-report-type">{r.type.toUpperCase()}</span>
                    <span className="ids-dash-report-desc">{r.description.length > 60 ? r.description.slice(0, 60) + "…" : r.description}</span>
                    {r.files.length > 0 && (
                      <div className="ids-dash-report-files">
                        {r.files.map((f, i) => (
                          <span key={i} className="ids-dash-report-file-tag" onClick={() => f.url && window.open(f.url, "_blank")}>
                            <FileText size={11} /> {f.name}
                            {f.url && <span className="ids-dash-file-view"> · View</span>}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ids-dash-report-right">
                    <span className="ids-dash-report-date">{r.date}</span>
                    <span className="ids-dash-report-sub">Submitted {r.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}