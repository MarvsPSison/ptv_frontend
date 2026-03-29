import { useState, useMemo, useRef } from "react";
import { Upload, FileText, Trash2, Save, XCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import "./InternReport.css";

const todayStr = () => new Date().toISOString().split("T")[0];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const REPORT_STATUS_CONFIG = {
  "daily":    { cls: "rep-type-daily",    label: "DTR"      },
  "weekly":   { cls: "rep-type-weekly",   label: "WEEKLY"   },
  "monthly":  { cls: "rep-type-monthly",  label: "MONTHLY"  },
  "incident": { cls: "rep-type-incident", label: "INCIDENT" },
  "other":    { cls: "rep-type-other",    label: "OTHER"    },
};

export default function ReportingTab({
  reports, setReports, reportForm, setReportForm,
  submitSuccess, handleReportSubmit, setModal,
}) {
  const fileInputRef = useRef();
  const modalFileInputRef = useRef();
  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [repFilter, setRepFilter] = useState("all");
  const [reportModal, setReportModal] = useState(null);
  const [modalForm, setModalForm] = useState({
    date: "", type: "daily", description: "", files: [], comments: [],
  });
  const [newComment, setNewComment] = useState("");

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

  const reportDateMap = useMemo(() => {
    const map = {};
    reports.forEach(r => { map[r.date] = r; });
    return map;
  }, [reports]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const openReportModal = (dateStr) => {
    const existing = reportDateMap[dateStr];
    if (existing) {
      setModalForm({
        date: existing.date,
        type: existing.type,
        description: existing.description,
        files: existing.files ?? [],
        comments: existing.comments ?? [],
      });
      setReportModal({ dateStr, existing: true, id: existing.id });
    } else {
      setModalForm({ date: dateStr, type: "daily", description: "", files: [], comments: [] });
      setReportModal({ dateStr, existing: false, id: null });
    }
    setNewComment("");
  };

  const handleModalFileChange = (e) => {
    const chosen = Array.from(e.target.files).map(f => ({
      name: f.name, size: f.size, url: URL.createObjectURL(f),
    }));
    setModalForm(prev => ({ ...prev, files: [...prev.files, ...chosen] }));
  };

  const removeModalFile = (idx) =>
    setModalForm(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }));

  const handleModalSubmit = () => {
    if (!modalForm.date) { alert("No date selected."); return; }
    const newReport = {
      id: reportModal.id ?? Date.now(),
      date: modalForm.date,
      type: modalForm.type,
      description: modalForm.description,
      files: modalForm.files,
      comments: modalForm.comments ?? [],
      submittedAt: new Date().toLocaleDateString("en-PH"),
    };
    setReports(prev => {
      const filtered = prev.filter(r => r.date !== modalForm.date);
      return [newReport, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    setReportModal(null);
  };

  const handleModalUnsubmit = () => {
    setReports(prev => prev.filter(r => r.id !== reportModal.id));
    setReportModal(null);
  };

  const getCellClass = (dateStr) => {
    const future = dateStr > todayStr();
    if (future) return "rep-cal-na rep-cal-future";
    if (reportDateMap[dateStr]) return "rep-cal-has-report";
    if (dateStr === todayStr()) return "rep-cal-today";
    return "rep-cal-na";
  };

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (repFilter === "all") return true;
      const rDate = new Date(r.date);
      const now = new Date();
      if (repFilter === "week") {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        return rDate >= weekAgo;
      }
      if (repFilter === "month") {
        return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [reports, repFilter]);

  return (
    <div className="ids-tab-reporting">

      {/* Calendar Panel */}
      <div className="ids-panel rep-cal-panel">
        <div className="rep-cal-topbar">
          <h2 className="rep-cal-title">Report Calendar</h2>
          <p className="rep-cal-hint">Click any past date to submit or edit a report</p>
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
            const dow    = new Date(dateStr + "T00:00:00").getDay();
            const future = dateStr > todayStr();
            const hasReport = !!reportDateMap[dateStr];
            return (
              <div key={dateStr}
                className={`att-cal-cell ${getCellClass(dateStr)} ${future || dow === 0 || dow === 6 ? "att-cal-future" : ""} ${dow === 0 || dow === 6 ? "att-cal-weekend" : ""}`}
                onClick={() => !future && dow !== 0 && dow !== 6 && openReportModal(dateStr)}>
                <span className="att-cal-day-num">{day}</span>
                {hasReport && <span className="att-cal-label">Reported</span>}
                {!hasReport && dateStr === todayStr() && <span className="att-cal-label">Today</span>}
              </div>
            );
          })}
        </div>

        <div className="rep-cal-legend">
          <span><span className="att-dot dot-green" />Has Report</span>
          <span><span className="att-dot dot-gray" />No Report</span>
        </div>
      </div>

      {/* Submission History */}
      <div className="ids-panel ids-reports-history">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
          <h3 className="ids-panel-title" style={{ marginBottom: 0 }}>Submission History</h3>
          <div className="att-filter-btns">
            {["all", "week", "month"].map(f => (
              <button key={f} className={`att-filter-btn ${repFilter === f ? "active" : ""}`}
                onClick={() => setRepFilter(f)}>
                {f === "all" ? "All" : f === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="ids-empty-state">
            <FileText size={28} />
            <p>No reports found.</p>
            <p style={{ fontSize: "12px" }}>Click any day on the calendar to add a report.</p>
          </div>
        ) : (
          <div className="rep-history-scroll">
            <table className="ids-log-table rep-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Files</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(r => (
                  <tr key={r.id} onClick={() => openReportModal(r.date)} style={{ cursor: "pointer" }}>
                    <td>
                      <div className="rep-td-date">
                        <span>{new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                        <span className="att-day-name">{new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "short" })}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`rep-type-badge ${REPORT_STATUS_CONFIG[r.type]?.cls ?? ""}`}>
                        {REPORT_STATUS_CONFIG[r.type]?.label ?? r.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="rep-desc-cell">
                      {r.description ? (r.description.length > 60 ? r.description.slice(0, 60) + "…" : r.description) : <span className="att-no-note">—</span>}
                    </td>
                    <td>
                      {r.files.length > 0 ? (
                        <div className="rep-file-tags">
                          {r.files.map((f, i) => (
                            <span key={i} className="ids-report-file-tag"
                              onClick={e => { e.stopPropagation(); f.url && window.open(f.url, "_blank"); }}>
                              <FileText size={10} /> {f.name}
                              {f.url && <span className="ids-file-view"> · View</span>}
                            </span>
                          ))}
                        </div>
                      ) : <span className="att-no-note">—</span>}
                    </td>
                    <td><span className="rep-submitted-date">{r.submittedAt}</span></td>
                    <td>
                      <button className="ids-report-unsubmit-btn"
                        onClick={e => { e.stopPropagation(); setModal({ type: "unsubmit", id: r.id }); }}>
                        <XCircle size={12} /> Unsubmit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div className="ids-modal-backdrop" onClick={() => setReportModal(null)}>
          <div className="rep-modal ids-modal" onClick={e => e.stopPropagation()}>
            <div className="rep-modal-header">
              <div>
                <h3>{reportModal.existing ? "Edit Report" : "Submit Report"}</h3>
                <p className="att-edit-modal-date">
                  {new Date(reportModal.dateStr + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button className="ids-modal-close" onClick={() => setReportModal(null)}><X size={18} /></button>
            </div>

            <div className="ids-field" style={{ marginBottom: "14px" }}>
              <label>Report Type</label>
              <select value={modalForm.type}
                onChange={e => setModalForm(p => ({ ...p, type: e.target.value }))}>
                <option value="daily">Daily Time Record (DTR)</option>
                <option value="weekly">Weekly Narrative Report</option>
                <option value="monthly">Monthly Summary</option>
                <option value="incident">Incident Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ids-field" style={{ marginBottom: "14px" }}>
              <label>Description / Narrative <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 400 }}>(Optional)</span></label>
              <textarea rows={4}
                placeholder="Describe the tasks completed, learnings, observations..."
                value={modalForm.description}
                onChange={e => setModalForm(p => ({ ...p, description: e.target.value }))}
                style={{ padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-main)", fontSize: "14px", outline: "none", resize: "vertical", background: "var(--surface)", color: "var(--text-main)" }} />
            </div>

            <div className="ids-dropzone rep-modal-dropzone"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const dropped = Array.from(e.dataTransfer.files).map(f => ({
                  name: f.name, size: f.size, url: URL.createObjectURL(f),
                }));
                setModalForm(p => ({ ...p, files: [...p.files, ...dropped] }));
              }}>
              <input ref={modalFileInputRef} type="file" multiple
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                style={{ display: "none" }} onChange={handleModalFileChange} />

              {modalForm.files.length === 0 ? (
                <div className="ids-dropzone-empty" onClick={() => modalFileInputRef.current.click()}>
                  <Upload size={22} className="ids-dropzone-icon" style={{ marginBottom: "6px" }} />
                  <p>Drag & drop or <span>click to browse</span></p>
                  <p className="ids-dropzone-hint">PDF, JPG, PNG, DOCX – up to 10MB</p>
                </div>
              ) : (
                <div className="ids-dropzone-filled">
                  <div className="ids-dropzone-filled-files">
                    {modalForm.files.map((f, i) => (
                      <div key={i} className="ids-file-chip">
                        <FileText size={13} />
                        <span className="ids-file-name">{f.name}</span>
                        <span className="ids-file-size">({(f.size / 1024).toFixed(1)} KB)</span>
                        <button type="button" className="ids-file-remove" onClick={e => { e.stopPropagation(); removeModalFile(i); }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="ids-dropzone-add-more" onClick={() => modalFileInputRef.current.click()}>
                    <Upload size={12} /> Add more files
                  </button>
                </div>
              )}
            </div>

            {/* Comments Section */}
            {reportModal.existing && (
              <div className="rep-comments-section">
                <h4 className="rep-comments-title">Comments</h4>

                {modalForm.comments.length === 0 ? (
                  <p className="rep-comments-empty">No comments yet.</p>
                ) : (
                  <div className="rep-comments-list">
                    {modalForm.comments.map((c, i) => (
                      <div key={i} className={`rep-comment-bubble ${c.role === "admin" ? "rep-comment-admin" : "rep-comment-intern"}`}>
                        <div className="rep-comment-meta">
                          <span className="rep-comment-author">{c.role === "admin" ? "Supervisor" : "You"}</span>
                          <span className="rep-comment-time">{c.time}</span>
                        </div>
                        <p className="rep-comment-text">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rep-comment-input-row">
                  <input
                    type="text"
                    className="rep-comment-input"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && newComment.trim()) {
                        const comment = {
                          role: "intern",
                          text: newComment.trim(),
                          time: new Date().toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
                        };
                        setModalForm(p => ({ ...p, comments: [...p.comments, comment] }));
                        setNewComment("");
                      }
                    }}
                  />
                  <button
                    className="rep-comment-send-btn"
                    disabled={!newComment.trim()}
                    onClick={() => {
                      if (!newComment.trim()) return;
                      const comment = {
                        role: "intern",
                        text: newComment.trim(),
                        time: new Date().toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
                      };
                      setModalForm(p => ({ ...p, comments: [...p.comments, comment] }));
                      setNewComment("");
                    }}>
                    Send
                  </button>
                </div>
              </div>
            )}

            <div className="rep-modal-actions">
              <button className="ids-modal-cancel" onClick={() => setReportModal(null)}>Cancel</button>
              {reportModal.existing && (
                <button className="ids-report-unsubmit-btn" onClick={handleModalUnsubmit}>
                  <XCircle size={12} /> Unsubmit
                </button>
              )}
              <button className="att-modal-save-btn" onClick={handleModalSubmit}>
                <Save size={13} style={{ marginRight: "6px" }} />
                {reportModal.existing ? "Save Changes" : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}