import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ptvLogo from "/src/assets/ptv-logo.png";
import {
  LayoutDashboard, ClipboardList, User, LogOut, Menu,
  CalendarCheck, LogIn, LogOut as LogOutIcon,
  Save, XCircle, X, FileText, CheckCircle2, Timer
} from "lucide-react";
import "./InternDash.css";
import DashboardTab from "./InternDashTab";
import AttendanceTab from "./InternAttend";
import ReportingTab from "./InternReport";
import ProfileTab from "./InternProfile";

const EMPTY_INTERN = {
  name: "", school: "", course: "", department: "",
  supervisor: "", startDate: "", endDate: "",
  requiredHours: "", renderedHours: "",
  email: "", phone: "", address: "", photo: null,
};

const pct = (r, t) => (!r || !t) ? 0 : Math.min(100, Math.round((r / t) * 100));

const formatTime = (date) => date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });

const formatDuration = (ms) => {
  if (!ms || ms <= 0) return "—";
  const totalMins = Math.floor(ms / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins}m`;
  return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`;
};

const todayStr = () => new Date().toISOString().split("T")[0];

const PH_HOLIDAYS = new Set([
  "2025-01-01","2025-01-29","2025-04-01","2025-04-09","2025-04-17",
  "2025-04-18","2025-04-19","2025-05-01","2025-06-12","2025-08-21",
  "2025-08-25","2025-09-05","2025-11-01","2025-11-02","2025-11-30",
  "2025-12-08","2025-12-24","2025-12-25","2025-12-30","2025-12-31",
  "2026-01-01","2026-02-17","2026-04-02","2026-04-03","2026-04-04",
  "2026-04-09","2026-05-01","2026-06-12","2026-08-21","2026-08-31",
  "2026-11-01","2026-11-02","2026-11-30","2026-12-08","2026-12-24",
  "2026-12-25","2026-12-30","2026-12-31",
]);

