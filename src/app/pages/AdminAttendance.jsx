import { useState, useMemo } from "react";
import { useApp } from "./AppContext";
import { ChevronLeft, ChevronRight, Flag, Save, X, Download, FileText } from "lucide-react";
import "./AdminAttendance.css";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const todayStr = () => new Date().toISOString().split("T")[0];

const STATUS_CONFIG = {
  "On Time":  { cls: "adm-att-status-ontime"  },
  "Late":     { cls: "adm-att-status-late"    },
  "Half Day": { cls: "adm-att-status-halfday" },
  "Absent":   { cls: "adm-att-status-absent"  },
  "Holiday":  { cls: "adm-att-status-holiday" },
};

export default function AdminAttendance() {
  const { interns: realInterns, getInternAttendance: realGetAttendance, updateAttendanceRecord, flagAttendanceRecord } = useApp();

const MOCK_INTERNS = [
  { id: 1, name: "Maria Santos",    photo: null, status: "active", department: "IT",             supervisor: "Cyril Collao"      },
  { id: 2, name: "Jose Reyes",      photo: null, status: "active", department: "Transmitter",    supervisor: "Ricky Galeza"      },
  { id: 3, name: "Ana Dela Cruz",   photo: null, status: "active", department: "Studio",         supervisor: "Aljune Urrutia"    },
  { id: 4, name: "Carlo Mendoza",   photo: null, status: "active", department: "TOC",            supervisor: "Narciso Rodriguez" },
  { id: 5, name: "Nina Villanueva", photo: null, status: "active", department: "Uplink",         supervisor: "Joselito Tanggol"  },
  { id: 6, name: "Ramon Garcia",    photo: null, status: "active", department: "TV Maintenance", supervisor: "Darius Dela Cruz"  },
];
const MOCK_ATTENDANCE = {
  1: [
    { id: "a101", date: "2026-04-10", timeIn: "08:02 AM", timeOut: "05:05 PM", timeInMs: 1744243320000, timeOutMs: 1744275900000, breakMins: "60", status: "On Time", duration: "8h 3m",  flagged: false, adminNote: "" },
    { id: "a102", date: "2026-04-09", timeIn: "08:15 AM", timeOut: "05:00 PM", timeInMs: 1744156500000, timeOutMs: 1744189200000, breakMins: "60", status: "On Time", duration: "7h 45m", flagged: false, adminNote: "" },
    { id: "a103", date: "2026-04-08", timeIn: "08:00 AM", timeOut: "05:10 PM", timeInMs: 1744070400000, timeOutMs: 1744103400000, breakMins: "60", status: "On Time", duration: "8h 10m", flagged: false, adminNote: "" },
    { id: "a104", date: "2026-04-07", timeIn: "08:45 AM", timeOut: "05:00 PM", timeInMs: 1743990600000, timeOutMs: 1744016400000, breakMins: "60", status: "Late",    duration: "7h 15m", flagged: true,  adminNote: "Late arrival noted." },
  ],
  2: [
    { id: "a201", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
    { id: "a202", date: "2026-04-09", timeIn: "08:10 AM", timeOut: "05:05 PM", timeInMs: 1744157400000, timeOutMs: 1744189500000, breakMins: "60", status: "On Time", duration: "7h 55m", flagged: false, adminNote: "" },
    { id: "a203", date: "2026-04-08", timeIn: "08:05 AM", timeOut: "05:00 PM", timeInMs: 1744071300000, timeOutMs: 1744102800000, breakMins: "60", status: "On Time", duration: "7h 55m", flagged: false, adminNote: "" },
  ],
  3: [
    { id: "a301", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
    { id: "a302", date: "2026-04-09", timeIn: "09:05 AM", timeOut: "05:00 PM", timeInMs: 1744160700000, timeOutMs: 1744189200000, breakMins: "60", status: "Late",    duration: "6h 55m", flagged: true,  adminNote: "Arrived 1 hour late." },
    { id: "a303", date: "2026-04-07", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1743984000000, timeOutMs: 1744016400000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
  ],
  4: [
    { id: "a401", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
    { id: "a402", date: "2026-04-09", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744156800000, timeOutMs: 1744189200000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
  ],
  5: [
    { id: "a501", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
    { id: "a502", date: "2026-04-09", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744156800000, timeOutMs: 1744189200000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
    { id: "a503", date: "2026-04-08", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744070400000, timeOutMs: 1744102800000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
  ],
  6: [
    { id: "a601", date: "2026-04-10", timeIn: "08:00 AM", timeOut: "05:00 PM", timeInMs: 1744243200000, timeOutMs: 1744275600000, breakMins: "60", status: "On Time", duration: "8h",     flagged: false, adminNote: "" },
    { id: "a602", date: "2026-04-08", timeIn: "08:25 AM", timeOut: "05:00 PM", timeInMs: 1744072500000, timeOutMs: 1744102800000, breakMins: "60", status: "Late",    duration: "7h 35m", flagged: true,  adminNote: "Late — no prior notice." },
  ],
};

const interns            = realInterns.length > 0 ? realInterns : MOCK_INTERNS;
const getInternAttendance = (id) => realInterns.length > 0 ? realGetAttendance(id) : (MOCK_ATTENDANCE[id] || []);
  const [selectedInternId, setSelectedInternId] = useState(interns[0]?.id ?? null);
  const [calYear,  setCalYear]  = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [editModal, setEditModal] = useState(null);
  const [editForm,  setEditForm]  = useState({});
  const [flagModal, setFlagModal] = useState(null);
  const [flagNote,  setFlagNote]  = useState("");

  const selectedIntern = interns.find(i => i.id === selectedInternId);
  const attendanceLog  = selectedInternId ? getInternAttendance(selectedInternId) : [];

  const calDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(calMonth + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      cells.push(`${calYear}-${mm}-${dd}`);
    }
    return cells;
  }, [calYear, calMonth]);

  const logMap = useMemo(() => {
    const map = {};
    attendanceLog.forEach(r => { map[r.date] = r; });
    return map;
  }, [attendanceLog]);

  const monthRecords = useMemo(() =>
    attendanceLog.filter(r => {
      const d = new Date(r.date + "T00:00:00");
      return d.getFullYear() === calYear && d.getMonth() === calMonth;
    }).sort((a, b) => a.date.localeCompare(b.date)),
  [attendanceLog, calYear, calMonth]);

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); } else setCalMonth(m => m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); } else setCalMonth(m => m+1); };

  const getCellClass = (dateStr) => {
    const rec = logMap[dateStr];
    if (rec) {
      if (rec.status === "On Time")  return "adm-att-cal-worked";
      if (rec.status === "Late")     return "adm-att-cal-late";
      if (rec.status === "Half Day") return "adm-att-cal-halfday";
      if (rec.status === "Absent")   return "adm-att-cal-absent";
      if (rec.status === "Holiday")  return "adm-att-cal-holiday";
    }
    if (dateStr === todayStr()) return "adm-att-cal-today";
    return "adm-att-cal-na";
  };

  const openEdit = (record) => {
    const parseBack = (str) => {
      if (!str) return { raw: "", period: "AM" };
      const m = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
      return m ? { raw: `${m[1]}:${m[2]}`, period: m[3].toUpperCase() } : { raw: "", period: "AM" };
    };
    const tin  = parseBack(record.timeIn);
    const tout = parseBack(record.timeOut);
    setEditForm({
      timeInRaw: tin.raw, timeInPeriod: tin.period,
      timeOutRaw: tout.raw, timeOutPeriod: tout.period,
      breakMins: record.breakMins ?? "60",
      adminNote: record.adminNote ?? "",
    });
    setEditModal(record);
  };

  const saveEdit = () => {
    const parse = (raw, period) => {
      const parts = raw.includes(":") ? raw.split(":") : [raw, "0"];
      let h = parseInt(parts[0]); const m = parseInt(parts[1] ?? "0");
      if (isNaN(h) || isNaN(m)) return null;
      if (period === "AM") { if (h === 12) h = 0; } else { if (h !== 12) h += 12; }
      return [h, m];
    };
    const pi = parse(editForm.timeInRaw, editForm.timeInPeriod);
    const po = parse(editForm.timeOutRaw, editForm.timeOutPeriod);
    if (!pi || !po) { alert("Invalid time."); return; }
    const base      = new Date(editModal.date + "T00:00:00");
    const timeInMs  = new Date(base).setHours(pi[0], pi[1], 0, 0);
    const timeOutMs = new Date(base).setHours(po[0], po[1], 0, 0);
    if (timeOutMs <= timeInMs) { alert("Time Out must be after Time In."); return; }
    const breakMs    = (parseInt(editForm.breakMins) || 0) * 60000;
    const durationMs = timeOutMs - timeInMs - breakMs;
    const hrs        = durationMs / 3600000;
    const cutoff     = new Date(base).setHours(8, 30, 0, 0);
    const status     = timeInMs > cutoff ? "Late" : hrs < 4 ? "Half Day" : "On Time";
    const fmt = (ms) => new Date(ms).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });
    const totalMins = Math.floor(durationMs / 60000);
    const h2 = Math.floor(totalMins / 60); const m2 = totalMins % 60;
    updateAttendanceRecord(selectedInternId, {
      ...editModal,
      timeIn: fmt(timeInMs), timeInMs,
      timeOut: fmt(timeOutMs), timeOutMs,
      breakMins: editForm.breakMins,
      duration: m2 === 0 ? `${h2}h` : `${h2}h ${m2}m`,
      status,
      adminNote: editForm.adminNote,
      editedByAdmin: true,
    });
    setEditModal(null);
  };

  const exportCSV = () => {
    if (!selectedIntern) return;
    const rows = [["Date","Day","Time In","Time Out","Break(min)","Duration","Status","Note","Flagged"]];
    monthRecords.forEach(r => {
      rows.push([
        r.date,
        new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long" }),
        r.timeIn ?? "—", r.timeOut ?? "—",
        r.breakMins ?? "—", r.duration ?? "—",
        r.status, r.note ?? "", r.flagged ? "Yes" : "No",
      ]);
    });
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `DTR_${selectedIntern.name}_${MONTH_NAMES[calMonth]}_${calYear}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="adm-tab-attendance">

      {/* Intern Selector */}
      <div className="adm-panel adm-att-selector">
        <h3 className="adm-panel-title" style={{ marginBottom: "12px" }}>Select Intern</h3>
        <div className="adm-att-intern-tabs">
          {interns.filter(i => i.status === "active").map(i => (
            <button
              key={i.id}
              className={`adm-att-intern-tab ${selectedInternId === i.id ? "active" : ""}`}
              onClick={() => setSelectedInternId(i.id)}
            >
              <div className="adm-ov-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                {i.photo ? <img src={i.photo} alt={i.name} /> : i.name.charAt(0)}
              </div>
              {i.name}
            </button>
          ))}
          {interns.filter(i => i.status === "active").length === 0 && (
            <p style={{ fontSize: "13px", color: "var(--adm-text-muted)" }}>No active interns yet.</p>
          )}
        </div>
      </div>

      {selectedIntern && (
        <>
          {/* Calendar */}
          <div className="adm-panel adm-att-cal-panel">
            <div className="adm-att-cal-topbar">
              <div>
                <h3 className="adm-panel-title" style={{ marginBottom: 2 }}>
                  DTR — {selectedIntern.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--adm-text-muted)" }}>
                  {selectedIntern.department || "No department"} · {selectedIntern.supervisor || "No supervisor"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="adm-btn adm-btn-ghost" style={{ fontSize: "12px" }} onClick={exportCSV}>
                  <FileText size={13} /> CSV
                </button>
              </div>
            </div>

            <div className="adm-att-month-nav">
              <button className="adm-att-month-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
              <span className="adm-att-month-label">{MONTH_NAMES[calMonth]} {calYear}</span>
              <button className="adm-att-month-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
            </div>

            <div className="adm-att-cal-grid">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="adm-att-cal-dow">{d}</div>
              ))}
              {calDays.map((dateStr, idx) => {
                if (!dateStr) return <div key={`e-${idx}`} className="adm-att-cal-cell adm-att-cal-empty" />;
                const day = parseInt(dateStr.split("-")[2]);
                const dow = new Date(dateStr + "T00:00:00").getDay();
                const rec = logMap[dateStr];
                return (
                  <div
                    key={dateStr}
                    className={`adm-att-cal-cell ${getCellClass(dateStr)} ${dow === 0 || dow === 6 ? "adm-att-cal-weekend" : ""}`}
                    onClick={() => rec && openEdit(rec)}
                    style={{ cursor: rec ? "pointer" : "default" }}
                  >
                    <span className="adm-att-cal-day">{day}</span>
                    {rec && <span className="adm-att-cal-status">{rec.status}</span>}
                    {rec?.flagged && <span className="adm-att-cal-flag">⚑</span>}
                  </div>
                );
              })}
            </div>

            <div className="adm-att-legend">
              <span><span className="adm-att-dot adm-dot-green"/>On Time</span>
              <span><span className="adm-att-dot adm-dot-yellow"/>Late / Half Day</span>
              <span><span className="adm-att-dot adm-dot-red"/>Absent</span>
              <span><span className="adm-att-dot adm-dot-blue"/>Holiday</span>
            </div>
          </div>

          {/* Records Table */}
          <div className="adm-panel">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <h3 className="adm-panel-title" style={{ marginBottom: 0 }}>
                Records — {MONTH_NAMES[calMonth]} {calYear}
              </h3>
            </div>

            {monthRecords.length === 0 ? (
              <div className="adm-empty-state">
                <p>No records for this month.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="adm-att-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Break</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Note</th>
                      <th>Flag</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthRecords.map(r => (
                      <tr key={r.id} className={r.flagged ? "adm-att-row-flagged" : ""}>
                        <td>
                          <div className="adm-att-date-cell">
                            <span>{new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                            <span className="adm-att-dow">{new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "short" })}</span>
                          </div>
                        </td>
                        <td>{r.timeIn ?? "—"}</td>
                        <td>{r.timeOut ?? "—"}</td>
                        <td>{r.breakMins ? `${r.breakMins}m` : "—"}</td>
                        <td>{r.duration ?? "—"}</td>
                        <td>
                          <span className={`adm-att-status-badge ${STATUS_CONFIG[r.status]?.cls ?? ""}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="adm-att-note">{r.note || <span style={{ color: "var(--adm-text-sm)" }}>—</span>}</td>
                        <td>
                          {r.flagged
                            ? <span className="adm-att-flagged-badge">⚑ Flagged</span>
                            : <span style={{ color: "var(--adm-text-sm)", fontSize: "12px" }}>—</span>}
                          {r.adminNote && <p className="adm-att-admin-note">{r.adminNote}</p>}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              className="adm-btn adm-btn-ghost"
                              style={{ fontSize: "11px", padding: "5px 10px" }}
                              onClick={() => openEdit(r)}
                            >
                              Edit
                            </button>
                            <button
                              className={`adm-btn ${r.flagged ? "adm-btn-red" : "adm-btn-ghost"}`}
                              style={{ fontSize: "11px", padding: "5px 10px" }}
                              onClick={() => { setFlagModal(r); setFlagNote(r.adminNote || ""); }}
                            >
                              <Flag size={11} /> {r.flagged ? "Unflag" : "Flag"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="adm-modal-backdrop" onClick={() => setEditModal(null)}>
          <div className="adm-modal adm-att-edit-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <h3 style={{ textAlign: "left" }}>Edit Attendance Record</h3>
                <p style={{ textAlign: "left", marginBottom: 0, fontSize: "13px" }}>
                  {selectedIntern?.name} ·{" "}
                  {new Date(editModal.date + "T00:00:00").toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button className="adm-modal-close-btn" onClick={() => setEditModal(null)}><X size={18} /></button>
            </div>

            <div className="adm-att-edit-grid">
              <div className="adm-field">
                <label>Time In</label>
                <input type="time"
                  value={(() => {
                    const parts = editForm.timeInRaw?.includes(":") ? editForm.timeInRaw.split(":") : [editForm.timeInRaw, "00"];
                    let h = parseInt(parts[0]) || 0; const m = parseInt(parts[1]) || 0;
                    if (editForm.timeInPeriod === "PM" && h !== 12) h += 12;
                    if (editForm.timeInPeriod === "AM" && h === 12) h = 0;
                    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
                  })()}
                  onChange={e => {
                    const [h24, m] = e.target.value.split(":");
                    let h = parseInt(h24);
                    const period = h >= 12 ? "PM" : "AM";
                    if (h > 12) h -= 12; if (h === 0) h = 12;
                    setEditForm(f => ({ ...f, timeInRaw: `${h}:${m}`, timeInPeriod: period }));
                  }}
                />
              </div>
              <div className="adm-field">
                <label>Time Out</label>
                <input type="time"
                  value={(() => {
                    const parts = editForm.timeOutRaw?.includes(":") ? editForm.timeOutRaw.split(":") : [editForm.timeOutRaw, "00"];
                    let h = parseInt(parts[0]) || 0; const m = parseInt(parts[1]) || 0;
                    if (editForm.timeOutPeriod === "PM" && h !== 12) h += 12;
                    if (editForm.timeOutPeriod === "AM" && h === 12) h = 0;
                    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
                  })()}
                  onChange={e => {
                    const [h24, m] = e.target.value.split(":");
                    let h = parseInt(h24);
                    const period = h >= 12 ? "PM" : "AM";
                    if (h > 12) h -= 12; if (h === 0) h = 12;
                    setEditForm(f => ({ ...f, timeOutRaw: `${h}:${m}`, timeOutPeriod: period }));
                  }}
                />
              </div>
            </div>

            <div className="adm-field" style={{ marginTop: "14px" }}>
              <label>Break (minutes)</label>
              <input type="number" min="0" value={editForm.breakMins}
                onChange={e => setEditForm(f => ({ ...f, breakMins: e.target.value }))} />
            </div>
            <div className="adm-field" style={{ marginTop: "14px" }}>
              <label>Admin Note</label>
              <textarea rows={2} value={editForm.adminNote}
                placeholder="Optional note visible to admin only..."
                onChange={e => setEditForm(f => ({ ...f, adminNote: e.target.value }))} />
            </div>

            <div className="adm-modal-actions" style={{ marginTop: "20px" }}>
              <button className="adm-modal-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="adm-modal-confirm adm-modal-confirm-blue" onClick={saveEdit}>
                <Save size={13} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {flagModal && (
        <div className="adm-modal-backdrop" onClick={() => setFlagModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon adm-modal-icon-red"><Flag size={22} /></div>
            <h3>{flagModal.flagged ? "Unflag" : "Flag"} Record</h3>
            <p>
              {new Date(flagModal.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
              {" "}for <strong>{selectedIntern?.name}</strong>
            </p>
            <div className="adm-field" style={{ textAlign: "left", marginBottom: "20px" }}>
              <label>Reason / Note</label>
              <textarea rows={3} value={flagNote}
                placeholder="e.g. Time in seems incorrect, needs verification..."
                onChange={e => setFlagNote(e.target.value)} />
            </div>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setFlagModal(null)}>Cancel</button>
              <button className="adm-modal-confirm adm-modal-confirm-red" onClick={() => {
                flagAttendanceRecord(selectedInternId, flagModal.id, !flagModal.flagged, flagNote);
                setFlagModal(null);
              }}>
                <Flag size={13} /> {flagModal.flagged ? "Unflag" : "Flag"} Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}