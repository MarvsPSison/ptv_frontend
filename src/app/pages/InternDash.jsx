import { useState, useRef } from "react";
import {
  LayoutDashboard, ClipboardList, User, LogOut,
  Clock, Target, BarChart2, CheckCircle2,
  Bell, MapPin, ChevronRight, Menu, Upload,
  FileText, Trash2, CalendarDays, Pencil, Save,
  XCircle, X, Camera, Building2, GraduationCap,
  Phone, Mail, BookOpen
} from "lucide-react";
import "./InternDash.css";

// ── Default empty intern state ──────────────────────────────
const EMPTY_INTERN = {
  name: "", school: "", course: "", department: "",
  supervisor: "", startDate: "", endDate: "",
  requiredHours: "", renderedHours: "",
  email: "", phone: "", address: "", photo: null,
};

// ── Calculates completion percentage ────────────────────────
const pct = (r, t) => (!r || !t) ? 0 : Math.min(100, Math.round((r / t) * 100));

export default function InternDash() {

  // ── State ──────────────────────────────────────────────────
  const [activeTab, setActiveTab]     = useState("dashboard");
  const [intern, setIntern]           = useState(EMPTY_INTERN);       // saved profile
  const [editMode, setEditMode]       = useState(false);              // profile edit toggle
  const [editForm, setEditForm]       = useState({ ...EMPTY_INTERN }); // unsaved edits buffer
  const [reports, setReports]         = useState([]);                 // submitted reports list
  const [reportForm, setReportForm]   = useState({ date: "", type: "daily", description: "", files: [] });
  const [submitSuccess, setSubmitSuccess] = useState(false);          // success toast trigger
  const [sidebarOpen, setSidebarOpen] = useState(false);              // mobile sidebar toggle
  const [modal, setModal]             = useState(null);               // active modal: { type, id?, file? }

  // ── Refs ───────────────────────────────────────────────────
  const fileInputRef  = useRef(); // hidden file input for report attachments
  const photoInputRef = useRef(); // hidden file input for profile photo

  // ── Derived values ─────────────────────────────────────────
  const progress   = pct(Number(intern.renderedHours), Number(intern.requiredHours));
  const hasProfile = intern.name.trim() !== "";

  // ── Sidebar nav items ──────────────────────────────────────
  const navItems = [
    { key: "dashboard", Icon: LayoutDashboard, label: "Dashboard" },
    { key: "reporting", Icon: ClipboardList,   label: "Reporting" },
    { key: "profile",   Icon: User,            label: "Profile" },
  ];

  // ── Submits a new report to the list ──────────────────────
  const handleReportSubmit = () => {
    setReports(prev => [{
      id: Date.now(),
      ...reportForm,
      submittedAt: new Date().toLocaleDateString("en-PH")
    }, ...prev]);
    setReportForm({ date: "", type: "daily", description: "", files: [] });
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // ── Adds selected files with object URLs to the report form
  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files).map(f => ({
      name: f.name, size: f.size, url: URL.createObjectURL(f),
    }));
    setReportForm(prev => ({ ...prev, files: [...prev.files, ...chosen] }));
  };

  // ── Removes a file from the report form by index ──────────
  const removeFile = (idx) =>
    setReportForm(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }));

  // ── Sets profile photo preview in edit buffer ──────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditForm(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
  };

  // ── Commits edit buffer to saved profile ──────────────────
  const saveProfile = () => { setIntern({ ...editForm }); setEditMode(false); };

  return (
    <div className="ids-root">

      {/* ═══════════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════════ */}
      <aside className={`ids-sidebar ${sidebarOpen ? "open" : ""}`}>

        {/* Brand / Logo */}
        <div className="ids-sidebar-brand">
          <img
            src="https://tse1.explicit.bing.net/th/id/OIP.RWCD2dvArfs-tDB_6C5DfgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="PTV" className="ids-logo-img"
          />
          <div className="ids-brand-text">
            <span className="ids-brand-main">Intern Portal</span>
            <span className="ids-brand-sub">IMS v1.0</span>
          </div>
        </div>

        {/* Intern quick-card — navigates to Profile on click */}
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

        {/* Navigation */}
        <nav className="ids-nav">
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

        {/* Hours mini progress + sign out */}
        <div className="ids-sidebar-footer">
          <div className="ids-hours-mini">
            <span>
              {intern.renderedHours && intern.requiredHours
                ? `${intern.renderedHours} / ${intern.requiredHours} hrs`
                : "No hours logged"}
            </span>
            <div className="ids-mini-bar">
              <div className="ids-mini-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button className="ids-logout-btn"><LogOut size={14} /> Sign Out</button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════ */}
      <div className="ids-main">

        {/* Top bar */}
        <header className="ids-topbar">
          <button className="ids-hamburger" onClick={() => setSidebarOpen(v => !v)}>
            <Menu size={20} />
          </button>
          <div className="ids-topbar-title">
            {navItems.find(n => n.key === activeTab)?.label}
          </div>
          <div className="ids-topbar-right">
            <span className="ids-topbar-date">
              {new Date().toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        </header>

        <div className="ids-content">

          {/* ═══════════════════════════════════
              TAB: DASHBOARD
          ═══════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div className="ids-tab-dashboard">

              {/* Stat cards — show "—" if no data yet */}
              <div className="ids-stats-grid">
                {[
                  { Icon: Clock,        value: intern.renderedHours || "—", label: "Hours Rendered",   accent: "accent-blue"  },
                  { Icon: Target,       value: intern.renderedHours && intern.requiredHours ? Number(intern.requiredHours) - Number(intern.renderedHours) : "—", label: "Hours Remaining", accent: "accent-red" },
                  { Icon: BarChart2,    value: intern.requiredHours ? `${progress}%` : "—",             label: "Completion",      accent: "accent-gold"  },
                  { Icon: CheckCircle2, value: reports.length,                                          label: "Reports Submitted", accent: "accent-green" },
                ].map((s, i) => (
                  <div key={i} className={`ids-stat-card ${s.accent}`}>
                    <div className="ids-stat-icon-wrap"><s.Icon size={20} /></div>
                    <div>
                      <p className="ids-stat-value">{s.value}</p>
                      <p className="ids-stat-label">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Internship progress bar */}
              <div className="ids-progress-section">
                <div className="ids-progress-header">
                  <span>Internship Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="ids-progress-track">
                  <div className="ids-progress-fill" style={{ width: `${progress}%` }}>
                    <span className="ids-progress-glow" />
                  </div>
                </div>
                <div className="ids-progress-meta">
                  <span>{intern.startDate ? `Started ${intern.startDate}` : "Start date not set"}</span>
                  <span>{intern.endDate   ? `Ends ${intern.endDate}`     : "End date not set"}</span>
                </div>
              </div>

              {/* Two-column: recent submissions + placement details */}
              <div className="ids-two-col">

                {/* Recent submissions preview (max 5 rows) */}
                <div className="ids-panel">
                  <h3 className="ids-panel-title">Recent Submissions</h3>
                  {reports.length === 0 ? (
                    <div className="ids-empty-state">
                      <FileText size={28} />
                      <p>No reports submitted yet.</p>
                    </div>
                  ) : (
                    <table className="ids-log-table">
                      <thead>
                        <tr><th>Date</th><th>Type</th><th>Description</th></tr>
                      </thead>
                      <tbody>
                        {reports.slice(0, 5).map((r, i) => (
                          <tr key={i}>
                            <td>{r.date}</td>
                            <td><span className="ids-report-type">{r.type}</span></td>
                            <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {r.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Placement details — hidden until profile is set up */}
                <div className="ids-panel">
                  <h3 className="ids-panel-title">Placement Details</h3>
                  {!hasProfile ? (
                    <div className="ids-empty-state">
                      <User size={28} />
                      <p>Set up your profile to see placement details.</p>
                    </div>
                  ) : (
                    <div className="ids-info-list">
                      {[
                        { label: "Department", val: intern.department },
                        { label: "Supervisor", val: intern.supervisor },
                        { label: "School",     val: intern.school },
                        { label: "Course",     val: intern.course },
                        { label: "Start Date", val: intern.startDate },
                        { label: "End Date",   val: intern.endDate },
                      ].map(({ label, val }) => (
                        <div key={label} className="ids-info-row">
                          <span>{label}</span>
                          <strong>{val || "—"}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: REPORTING
          ═══════════════════════════════════ */}
          {activeTab === "reporting" && (
            <div className="ids-tab-reporting">

              <div className="ids-section-header">
                <h2>Submit a Report</h2>
                <p>Attach your Daily Time Record, narrative reports, or any supporting documents.</p>
              </div>

              {/* Success toast after submission */}
              {submitSuccess && (
                <div className="ids-success-toast">✓ Report submitted successfully!</div>
              )}

              {/* Report submission form */}
              <form className="ids-report-form" onSubmit={e => e.preventDefault()}>

                <div className="ids-form-row">
                  <div className="ids-field">
                    <label>Report Date</label>
                    <input type="date" value={reportForm.date}
                      onChange={e => setReportForm(p => ({ ...p, date: e.target.value }))} required />
                  </div>
                  <div className="ids-field">
                    <label>Report Type</label>
                    <select value={reportForm.type}
                      onChange={e => setReportForm(p => ({ ...p, type: e.target.value }))}>
                      <option value="daily">Daily Time Record (DTR)</option>
                      <option value="weekly">Weekly Narrative Report</option>
                      <option value="monthly">Monthly Summary</option>
                      <option value="incident">Incident Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="ids-field">
                  <label>Description / Narrative</label>
                  <textarea rows={5}
                    placeholder="Describe the tasks completed, learnings, observations..."
                    value={reportForm.description}
                    onChange={e => setReportForm(p => ({ ...p, description: e.target.value }))}
                    required />
                </div>

                {/* File drop zone — supports click and drag & drop */}
                <div className="ids-dropzone"
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    const dropped = Array.from(e.dataTransfer.files).map(f => ({
                      name: f.name, size: f.size, url: URL.createObjectURL(f),
                    }));
                    setReportForm(p => ({ ...p, files: [...p.files, ...dropped] }));
                  }}>
                  <Upload size={28} className="ids-dropzone-icon" />
                  <p>Drag & drop files here, or <span>click to browse</span></p>
                  <p className="ids-dropzone-hint">Supports PDF, JPG, PNG, DOCX – up to 10MB each</p>
                  <input ref={fileInputRef} type="file" multiple
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    style={{ display: "none" }} onChange={handleFileChange} />
                </div>

                {/* Attached files list with remove button */}
                {reportForm.files.length > 0 && (
                  <div className="ids-file-list">
                    {reportForm.files.map((f, i) => (
                      <div key={i} className="ids-file-chip">
                        <FileText size={13} />
                        <span className="ids-file-name">{f.name}</span>
                        <span className="ids-file-size">({(f.size / 1024).toFixed(1)} KB)</span>
                        <button type="button" className="ids-file-remove" onClick={() => removeFile(i)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Opens submit confirmation modal */}
                <button type="button" className="ids-submit-btn" onClick={() => {
                  if (!reportForm.date || !reportForm.description) return;
                  setModal({ type: "submit" });
                }}>
                  <Save size={14} /> Submit Report
                </button>
              </form>

              {/* Submission history list */}
              {reports.length > 0 && (
                <div className="ids-panel ids-reports-history">
                  <h3 className="ids-panel-title">Submission History</h3>
                  {reports.map(r => (
                    <div key={r.id} className="ids-report-item">

                      {/* Report header: type tag, date, unsubmit button */}
                      <div className="ids-report-meta">
                        <span className="ids-report-type">{r.type.toUpperCase()}</span>
                        <span className="ids-report-date">{r.date} · Submitted {r.submittedAt}</span>
                        <div className="ids-report-actions">
                          <button className="ids-report-unsubmit-btn"
                            onClick={() => setModal({ type: "unsubmit", id: r.id })}>
                            <XCircle size={12} /> Unsubmit
                          </button>
                        </div>
                      </div>

                      <p className="ids-report-desc">{r.description}</p>

                      {/* Attached files — clicking opens attachment preview modal */}
                      {r.files.length > 0 && (
                        <div className="ids-report-files">
                          {r.files.map((f, i) => (
                            <span key={i} className="ids-report-file-tag"
                              onClick={() => f.url && setModal({ type: "attachment", file: f })}>
                              <FileText size={11} /> {f.name}
                              {f.url && <span className="ids-file-view"> · View</span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════
              TAB: PROFILE
          ═══════════════════════════════════ */}
          {activeTab === "profile" && (
            <div className="ids-tab-profile">

              {/* Profile hero — photo, name, edit/save buttons */}
              <div className="ids-profile-hero">
                <div className="ids-profile-photo-wrap">
                  <div className="ids-profile-photo">
                    {(editMode ? editForm.photo : intern.photo)
                      ? <img src={editMode ? editForm.photo : intern.photo} alt="Profile" />
                      : <User size={32} />}
                  </div>
                  {/* Photo upload button — only visible in edit mode */}
                  {editMode && (
                    <>
                      <button className="ids-change-photo-btn"
                        onClick={() => photoInputRef.current.click()}>
                        <Camera size={12} /> Change Photo
                      </button>
                      <input ref={photoInputRef} type="file" accept="image/*"
                        style={{ display: "none" }} onChange={handlePhotoChange} />
                    </>
                  )}
                </div>

                <div className="ids-profile-headline">
                  <h2>{intern.name || "Your Name"}</h2>
                  <p>
                    {intern.course || intern.school
                      ? `${intern.course || ""}${intern.course && intern.school ? " · " : ""}${intern.school || ""}`
                      : "Complete your profile below"}
                  </p>
                  {intern.department && (
                    <span className="ids-dept-tag">{intern.department}</span>
                  )}
                </div>

                {/* Edit / Save / Cancel actions */}
                <div className="ids-profile-actions">
                  {editMode ? (
                    <>
                      <button className="ids-btn-save" onClick={saveProfile}>Save Changes</button>
                      <button className="ids-btn-cancel"
                        onClick={() => { setEditMode(false); setEditForm({ ...intern }); }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="ids-btn-edit"
                      onClick={() => { setEditMode(true); setEditForm({ ...intern }); }}>
                      <Pencil size={13} /> {hasProfile ? "Edit Profile" : "Set Up Profile"}
                    </button>
                  )}
                </div>
              </div>

              <div className="ids-profile-grid">

                {/* Personal Information panel */}
                <div className="ids-panel">
                  <h3 className="ids-panel-title">Personal Information</h3>
                  {editMode ? (
                    <div className="ids-edit-fields">
                      {[
                        { label: "Full Name", key: "name",    type: "text"  },
                        { label: "Email",     key: "email",   type: "email" },
                        { label: "Phone",     key: "phone",   type: "text"  },
                        { label: "Address",   key: "address", type: "text"  },
                      ].map(({ label, key, type }) => (
                        <div key={key} className="ids-field">
                          <label>{label}</label>
                          <input type={type} value={editForm[key]}
                            onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ids-info-list">
                      <div className="ids-info-row"><span>Email</span><strong>{intern.email}</strong></div>
                      <div className="ids-info-row"><span>Phone</span><strong>{intern.phone}</strong></div>
                      <div className="ids-info-row"><span>Address</span><strong>{intern.address}</strong></div>
                    </div>
                  )}
                </div>

                {/* Academic & Placement panel */}
                <div className="ids-panel">
                  <h3 className="ids-panel-title">Academic & Placement</h3>
                  {editMode ? (
                    <div className="ids-edit-fields">
                      {/* Editable by intern */}
                      {[
                        { label: "School / University", key: "school" },
                        { label: "Course / Program",    key: "course" },
                      ].map(({ label, key }) => (
                        <div key={key} className="ids-field">
                          <label>{label}</label>
                          <input value={editForm[key]}
                            onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                        </div>
                      ))}
                      {/* Department, supervisor, and date range */}
                      {[
                        { label: "Department", key: "department", type: "select" },
                        { label: "Supervisor", key: "supervisor", type: "text" },
                        { label: "Start Date", key: "startDate",  type: "date" },
                        { label: "End Date",   key: "endDate",    type: "date" },
                      ].map(({ label, key, type }) => (
                        <div key={key} className="ids-field">
                          <label>{label}</label>
                          {type === "select" ? (
                            <select value={editForm[key]}
                              onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}>
                              <option value="">Select department...</option>
                              <option>Engineering Office</option>
                              <option>TV Maintenance</option>
                              <option>Studio Operations</option>
                              <option>Technical Operations Center</option>
                              <option>Uplink</option>
                              <option>Information Technology</option>
                              <option>Transmitter Section</option>
                              <option>Microwave</option>
                            </select>
                          ) : (
                            <input type={type} value={editForm[key]}
                              placeholder={`Enter ${label.toLowerCase()}`}
                              onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ids-info-list">
                      {[
                        { label: "School",     val: intern.school },
                        { label: "Course",     val: intern.course },
                        { label: "Department", val: intern.department },
                        { label: "Supervisor", val: intern.supervisor },
                        { label: "Start Date", val: intern.startDate },
                        { label: "End Date",   val: intern.endDate },
                      ].map(({ label, val }) => (
                        <div key={label} className="ids-info-row">
                          <span>{label}</span>
                          <strong>{val}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hours Summary panel — edit fields only visible in edit mode */}
                <div className="ids-panel ids-hours-panel">
                  <h3 className="ids-panel-title">Hours Summary</h3>

                  {/* Input fields for required/rendered hours in edit mode */}
                  {editMode && (
                    <div className="ids-form-row" style={{ marginBottom: "20px" }}>
                      <div className="ids-field">
                        <label>Required Hours</label>
                        <input type="number" value={editForm.requiredHours} placeholder="e.g. 300"
                          onChange={e => setEditForm(p => ({ ...p, requiredHours: e.target.value }))} />
                      </div>
                      <div className="ids-field">
                        <label>Rendered Hours</label>
                        <input type="number" value={editForm.renderedHours} placeholder="e.g. 120"
                          onChange={e => setEditForm(p => ({ ...p, renderedHours: e.target.value }))} />
                      </div>
                    </div>
                  )}

                  {/* SVG ring chart + hours breakdown */}
                  <div className="ids-hours-big">
                    <div className="ids-hours-ring">
                      <svg viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" className="ids-ring-bg" />
                        <circle cx="60" cy="60" r="50" className="ids-ring-fill"
                          strokeDasharray={`${progress * 3.14} 314`} />
                      </svg>
                      <div className="ids-ring-label">
                        <strong>{progress}%</strong>
                        <span>Done</span>
                      </div>
                    </div>
                    <div className="ids-hours-details">
                      <div className="ids-h-row"><span>Required</span><b>{intern.requiredHours} hrs</b></div>
                      <div className="ids-h-row"><span>Rendered</span><b>{intern.renderedHours} hrs</b></div>
                      <div className="ids-h-row"><span>Remaining</span><b>{intern.requiredHours - intern.renderedHours} hrs</b></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && <div className="ids-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ═══════════════════════════════════════
          MODALS
      ═══════════════════════════════════════ */}
      {modal && (
        <div className="ids-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ids-modal" onClick={e => e.stopPropagation()}>

            {/* Submit confirmation modal */}
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
                    handleReportSubmit();
                    setModal(null);
                  }}>
                    <Save size={14} /> Yes, Submit
                  </button>
                </div>
              </>
            )}

            {/* Unsubmit confirmation modal — restores data back into the form */}
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
                    // Restore report data back into the form for re-editing
                    setReportForm({
                      date: report.date,
                      type: report.type,
                      description: report.description,
                      files: report.files,
                    });
                    setActiveTab("reporting");
                    setModal(null);
                  }}>
                    <XCircle size={14} /> Yes, Unsubmit
                  </button>
                </div>
              </>
            )}

            {/* Attachment preview modal — supports image, PDF, or download fallback */}
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
                  <button className="ids-modal-close" onClick={() => setModal(null)}>
                    <X size={18} />
                  </button>
                </div>

                {/* Preview area: image, PDF iframe, or unsupported fallback */}
                <div className="ids-modal-preview">
                  {modal.file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={modal.file.url} alt={modal.file.name} className="ids-preview-img" />
                  ) : modal.file.name.match(/\.pdf$/i) ? (
                    <iframe src={modal.file.url} className="ids-preview-iframe" title={modal.file.name} />
                  ) : (
                    <div className="ids-preview-unsupported">
                      <FileText size={40} />
                      <p>Preview not available for this file type.</p>
                      <a href={modal.file.url} download={modal.file.name} className="ids-preview-download">
                        Download File
                      </a>
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