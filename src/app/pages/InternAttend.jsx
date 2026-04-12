import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Download, FileText,
  Clock, Sunrise, Sunset, Timer
} from "lucide-react";
import "./InternAttend.css";

const todayStr = () => new Date().toISOString().split("T")[0];

const formatDuration = (ms) => {
  if (!ms || ms <= 0) return "—";
  const totalMins = Math.floor(ms / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins}m`;
  return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`;
};

const STATUS_CONFIG = {
  "On Time":  { cls: "att-status-ontime"  },
  "Late":     { cls: "att-status-late"    },
  "Half Day": { cls: "att-status-halfday" },
  "Absent":   { cls: "att-status-absent"  },
  "Holiday":  { cls: "att-status-holiday" },
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const PH_HOLIDAYS = {
  // 2026 — Regular Holidays (Proclamation No. 1006 + 1189)
  "2026-01-01": "New Year's Day",
  "2026-03-20": "Eid'l Fitr",
  "2026-04-02": "Maundy Thursday",
  "2026-04-03": "Good Friday",
  "2026-04-09": "Araw ng Kagitingan",
  "2026-05-01": "Labor Day",
  "2026-06-12": "Independence Day",
  "2026-08-31": "National Heroes Day",
  "2026-11-30": "Bonifacio Day",
  "2026-12-25": "Christmas Day",
  "2026-12-30": "Rizal Day",
  // 2026 — Special Non-Working Days
  "2026-02-17": "Chinese New Year",
  "2026-04-04": "Black Saturday",
  "2026-08-21": "Ninoy Aquino Day",
  "2026-11-01": "All Saints' Day",
  "2026-11-02": "All Souls' Day",
  "2026-12-08": "Feast of the Immaculate Conception",
  "2026-12-24": "Christmas Eve",
  "2026-12-31": "Last Day of the Year",
};

export default function AttendanceTab({
  attendanceLog, setAttendanceLog, liveTime,
  existingToday, isTimedIn, isTimedOut,
  totalAttDays, totalAttHours, onTimeCount, lateCount,
  attFilter, setAttFilter, filteredLog,
  retroForm, setRetroForm, retroError, retroSuccess,
  handleRetroLog, totalWorkingDays,
}) {
  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editForm,  setEditForm]  = useState({
    timeInRaw: "", timeInPeriod: "AM",
    timeOutRaw: "", timeOutPeriod: "PM",
    breakMins: "60", comments: "",
  });

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

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const openEdit = (dateStr) => {
    const rec = logMap[dateStr];
    if (rec) {
      const parseBack = (timeStr) => {
        if (!timeStr) return null;
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return null;
        return { raw: `${match[1]}:${match[2]}`, period: match[3].toUpperCase() };
      };
      const tin  = parseBack(rec.timeIn);
      const tout = parseBack(rec.timeOut);
      setEditForm({
        timeInRaw:     tin  ? tin.raw     : "8:00",
        timeInPeriod:  tin  ? tin.period  : "AM",
        timeOutRaw:    tout ? tout.raw    : "5:00",
        timeOutPeriod: tout ? tout.period : "PM",
        breakMins: rec.breakMins ?? "60",
        comments: rec.note ?? "",
      });
    } else {
      setEditForm({ timeInRaw: "8:00", timeInPeriod: "AM", timeOutRaw: "5:00", timeOutPeriod: "PM", breakMins: "60", comments: "" });
    }
    setEditModal({ dateStr, record: rec ?? null });
  };

  const saveEdit = () => {
    const { dateStr } = editModal;
    const { timeInRaw, timeInPeriod, timeOutRaw, timeOutPeriod, breakMins, comments } = editForm;

    const parsedIn = (() => {
      const parts = timeInRaw.includes(":") ? timeInRaw.split(":") : [timeInRaw, "0"];
      let h = parseInt(parts[0]); const m = parseInt(parts[1] ?? "0");
      if (isNaN(h) || isNaN(m)) return null;
      if (timeInPeriod === "AM") { if (h === 12) h = 0; } else { if (h !== 12) h += 12; }
      return [h, m];
    })();
    const parsedOut = (() => {
      const parts = timeOutRaw.includes(":") ? timeOutRaw.split(":") : [timeOutRaw, "0"];
      let h = parseInt(parts[0]); const m = parseInt(parts[1] ?? "0");
      if (isNaN(h) || isNaN(m)) return null;
      if (timeOutPeriod === "AM") { if (h === 12) h = 0; } else { if (h !== 12) h += 12; }
      return [h, m];
    })();

    if (!parsedIn || !parsedOut) { alert("Invalid time format."); return; }

    const base      = new Date(dateStr + "T00:00:00");
    const timeInMs  = new Date(base).setHours(parsedIn[0],  parsedIn[1],  0, 0);
    const timeOutMs = new Date(base).setHours(parsedOut[0], parsedOut[1], 0, 0);
    if (timeOutMs <= timeInMs) { alert("Time Out must be after Time In."); return; }

    const breakMs    = (parseInt(breakMins) || 0) * 60000;
    const durationMs = timeOutMs - timeInMs - breakMs;
    const hrs        = durationMs / 3600000;
    const cutoff     = new Date(base).setHours(8, 30, 0, 0);
    const status     = timeInMs > cutoff ? "Late" : hrs < 4 ? "Half Day" : "On Time";

    const timeInDisplay  = new Date(timeInMs).toLocaleTimeString("en-PH",  { hour: "2-digit", minute: "2-digit", hour12: true });
    const timeOutDisplay = new Date(timeOutMs).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true });

    const newRecord = {
      id:       editModal.record?.id ?? Date.now(),
      date:     dateStr,
      dayLabel: new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      timeIn:   timeInDisplay, timeInMs,
      timeOut:  timeOutDisplay, timeOutMs,
      duration: formatDuration(durationMs),
      breakMins,
      status,
      note:     comments.trim(),
      isRetro:  dateStr !== todayStr(),
    };

    setAttendanceLog(prev => {
      const filtered = prev.filter(r => r.date !== dateStr);
      return [newRecord, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    setEditModal(null);
  };

  const markAbsent = () => {
    const { dateStr } = editModal;
    const record = {
      id:       editModal.record?.id ?? Date.now(),
      date:     dateStr,
      dayLabel: new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      timeIn: null, timeInMs: null,
      timeOut: null, timeOutMs: null,
      duration: "—", status: "Absent",
      note: editForm.comments.trim(),
      isRetro: true,
    };
    setAttendanceLog(prev => {
      const filtered = prev.filter(r => r.date !== dateStr);
      return [record, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    setEditModal(null);
  };

  const markHoliday = () => {
    const { dateStr } = editModal;
    const record = {
      id:       editModal.record?.id ?? Date.now(),
      date:     dateStr,
      dayLabel: new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      timeIn: null, timeInMs: null,
      timeOut: null, timeOutMs: null,
      duration: "—", status: "Holiday",
      note: PH_HOLIDAYS[dateStr] ?? editForm.comments.trim() ?? "Holiday",
      isRetro: true,
    };
    setAttendanceLog(prev => {
      const filtered = prev.filter(r => r.date !== dateStr);
      return [record, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    setEditModal(null);
  };

  const [requestModal, setRequestModal] = useState(null);
  const [requestReason, setRequestReason] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const openEditRequest = (dateStr, rec) => {
    setRequestReason("");
    setRequestSent(false);
    setRequestModal({ dateStr, rec });
  };

  const [showRequestConfirm, setShowRequestConfirm] = useState(false);

const submitEditRequest = () => {
  if (!requestReason.trim()) return;
  setShowRequestConfirm(true);
};

const confirmEditRequest = () => {
  console.log("Edit request submitted:", {
    date: requestModal.dateStr,
    record: requestModal.rec,
    reason: requestReason,
  });
  setShowRequestConfirm(false);
  setRequestSent(true);
};

  const monthRecords = useMemo(() => {
    return attendanceLog.filter(r => {
      const d = new Date(r.date + "T00:00:00");
      return d.getFullYear() === calYear && d.getMonth() === calMonth;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [attendanceLog, calYear, calMonth]);

  const exportCSV = () => {
    const rows = [["Date","Day","Time In","Time Out","Break (min)","Duration","Status","Note"]];
    monthRecords.forEach(r => {
      const d = new Date(r.date + "T00:00:00");
      rows.push([
        r.date,
        d.toLocaleDateString("en-PH", { weekday: "long" }),
        r.timeIn ?? "—", r.timeOut ?? "—",
        r.breakMins ?? "—", r.duration ?? "—",
        r.status, r.note ?? "",
      ]);
    });
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `DTR_${MONTH_NAMES[calMonth]}_${calYear}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const rows = monthRecords.map(r => {
      const d = new Date(r.date + "T00:00:00");
      return `<tr>
        <td>${r.date}</td>
        <td>${d.toLocaleDateString("en-PH", { weekday: "long" })}</td>
        <td>${r.timeIn ?? "—"}</td><td>${r.timeOut ?? "—"}</td>
        <td>${r.breakMins ?? "—"}</td><td>${r.duration ?? "—"}</td>
        <td>${r.status}</td><td>${r.note ?? ""}</td>
      </tr>`;
    }).join("");
    const html = `<!DOCTYPE html><html><head><title>DTR - ${MONTH_NAMES[calMonth]} ${calYear}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
      h1 { font-size: 20px; margin-bottom: 4px; }
      p  { font-size: 13px; color: #666; margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { background: #0d1b4b; color: #fff; padding: 8px 10px; text-align: left; }
      td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
      tr:nth-child(even) td { background: #f9fafb; }
    </style></head><body>
    <h1>Daily Time Record — ${MONTH_NAMES[calMonth]} ${calYear}</h1>
    <p>Exported on ${new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
    <table><thead><tr>
      <th>Date</th><th>Day</th><th>Time In</th><th>Time Out</th>
      <th>Break (min)</th><th>Duration</th><th>Status</th><th>Note</th>
    </tr></thead><tbody>${rows}</tbody></table>
    </body></html>`;
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const getCellClass = (dateStr) => {
    const rec = logMap[dateStr];
    const dow = new Date(dateStr + "T00:00:00").getDay();
    const isPHHoliday = !!PH_HOLIDAYS[dateStr];
    if (isPHHoliday) return "att-cal-holiday";
    if (rec) {
      if (rec.status === "Absent")   return "att-cal-absent";
      if (rec.status === "On Time")  return "att-cal-worked";
      if (rec.status === "Late")     return "att-cal-late";
      if (rec.status === "Half Day") return "att-cal-halfday";
      if (rec.timeIn && !rec.timeOut) return "att-cal-active";
    }
    if (dateStr === todayStr()) return "att-cal-today";
    if (dow === 0 || dow === 6) return "att-cal-na";
    return "att-cal-na";
  };

  const getCellLabel = (dateStr) => {
    const rec = logMap[dateStr];
    if (rec) {
      if (rec.status === "Holiday") return PH_HOLIDAYS[dateStr] ?? "Holiday";
      if (rec.status === "Absent")  return "Absent";
      if (rec.timeIn && !rec.timeOut) return "In Progress";
    }
    if (PH_HOLIDAYS[dateStr]) return PH_HOLIDAYS[dateStr];
    return "N/A";
  };

  return (
    <div className="ids-tab-attendance">

      {/* Calendar Panel */}
      <div className="ids-panel att-cal-panel">
        <div className="att-cal-topbar">
          <h2 className="att-cal-title">Daily Time Record</h2>
          <div className="att-cal-controls">
            <button className="att-export-btn att-export-csv" onClick={exportCSV}>
              <FileText size={13} /> CSV
            </button>
            <button className="att-export-btn att-export-pdf" onClick={exportPDF}>
              <Download size={13} /> Export PDF
            </button>
          </div>
        </div>

        <div className="att-legend">
          <span><span className="att-dot dot-green" />Worked</span>
          <span><span className="att-dot dot-blue" />Active / Holiday</span>
          <span><span className="att-dot dot-yellow" />Late / Half Day</span>
          <span><span className="att-dot dot-gray" />N/A</span>
          <span><span className="att-dot dot-red" />Absent</span>
        </div>

        <div className="att-month-nav">
          <button className="att-month-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <div className="att-month-label-wrap">
            <button className="att-month-label-btn" onClick={() => setShowMonthPicker(v => !v)}>
              {MONTH_NAMES[calMonth]} {calYear}
              <span className="att-month-label-caret">▾</span>
            </button>
            {showMonthPicker && (
              <div className="att-month-picker">
                <div className="att-year-row">
                  <button className="att-year-btn" onClick={() => setCalYear(y => y - 1)}>‹</button>
                  <span className="att-year-label">{calYear}</span>
                  <button className="att-year-btn" onClick={() => setCalYear(y => y + 1)}>›</button>
                </div>
                <div className="att-month-grid">
                  {MONTH_NAMES.map((m, i) => (
                    <button key={m}
                      className={`att-month-pick-btn ${i === calMonth && calYear === today.getFullYear() ? "att-month-pick-current" : ""} ${i === calMonth ? "att-month-pick-active" : ""}`}
                      onClick={() => { setCalMonth(i); setShowMonthPicker(false); }}>
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>
                <button className="att-month-pick-today" onClick={() => { setCalMonth(today.getMonth()); setCalYear(today.getFullYear()); setShowMonthPicker(false); }}>
                  Today
                </button>
              </div>
            )}
          </div>
          <button className="att-month-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>

        <div className="att-cal-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="att-cal-dow">{d}</div>
          ))}
          {calDays.map((dateStr, idx) => {
            if (!dateStr) return <div key={`empty-${idx}`} className="att-cal-cell att-cal-empty" />;
            const day    = parseInt(dateStr.split("-")[2]);
            const future = dateStr > todayStr();
            const dow    = new Date(dateStr + "T00:00:00").getDay();
            const rec    = logMap[dateStr];
            return (
              <div key={dateStr}
                className={`att-cal-cell ${getCellClass(dateStr)} ${future || dow === 0 || dow === 6 ? "att-cal-future" : ""} ${dow === 0 || dow === 6 ? "att-cal-weekend" : ""}`}
                onClick={() => {
                  if (future) return;
                  if (dow === 0 || dow === 6) return;
                  const rec = logMap[dateStr];
                  if (rec && rec.timeIn && rec.timeOut) {
                    openEditRequest(dateStr, rec);
                    return;
                  }
                  openEdit(dateStr);
                }}>
                                <span className="att-cal-day-num">{day}</span>
                <span className="att-cal-label">{getCellLabel(dateStr)}</span>
                {rec?.timeIn && rec.status !== "Absent" && rec.status !== "Holiday" && (
                  <span className="att-cal-time">{rec.timeIn}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Month Records Table */}
      <div className="ids-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
          <h3 className="ids-panel-title" style={{ marginBottom: 0 }}>Records — {MONTH_NAMES[calMonth]} {calYear}</h3>
          <div className="att-filter-btns">
            {["all", "week", "month"].map(f => (
              <button key={f} className={`att-filter-btn ${attFilter === f ? "active" : ""}`}
                onClick={() => setAttFilter(f)}>
                {f === "all" ? "All" : f === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </div>
        {filteredLog.length === 0 ? (
          <div className="ids-empty-state">
            <Clock size={28} />
            <p>No records found.</p>
            <p style={{ fontSize: "12px" }}>Click any day on the calendar to add a record.</p>
          </div>
        ) : (
          <div className="att-log-table-wrap att-log-table-scroll">
            <table className="ids-log-table att-log-table">
              <thead>
                <tr><th>Date</th><th>Time In</th><th>Time Out</th><th>Break</th><th>Duration</th><th>Status</th><th>Note</th></tr>
              </thead>
              <tbody>
                {filteredLog.map(r => (
                  <tr key={r.id} className={r.date === todayStr() ? "att-row-today" : ""}
                    onClick={() => {
                    if (r.timeIn && r.timeOut) { openEditRequest(r.date, r); return; }
                    openEdit(r.date);
                  }}
                  style={{ cursor: "pointer" }}>
                    <td className="att-td-date">
                      <span>{r.date === todayStr() ? "Today" : new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                      <span className="att-day-name">{new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "short" })}</span>
                    </td>
                    <td>{r.timeIn ? <span className="att-time-chip att-timein-chip"><Sunrise size={11} />{r.timeIn}</span> : <span className="att-no-note">—</span>}</td>
                    <td>{r.timeOut ? <span className="att-time-chip att-timeout-chip"><Sunset size={11} />{r.timeOut}</span> : r.timeIn ? <span className="att-time-chip att-pending-chip"><Timer size={11} />In progress</span> : <span className="att-no-note">—</span>}</td>
                    <td><span className="att-duration">{r.breakMins ? `${r.breakMins}m` : "—"}</span></td>
                    <td><span className="att-duration">{r.duration}</span></td>
                    <td><span className={`att-status-badge ${STATUS_CONFIG[r.status]?.cls ?? ""}`}>{r.status}</span></td>
                    <td className="att-note-cell">{r.note || <span className="att-no-note">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Record Modal */}
      {editModal && (
        <div className="ids-modal-backdrop" onClick={() => setEditModal(null)}>
          <div className="ids-modal att-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="att-edit-modal-header">
              <div>
                <h3>Edit Record</h3>
                <p className="att-edit-modal-date">
                  {new Date(editModal.dateStr + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button className="ids-modal-close" onClick={() => setEditModal(null)}>✕</button>
            </div>

            <div className="att-edit-grid">
              <div className="ids-field">
                <label>Time In</label>
                <input type="time" className="att-time-native-input"
                  value={(() => {
                    const parts = editForm.timeInRaw.includes(":") ? editForm.timeInRaw.split(":") : [editForm.timeInRaw, "00"];
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
                  }} />
              </div>
              <div className="ids-field">
                <label>Time Out</label>
                <input type="time" className="att-time-native-input"
                  value={(() => {
                    const parts = editForm.timeOutRaw.includes(":") ? editForm.timeOutRaw.split(":") : [editForm.timeOutRaw, "00"];
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
                  }} />
              </div>
            </div>

            <div className="ids-field" style={{ marginTop: "16px" }}>
              <label>Break Duration (minutes)</label>
              <input type="number" min="0" max="480" value={editForm.breakMins}
                onChange={e => setEditForm(f => ({ ...f, breakMins: e.target.value }))}
                style={{ padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-main)", fontSize: "14px", outline: "none", background: "var(--surface)", color: "var(--text-main)" }} />
            </div>

            <div className="ids-field" style={{ marginTop: "16px" }}>
              <label>Comments</label>
              <textarea rows={3} value={editForm.comments}
                onChange={e => setEditForm(f => ({ ...f, comments: e.target.value }))}
                style={{ padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-main)", fontSize: "14px", outline: "none", resize: "vertical", background: "var(--surface)", color: "var(--text-main)" }} />
            </div>

            <div className="att-edit-modal-actions">
              <button className="ids-modal-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="att-modal-absent-btn"  onClick={markAbsent}>Mark Absent</button>
              <button className="att-modal-save-btn"    onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
     )}

      {/* Edit Request Modal */}
      {requestModal && (
        <div className="ids-modal-backdrop" onClick={() => setRequestModal(null)}>
          <div className="ids-modal att-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="att-edit-modal-header">
              <div>
                <h3>Request Edit</h3>
                <p className="att-edit-modal-date">
                  {new Date(requestModal.dateStr + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button className="ids-modal-close" onClick={() => setRequestModal(null)}>✕</button>
            </div>

            {requestSent ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--green-lt)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--green)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "6px", fontSize: "16px" }}>Request Sent!</p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Your edit request has been forwarded to the admin for approval.
                </p>
                <button className="att-modal-save-btn" style={{ marginTop: "20px" }} onClick={() => setRequestModal(null)}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ background: "var(--off-white)", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--navy)" }}>Recorded:</strong>&nbsp;
                  {requestModal.rec?.timeIn} — {requestModal.rec?.timeOut}&nbsp;·&nbsp;
                  <span className={`att-status-badge ${STATUS_CONFIG[requestModal.rec?.status]?.cls ?? ""}`}>{requestModal.rec?.status}</span>
                </div>
                <div className="ids-field">
                  <label>Reason for edit request</label>
                  <textarea rows={4} placeholder="Explain what needs to be corrected and why..."
                    value={requestReason}
                    onChange={e => setRequestReason(e.target.value)}
                    style={{ padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-main)", fontSize: "14px", outline: "none", resize: "vertical", background: "var(--surface)", color: "var(--text-main)", width: "100%" }} />
                </div>
                <div className="att-edit-modal-actions">
                  <button className="ids-modal-cancel" onClick={() => setRequestModal(null)}>Cancel</button>
                  <button className="att-modal-save-btn"
                    onClick={submitEditRequest}
                    disabled={!requestReason.trim()}
                    style={{ opacity: requestReason.trim() ? 1 : 0.5 }}>
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Submit Request Confirmation Modal */}
      {showRequestConfirm && (
        <div className="ids-modal-backdrop" onClick={() => setShowRequestConfirm(false)}>
          <div className="ids-modal" onClick={e => e.stopPropagation()} style={{ textAlign: "left" }}>
            <div className="att-edit-modal-header">
              <div>
                <h3>Confirm Submission</h3>
                <p className="att-edit-modal-date">
                  {requestModal && new Date(requestModal.dateStr + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button className="ids-modal-close" onClick={() => setShowRequestConfirm(false)}>✕</button>
            </div>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: 1.6 }}>
              Are you sure you want to submit this edit request? Your supervisor will be notified for approval.
            </p>
            <div style={{ background: "var(--off-white)", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--navy)" }}>Reason:</strong>&nbsp;{requestReason}
            </div>
            <div className="ids-modal-actions">
              <button className="ids-modal-cancel" onClick={() => setShowRequestConfirm(false)}>Cancel</button>
              <button className="att-modal-save-btn" onClick={confirmEditRequest}>Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}