const countWorkingDays = (startStr, endStr) => {
  if (!startStr || !endStr) return 0;
  const start = new Date(startStr + "T00:00:00");
  const end   = new Date(endStr   + "T00:00:00");
  if (end < start) return 0;
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    const str = cur.toISOString().split("T")[0];
    if (day !== 0 && day !== 6 && !PH_HOLIDAYS.has(str)) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

const countRemainingWorkingDays = (endStr) => {
  const todayDate = new Date(todayStr() + "T00:00:00");
  const end       = new Date(endStr    + "T00:00:00");
  if (end < todayDate) return 0;
  let count = 0;
  const cur = new Date(todayDate);
  while (cur <= end) {
    const day = cur.getDay();
    const str = cur.toISOString().split("T")[0];
    if (day !== 0 && day !== 6 && !PH_HOLIDAYS.has(str)) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
};

export default function InternDash() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [intern, setIntern]         = useState(EMPTY_INTERN);
  const [editMode, setEditMode]     = useState(false);
  const [editForm, setEditForm]     = useState({ ...EMPTY_INTERN });
  const [reports, setReports]       = useState([]);
  const [reportForm, setReportForm] = useState({ date: "", type: "daily", description: "", files: [] });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal]           = useState(null);
  const [darkMode, setDarkMode]     = useState(false);

  const [attendanceLog, setAttendanceLog] = useState([]);
  const [attNote, setAttNote]             = useState("");
  const [liveTime, setLiveTime]           = useState(new Date());
  const [attFilter, setAttFilter]         = useState("all");

  const [retroForm, setRetroForm]     = useState({ date: "", timeInRaw: "", timeInPeriod: "AM", timeOutRaw: "", timeOutPeriod: "PM", note: "" });
  const [retroError, setRetroError]   = useState("");
  const [retroSuccess, setRetroSuccess] = useState(false);

  useState(() => {
    const id = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(id);
  });

  // ── Derived values ──────────────────────────────────────
  const autoRenderedHrs = attendanceLog
    .filter(r => r.timeOut)
    .reduce((acc, r) => acc + (r.timeOutMs - r.timeInMs - (parseInt(r.breakMins) || 0) * 60000) / 3600000, 0);
  const autoRenderedHrsDisplay = Math.floor(autoRenderedHrs);
  const progress     = pct(autoRenderedHrs, Number(intern.requiredHours));
  const hrsRemaining = intern.requiredHours
    ? Math.max(0, Number(intern.requiredHours) - autoRenderedHrs).toFixed(1)
    : null;

  const totalWorkingDays     = countWorkingDays(intern.startDate, intern.endDate);
  const remainingWorkingDays = intern.endDate ? countRemainingWorkingDays(intern.endDate) : 0;
  const hrsPerDay            = totalWorkingDays > 0 && intern.requiredHours
    ? (Number(intern.requiredHours) / totalWorkingDays).toFixed(1) : null;

  const existingToday = attendanceLog.find(r => r.date === todayStr());
  const isTimedIn     = existingToday && !existingToday.timeOut;
  const isTimedOut    = existingToday && existingToday.timeOut;

  const totalAttDays  = attendanceLog.filter(r => r.timeOut).length;
  const totalAttHours = attendanceLog.reduce((acc, r) => {
    if (!r.timeOut) return acc;
    return acc + (r.timeOutMs - r.timeInMs - (parseInt(r.breakMins) || 0) * 60000) / 3600000;
  }, 0);
  const onTimeCount = attendanceLog.filter(r => r.status === "On Time").length;
  const lateCount   = attendanceLog.filter(r => r.status === "Late").length;

  const filteredLog = attendanceLog.filter(r => {
    if (attFilter === "all") return true;
    const rDate = new Date(r.date);
    const now   = new Date();
    if (attFilter === "week") {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return rDate >= weekAgo;
    }
    if (attFilter === "month") {
      return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const navItems = [
    { key: "dashboard",  Icon: LayoutDashboard, label: "Dashboard"  },
    { key: "attendance", Icon: CalendarCheck,   label: "Attendance" },
    { key: "reporting",  Icon: ClipboardList,   label: "Reporting"  },
    { key: "profile",    Icon: User,            label: "Profile"    },
  ];

  // ── Handlers ────────────────────────────────────────────
  const handleTimeIn = () => {
    const now    = new Date();
    const cutoff = new Date(now); cutoff.setHours(8, 30, 0, 0);
    const status = now > cutoff ? "Late" : "On Time";
    const record = {
      id: Date.now(), date: todayStr(),
      dayLabel: now.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      timeIn: formatTime(now), timeInMs: now.getTime(),
      timeOut: null, timeOutMs: null, duration: null,
      status, note: attNote.trim(),
    };
    setAttendanceLog(prev => [record, ...prev.filter(r => r.date !== todayStr())]);
    setAttNote("");
    setModal(null);
  };

  const handleTimeOut = () => {
    const now = new Date();
    setAttendanceLog(prev => prev.map(r => {
      if (r.date !== todayStr()) return r;
      const durationMs = now.getTime() - r.timeInMs;
      const hrs = durationMs / 3600000;
      return {
        ...r,
        timeOut: formatTime(now), timeOutMs: now.getTime(),
        duration: formatDuration(durationMs),
        status: hrs < 4 ? "Half Day" : r.status,
      };
    }));
    setModal(null);
  };

  const handleReportSubmit = () => {
    const newReport = {
      id: Date.now(),
      date: reportForm.date,
      type: reportForm.type,
      description: reportForm.description,
      files: reportForm.files,
      submittedAt: new Date().toLocaleDateString("en-PH"),
    };
    setReports(prev => [newReport, ...prev]);
    setReportForm({ date: "", type: "daily", description: "", files: [] });
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const parseTypedTime = (raw, period) => {
    const cleaned = (raw || "").trim();
    if (!cleaned) return null;
    const parts = cleaned.includes(":") ? cleaned.split(":") : [cleaned, "0"];
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] ?? "0", 10);
    if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) return null;
    if (period === "AM") { if (h === 12) h = 0; }
    else                 { if (h !== 12) h += 12; }
    return [h, m];
  };

  const handleRetroLog = () => {
    setRetroError("");
    const { date, timeInRaw, timeInPeriod, timeOutRaw, timeOutPeriod, note } = retroForm;
    if (!date || !timeInRaw || !timeOutRaw) { setRetroError("Please fill in date, time in, and time out."); return; }
    if (date > todayStr()) { setRetroError("You cannot log a future date."); return; }
    if (attendanceLog.find(r => r.date === date)) { setRetroError("An attendance record for this date already exists."); return; }
    const parsedIn  = parseTypedTime(timeInRaw,  timeInPeriod);
    const parsedOut = parseTypedTime(timeOutRaw, timeOutPeriod);
    if (!parsedIn)  { setRetroError("Invalid Time In. Use format like 8:00 or 8."); return; }
    if (!parsedOut) { setRetroError("Invalid Time Out. Use format like 5:00 or 5."); return; }
    const baseDate  = new Date(date + "T00:00:00");
    const timeInMs  = new Date(baseDate).setHours(parsedIn[0],  parsedIn[1],  0, 0);
    const timeOutMs = new Date(baseDate).setHours(parsedOut[0], parsedOut[1], 0, 0);
    if (timeOutMs <= timeInMs) { setRetroError("Time Out must be after Time In."); return; }
    const durationMs = timeOutMs - timeInMs;
    const hrs        = durationMs / 3600000;
    const cutoff     = new Date(baseDate).setHours(8, 30, 0, 0);
    const status     = timeInMs > cutoff ? "Late" : hrs < 4 ? "Half Day" : "On Time";
    const record = {
      id: Date.now(), date,
      dayLabel: new Date(date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      timeIn:  new Date(timeInMs).toLocaleTimeString("en-PH",  { hour: "2-digit", minute: "2-digit", hour12: true }),
      timeInMs,
      timeOut: new Date(timeOutMs).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true }),
      timeOutMs,
      duration: formatDuration(durationMs),
      status, note: note.trim(), isRetro: true,
    };
    setAttendanceLog(prev => [record, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    setRetroForm({ date: "", timeInRaw: "", timeInPeriod: "AM", timeOutRaw: "", timeOutPeriod: "PM", note: "" });
    setRetroSuccess(true);
    setTimeout(() => setRetroSuccess(false), 3000);
  };

  const saveProfile = () => { setIntern({ ...editForm }); setEditMode(false); };

  return (
    <div className={`ids-root${darkMode ? " ids-dark" : ""}`}>

      {/* SIDEBAR */}
      <aside className={`ids-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="ids-sidebar-brand">
          <img
            src={ptvLogo}
            alt="PTV" className="ids-logo-img"
          />
          <div className="ids-brand-text">
            <span className="ids-brand-main">Intern Portal</span>
            <span className="ids-brand-sub">IMS v1.0</span>
          </div>
        </div>

        <div className="ids-intern-card"
          onClick={() => { setActiveTab("profile"); setSidebarOpen(false); }}>
          <div className="ids-intern-avatar">
            {intern.photo ? <img src={intern.photo} alt="avatar" /> : <User size={18} />}
          </div>
          <div className="ids-intern-info">
            <p className="ids-intern-name">{intern.name || "Set up your profile"}</p>
            <p className="ids-intern-dept">{intern.department || "No department set"}</p>
          </div>
        </div>

        <nav className="ids-nav">
          <span className="ids-nav-section-label">MENU</span>
          {navItems.map(({ key, Icon, label }) => (
            <button key={key}
              className={`ids-nav-item ${activeTab === key ? "active" : ""}`}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}>
              <Icon size={16} className="ids-nav-icon" />
              <span className="ids-nav-label">{label}</span>
              {activeTab === key && <span className="ids-nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="ids-sidebar-footer">
          <div className="ids-hours-mini">
            <span>
              {intern.requiredHours
                ? `${autoRenderedHrsDisplay} / ${intern.requiredHours} hrs`
                : "No hours set yet"}
            </span>
            <div className="ids-mini-bar">
              <div className="ids-mini-fill" style={{ width: `${progress}%` }} />
            </div>
            {intern.requiredHours && (
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,.35)", marginTop: "4px", display: "block" }}>
                {progress}% · {remainingWorkingDays > 0 ? `${remainingWorkingDays} days left` : "Internship ended"}
              </span>
            )}
          </div>
          <button className="ids-logout-btn" onClick={() => setModal({ type: "signOut" })}><LogOut size={14} /> Sign Out</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="ids-main">
        <header className="ids-topbar">
          <button className="ids-hamburger" onClick={() => setSidebarOpen(v => !v)}>
            <Menu size={20} />
          </button>
          <div className="ids-topbar-title">
            {navItems.find(n => n.key === activeTab)?.label}
          </div>
          <div className="ids-topbar-right">
            <button className="ids-theme-toggle" onClick={() => setDarkMode(v => !v)}>
              {darkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <div className="ids-content">
          {activeTab === "dashboard" && (
            <DashboardTab
              intern={intern} reports={reports} attendanceLog={attendanceLog}
              liveTime={liveTime} autoRenderedHrs={autoRenderedHrs}
              autoRenderedHrsDisplay={autoRenderedHrsDisplay} progress={progress}
              hrsRemaining={hrsRemaining} totalWorkingDays={totalWorkingDays}
              remainingWorkingDays={remainingWorkingDays} hrsPerDay={hrsPerDay}
              totalAttDays={totalAttDays} totalAttHours={totalAttHours}
              existingToday={existingToday} isTimedIn={isTimedIn} isTimedOut={isTimedOut}
              setActiveTab={setActiveTab} setModal={setModal}
            />
          )}
          {activeTab === "attendance" && (
            <AttendanceTab
              attendanceLog={attendanceLog} setAttendanceLog={setAttendanceLog}
              liveTime={liveTime} existingToday={existingToday}
              isTimedIn={isTimedIn} isTimedOut={isTimedOut}
              totalAttDays={totalAttDays} totalAttHours={totalAttHours}
              onTimeCount={onTimeCount} lateCount={lateCount}
              attFilter={attFilter} setAttFilter={setAttFilter}
              filteredLog={filteredLog} retroForm={retroForm}
              setRetroForm={setRetroForm} retroError={retroError}
              retroSuccess={retroSuccess} handleRetroLog={handleRetroLog}
              totalWorkingDays={totalWorkingDays}
            />
          )}
          {activeTab === "reporting" && (
            <ReportingTab
              reports={reports} setReports={setReports}
              reportForm={reportForm} setReportForm={setReportForm}
              submitSuccess={submitSuccess} handleReportSubmit={handleReportSubmit}
              setModal={setModal}
            />
          )}
          {activeTab === "profile" && (
            <ProfileTab
              intern={intern} editMode={editMode} setEditMode={setEditMode}
              editForm={editForm} setEditForm={setEditForm}
              saveProfile={saveProfile}
            />
          )}
        </div>
      </div>

      {sidebarOpen && <div className="ids-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* MODALS */}
      {modal && (
        <div className="ids-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ids-modal" onClick={e => e.stopPropagation()}>

            {modal.type === "timeIn" && (
              <>
                <div className="ids-modal-icon ids-modal-icon-blue"><LogIn size={22} /></div>
                <h3>Clock In</h3>
                <p>You're about to clock in for <strong>{new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}</strong> at <strong>{formatTime(new Date())}</strong>.</p>
                <div className="ids-field" style={{ textAlign: "left", marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".4px" }}>Note (optional)</label>
                  <input type="text" placeholder="e.g. Working on UI redesign..."
                    value={attNote} onChange={e => setAttNote(e.target.value)}
                    style={{ padding: "10px 14px", border: "1.5px solid #e2e6f0", borderRadius: "8px", fontFamily: "inherit", fontSize: "14px", outline: "none" }} />
                </div>
                <div className="ids-modal-actions">
                  <button className="ids-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                  <button className="ids-modal-confirm ids-modal-confirm-blue" onClick={handleTimeIn}>
                    <LogIn size={14} /> Clock In
                  </button>
                </div>
              </>
            )}

            {modal.type === "timeOut" && (
              <>
                <div className="ids-modal-icon ids-modal-icon-red"><LogOutIcon size={22} /></div>
                <h3>Clock Out</h3>
                <p>You're about to clock out at <strong>{formatTime(new Date())}</strong>. Time elapsed: <strong>{formatDuration(new Date() - existingToday?.timeInMs)}</strong>.</p>
                <div className="ids-modal-actions">
                  <button className="ids-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                  <button className="ids-modal-confirm ids-modal-confirm-red" onClick={handleTimeOut}>
                    <LogOutIcon size={14} /> Clock Out
                  </button>
                </div>
              </>
            )}

            {modal.type === "submit" && (
              <>
                <div className="ids-modal-icon ids-modal-icon-blue"><Save size={22} /></div>
                <h3>Submit Report?</h3>
                <p>Are you sure you want to submit this report? You can still unsubmit it afterwards.</p>
                <div className="ids-modal-actions">
                  <button className="ids-modal-cancel" onClick={() => setModal(null)}>
                    <XCircle size={14} /> Cancel
                  </button>
                  <button className="ids-modal-confirm ids-modal-confirm-blue" onClick={() => {
                    handleReportSubmit(); setModal(null);
                  }}>
                    <Save size={14} /> Yes, Submit
                  </button>
                </div>
              </>
            )}

            {modal.type === "unsubmit" && (
              <>
                <div className="ids-modal-icon ids-modal-icon-red"><XCircle size={22} /></div>
                <h3>Unsubmit Report?</h3>
                <p>This will remove your submission. You can fill out and resubmit the report again afterwards.</p>
                <div className="ids-modal-actions">
                  <button className="ids-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                  <button className="ids-modal-confirm ids-modal-confirm-red" onClick={() => {
                    const report = reports.find(x => x.id === modal.id);
                    setReports(prev => prev.filter(x => x.id !== modal.id));
                    setReportForm({ date: report.date, type: report.type, description: report.description, files: report.files });
                    setModal(null);
                  }}>
                    <XCircle size={14} /> Yes, Unsubmit
                  </button>
                </div>
              </>
            )}

            {modal.type === "signOut" && (
              <>
                <div className="ids-modal-icon ids-modal-icon-red"><LogOut size={22} /></div>
                <h3>Sign Out</h3>
                <p>Are you sure you want to sign out? Your session data will be cleared.</p>
                <div className="ids-modal-actions">
                  <button className="ids-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                  <button className="ids-modal-confirm ids-modal-confirm-red" onClick={() => {
                    setIntern(EMPTY_INTERN);
                    setEditForm({ ...EMPTY_INTERN });
                    setReports([]);
                    setReportForm({ date: "", type: "daily", description: "", files: [] });
                    setAttendanceLog([]);
                    setAttNote("");
                    setActiveTab("dashboard");
                    setModal(null);
                    navigate("/");
                  }}>
                    <LogOut size={14} /> Yes, Sign Out
                  </button>
                </div>
              </>
            )}

            {modal.type === "attachment" && (
            <>
                <div className="ids-modal-attachment-header">
                  <div className="ids-modal-icon ids-modal-icon-blue" style={{ margin: "0" }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 style={{ textAlign: "left", marginBottom: "2px" }}>{modal.file.name}</h3>
                    <p style={{ textAlign: "left", marginBottom: "0", fontSize: "12px" }}>
                      {(modal.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button className="ids-modal-close" onClick={() => setModal(null)}><X size={18} /></button>
                </div>
                <div className="ids-modal-preview">
                  {modal.file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={modal.file.url} alt={modal.file.name} className="ids-preview-img" />
                  ) : modal.file.name.match(/\.pdf$/i) ? (
                    <iframe src={modal.file.url} className="ids-preview-iframe" title={modal.file.name} />
                  ) : (
                    <div className="ids-preview-unsupported">
                      <FileText size={40} />
                      <p>Preview not available for this file type.</p>
                      <a href={modal.file.url} download={modal.file.name} className="ids-preview-download">Download File</a>
                    </div>
                  )}
                </div>
                <div className="ids-modal-actions" style={{ marginTop: "16px" }}>
                  <button className="ids-modal-cancel" onClick={() => setModal(null)}>Close</button>
                  <a href={modal.file.url} download={modal.file.name}
                    className="ids-modal-confirm ids-modal-confirm-blue"
                    style={{ textDecoration: "none" }}>
                    Download
                  </a>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}