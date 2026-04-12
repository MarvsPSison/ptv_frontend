import { useState } from "react";
import { useApp } from "./AppContext";
import { Shield, Plus, Trash2, Check, KeyRound } from "lucide-react";
import "./AdminOIC.css";

const OICS = [
  { name: "Ricky Galeza",      department: "Transmitter"   },
  { name: "Darius Dela Cruz",  department: "TV Maintenance" },
  { name: "Joselito Tanggol",  department: "Uplink"        },
  { name: "Narciso Rodriguez", department: "TOC"           },
  { name: "Aljune Urrutia",    department: "Studio"        },
  { name: "Cyril Collao",      department: "IT"            },
  { name: "Lyndon Valderama",  department: "OB Van"        },
];

const DEPARTMENTS = OICS.map(o => o.department);
const emptyForm = { name: "", department: "", username: "", password: "", confirmPassword: "" };
const emptyReset = { password: "", confirmPassword: "" };

export default function AdminOIC({ darkMode }) {
  const { oics: realOics, addOIC, updateOIC, deleteOIC } = useApp();

const MOCK_OICS = [
  { id: 101, name: "Ricky Galeza",      department: "Transmitter",    username: "oic_transmitter", password: "Ptv@1234" },
  { id: 102, name: "Darius Dela Cruz",  department: "TV Maintenance", username: "oic_tvmaint",     password: "Ptv@1234" },
  { id: 103, name: "Joselito Tanggol",  department: "Uplink",         username: "oic_uplink",      password: "Ptv@1234" },
  { id: 104, name: "Narciso Rodriguez", department: "TOC",            username: "oic_toc",         password: "Ptv@1234" },
  { id: 105, name: "Aljune Urrutia",    department: "Studio",         username: "oic_studio",      password: "Ptv@1234" },
  { id: 106, name: "Cyril Collao",      department: "IT",             username: "oic_it",          password: "Ptv@1234" },
];

const oics = realOics.length > 0 ? realOics : MOCK_OICS;
 const [activeTab, setActiveTab] = useState("oic");
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState({});
  const [resetForm, setResetForm]         = useState(emptyReset);
  const [resetErrors, setResetErrors]     = useState({});

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name       = "Name is required.";
    if (!form.department)      e.department = "Department is required.";
    if (!form.username.trim()) e.username   = "Username is required.";
    if (!form.password.trim()) {
      e.password = "Password is required.";
    } else if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(form.password)) {
      e.password = "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(form.password)) {
      e.password = "Password must contain at least one number.";
    }
    if (!form.confirmPassword.trim()) {
      e.confirmPassword = "Please confirm the password.";
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match.";
    }
    return e;
  };

  const openAdd    = () => { setForm(emptyForm); setErrors({}); setModal({ type: "add" }); };
  const openEdit   = (oic) => { setForm({ name: oic.name, department: oic.department, username: oic.username, password: oic.password, confirmPassword: oic.password }); setErrors({}); setModal({ type: "edit", oic }); };
  const openDelete = (oic) => setModal({ type: "delete", oic });
  const openReset  = (oic) => { setResetForm(emptyReset); setResetErrors({}); setModal({ type: "reset", oic }); };
  const closeModal = () => { setModal(null); setErrors({}); setResetErrors({}); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (modal.type === "add") {
      setModal({ type: "confirm", data: { ...form } });
    } else {
      updateOIC(modal.oic.id, form);
      closeModal();
    }
  };

  return (
    <div className="adm-oic-tab">

      {/* Header */}
      <div className="adm-oic-header">
        <div className="adm-oic-header-text">
          <h2 className="adm-oic-title">OIC Management</h2>
          <p className="adm-oic-sub">
            <span className="adm-oic-sub-dot" />
            Officers-in-Charge monitor their department's interns in read-only mode.
          </p>
        </div>
        {activeTab === "oic" && (
          <button className="adm-oic-add-btn" onClick={openAdd}>
            <Plus size={15} /> Add OIC
          </button>
        )}
      </div>

      {/* ── OIC Tab ── */}
      <>
        <div className="adm-oic-stats">
            <div className="adm-oic-stat-pill">
              <span className="adm-oic-stat-pill-val">{oics.length}</span>
              <span className="adm-oic-stat-pill-label">Total OICs</span>
            </div>
            <div className="adm-oic-stat-pill">
              <span className="adm-oic-stat-pill-val">{DEPARTMENTS.length}</span>
              <span className="adm-oic-stat-pill-label">Departments</span>
            </div>
            <div className="adm-oic-stat-pill">
              <span className="adm-oic-stat-pill-val">{DEPARTMENTS.length - oics.length}</span>
              <span className="adm-oic-stat-pill-label">Unregistered</span>
            </div>
          </div>

          {oics.length === 0 ? (
            <div className="adm-oic-empty">
              <div className="adm-oic-empty-icon"><Shield size={26} /></div>
              <p>No OICs added yet.</p>
              <span>Click "Add OIC" to create an Officer-in-Charge account.</span>
            </div>
          ) : (
            <div className="adm-oic-grid">
              {oics.map(o => (
                <OICRow key={o.id} oic={o} onReset={openReset} />
              ))}
            </div>
          )}
        </>

      {/* Add / Edit Modal */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "440px" }}>
            <div className="adm-modal-icon" style={{ background: "#e8f0fe" }}>
              <Shield size={22} style={{ color: "#0b1d45" }} />
            </div>
            <h3>{modal.type === "add" ? "Add OIC" : "Edit OIC"}</h3>
            <p style={{ fontSize: "13px", color: "#6b7494", marginBottom: "20px" }}>
              {modal.type === "add" ? "Create a new Officer-in-Charge account." : "Update OIC details."}
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              <div className={`login-field ${errors.name ? "has-error" : ""}`}>
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="e.g. Maria Santos" />
                {errors.name && <span className="login-error">{errors.name}</span>}
              </div>
              <div className={`login-field ${errors.department ? "has-error" : ""}`}>
                <label>Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={(e) => {
                    const dept = e.target.value;
                    const matched = OICS.find(o => o.department === dept);
                    setForm(f => ({ ...f, department: dept, name: matched ? matched.name : f.name }));
                    setErrors(er => ({ ...er, department: "", name: "" }));
                  }}
                  style={{ padding:"9px 13px", borderRadius:"8px", border:"1.5px solid #e2e6f0", fontFamily:"Inter,sans-serif", fontSize:"0.83rem", color: form.department ? "#0b1d45" : "#9ca3af", outline:"none" }}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className="login-error">{errors.department}</span>}
              </div>
              <div className={`login-field ${errors.username ? "has-error" : ""}`}>
                <label>Username</label>
                <input name="username" value={form.username} onChange={handle} placeholder="e.g. oic_news" />
                {errors.username && <span className="login-error">{errors.username}</span>}
              </div>
              <div className={`login-field ${errors.password ? "has-error" : ""}`}>
                <label>Password</label>
                <input type="password" name="password" value={form.password} onChange={handle} placeholder="••••••••" />
                {errors.password && <span className="login-error">{errors.password}</span>}
                {form.password && (() => {
                  const score =
                    (form.password.length >= 8 ? 1 : 0) +
                    (/[A-Z]/.test(form.password) ? 1 : 0) +
                    (/[0-9]/.test(form.password) ? 1 : 0) +
                    (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0);
                  const labels = ["","Weak","Fair","Good","Strong"];
                  const colors = ["","#ef4444","#f59e0b","#3b82f6","#22c55e"];
                  return (
                    <div style={{ marginTop: "6px" }}>
                      <div style={{ display:"flex", gap:"4px", marginBottom:"4px" }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{ flex:1, height:"4px", borderRadius:"4px", background: i <= score ? colors[score] : "#e2e6f0", transition:"background 0.2s ease" }} />
                        ))}
                      </div>
                      <span style={{ fontSize:"11px", color:colors[score], fontWeight:600 }}>{labels[score]}</span>
                    </div>
                  );
                })()}
                <div style={{ marginTop:"4px", display:"flex", flexDirection:"column", gap:"2px" }}>
                  {[
                    { label: "At least 8 characters", met: form.password.length >= 8 },
                    { label: "One uppercase letter",  met: /[A-Z]/.test(form.password) },
                    { label: "One number",            met: /[0-9]/.test(form.password) },
                  ].map(({ label, met }) => (
                    <span key={label} style={{ fontSize:"11px", display:"flex", alignItems:"center", gap:"5px", color: met ? "#22c55e" : "#9ca3af" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                        {met ? <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/> : <circle cx="12" cy="12" r="10"/>}
                      </svg>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`login-field ${errors.confirmPassword ? "has-error" : ""}`}>
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handle} placeholder="••••••••" />
                {errors.confirmPassword
                  ? <span className="login-error">{errors.confirmPassword}</span>
                  : form.confirmPassword && form.password === form.confirmPassword
                    ? <span style={{ fontSize:"11px", color:"#22c55e", display:"flex", alignItems:"center", gap:"5px" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Passwords match
                      </span>
                    : null
                }
              </div>
              <div className="adm-modal-actions" style={{ marginTop:"8px" }}>
                <button type="button" className="adm-modal-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="adm-modal-confirm">
                  <Check size={14} /> {modal.type === "add" ? "Add OIC" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal?.type === "delete" && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon adm-modal-icon-red">
              <Trash2 size={22} />
            </div>
            <h3>Remove OIC</h3>
            <p>Are you sure you want to remove <strong>{modal.oic.name}</strong>? This cannot be undone.</p>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={closeModal}>Cancel</button>
              <button className="adm-modal-confirm adm-modal-confirm-red"
                onClick={() => { deleteOIC(modal.oic.id); closeModal(); }}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {modal?.type === "reset" && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth:"420px" }}>
            <div className="adm-modal-icon" style={{ background:"#fffdf5" }}>
              <KeyRound size={22} style={{ color:"#a8843a" }} />
            </div>
            <h3>Reset Password</h3>
            <p style={{ fontSize:"13px", color:"#6b7494", marginBottom:"4px" }}>
              Set a new password for <strong>{modal.oic.name}</strong> · {modal.oic.department}.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"#f0f4ff", border:"1px solid #dde6f7", borderRadius:"8px", padding:"8px 12px", marginBottom:"16px", fontSize:"12px", color:"#1d4ed8" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Inform the OIC of their new password after resetting.
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const errs = {};
              if (!resetForm.password.trim()) { errs.password = "Password is required."; }
              else if (resetForm.password.length < 8) { errs.password = "At least 8 characters."; }
              else if (!/[A-Z]/.test(resetForm.password)) { errs.password = "Must contain one uppercase letter."; }
              else if (!/[0-9]/.test(resetForm.password)) { errs.password = "Must contain one number."; }
              if (!resetForm.confirmPassword.trim()) { errs.confirmPassword = "Please confirm the password."; }
              else if (resetForm.password !== resetForm.confirmPassword) { errs.confirmPassword = "Passwords do not match."; }
              if (Object.keys(errs).length) { setResetErrors(errs); return; }
              setModal({ type: "confirmReset", oic: modal.oic, password: resetForm.password });
            }}
            style={{ display:"flex", flexDirection:"column", gap:"12px", width:"100%" }}>
              <div className={`login-field ${resetErrors.password ? "has-error" : ""}`}>
                <label>New Password</label>
                <input type="password" placeholder="••••••••" value={resetForm.password}
                  onChange={e => { setResetForm(f => ({ ...f, password: e.target.value })); setResetErrors(er => ({ ...er, password:"" })); }} />
                {resetErrors.password && <span className="login-error">{resetErrors.password}</span>}
                {resetForm.password && (() => {
                  const score =
                    (resetForm.password.length >= 8 ? 1 : 0) +
                    (/[A-Z]/.test(resetForm.password) ? 1 : 0) +
                    (/[0-9]/.test(resetForm.password) ? 1 : 0) +
                    (/[^A-Za-z0-9]/.test(resetForm.password) ? 1 : 0);
                  const labels = ["","Weak","Fair","Good","Strong"];
                  const colors = ["","#ef4444","#f59e0b","#3b82f6","#22c55e"];
                  return (
                    <div style={{ marginTop:"6px" }}>
                      <div style={{ display:"flex", gap:"4px", marginBottom:"4px" }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{ flex:1, height:"4px", borderRadius:"4px", background: i <= score ? colors[score] : "#e2e6f0", transition:"background 0.2s ease" }} />
                        ))}
                      </div>
                      <span style={{ fontSize:"11px", color:colors[score], fontWeight:600 }}>{labels[score]}</span>
                    </div>
                  );
                })()}
                <div style={{ marginTop:"4px", display:"flex", flexDirection:"column", gap:"2px" }}>
                  {[
                    { label:"At least 8 characters", met: resetForm.password.length >= 8 },
                    { label:"One uppercase letter",  met: /[A-Z]/.test(resetForm.password) },
                    { label:"One number",            met: /[0-9]/.test(resetForm.password) },
                  ].map(({ label, met }) => (
                    <span key={label} style={{ fontSize:"11px", display:"flex", alignItems:"center", gap:"5px", color: met ? "#22c55e" : "#9ca3af" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                        {met ? <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/> : <circle cx="12" cy="12" r="10"/>}
                      </svg>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`login-field ${resetErrors.confirmPassword ? "has-error" : ""}`}>
                <label>Confirm New Password</label>
                <input type="password" placeholder="••••••••" value={resetForm.confirmPassword}
                  onChange={e => { setResetForm(f => ({ ...f, confirmPassword: e.target.value })); setResetErrors(er => ({ ...er, confirmPassword:"" })); }} />
                {resetErrors.confirmPassword
                  ? <span className="login-error">{resetErrors.confirmPassword}</span>
                  : resetForm.confirmPassword && resetForm.password === resetForm.confirmPassword
                    ? <span style={{ fontSize:"11px", color:"#22c55e", display:"flex", alignItems:"center", gap:"5px" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Passwords match
                      </span>
                    : null
                }
              </div>
              <div className="adm-modal-actions" style={{ marginTop:"8px" }}>
                <button type="button" className="adm-modal-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="adm-modal-confirm" style={{ background:"linear-gradient(135deg,#a8843a,#c4a350)" }}>
                  <KeyRound size={14} /> Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Add Modal */}
      {modal?.type === "confirm" && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon" style={{ background:"#e8f5e9" }}>
              <Shield size={22} style={{ color:"#15803d" }} />
            </div>
            <h3>Confirm New OIC</h3>
            <p style={{ fontSize:"13px", color:"#6b7494", marginBottom:"16px" }}>
              Please review the details before creating this account.
            </p>
            <div style={{ width:"100%", background:"#f8faff", border:"1.5px solid #e2e6f0", borderRadius:"10px", padding:"14px 16px", display:"flex", flexDirection:"column", gap:"10px", marginBottom:"20px" }}>
              {[
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label:"Full Name",  value: modal.data.name },
                { icon: <Shield size={14} />,                                                                                                                                                                                                                                                    label:"Department", value: modal.data.department },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,                                                                         label:"Username",   value: modal.data.username },
                { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,                                                                         label:"Password",   value: "••••••••" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ color:"#8892b0", flexShrink:0 }}>{icon}</span>
                  <span style={{ fontSize:"12px", color:"#8892b0", minWidth:"80px", flexShrink:0 }}>{label}</span>
                  <span style={{ fontSize:"13px", fontWeight:700, color:"#0b1d45", fontFamily: label === "Username" || label === "Password" ? "monospace" : "Inter, sans-serif" }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setModal({ type:"add" })}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="15 18 9 12 15 6"/></svg>
                Go Back
              </button>
              <button className="adm-modal-confirm" style={{ background:"linear-gradient(135deg,#15803d,#16a34a)" }}
                onClick={() => { addOIC(modal.data); closeModal(); }}>
                <Check size={14} /> Create Account
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Confirm Reset Modal */}
      {modal?.type === "confirmReset" && (
        <div className="adm-modal-backdrop" onClick={closeModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon" style={{ background: "#fffdf5" }}>
              <KeyRound size={22} style={{ color: "#a8843a" }} />
            </div>
            <h3>Confirm Password Reset</h3>
            <p style={{ fontSize: "13px", color: "#6b7494", marginBottom: "16px" }}>
              Are you sure you want to reset the password for <strong>{modal.oic.name}</strong> · {modal.oic.department}?
            </p>
            <div style={{ width: "100%", background: "#fffdf5", border: "1.5px solid #fde68a", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", fontSize: "12px", color: "#92400e" }}>
              <KeyRound size={14} style={{ flexShrink: 0 }} />
              Remember to inform the OIC of their new password after resetting.
            </div>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setModal({ type: "reset", oic: modal.oic })}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="15 18 9 12 15 6"/></svg>
                Go Back
              </button>
              <button
                className="adm-modal-confirm"
                style={{ background: "linear-gradient(135deg,#a8843a,#c4a350)" }}
                onClick={() => { updateOIC(modal.oic.id, { password: modal.password }); closeModal(); }}
              >
                <KeyRound size={14} /> Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ── OIC Row Card ── */
function OICRow({ oic, onReset }) {
  const { interns: realInterns } = useApp();
const MOCK_INTERNS_ROW = [
  { id: 1, name: "Maria Santos",    department: "IT",             status: "active" },
  { id: 2, name: "Jose Reyes",      department: "Transmitter",    status: "active" },
  { id: 3, name: "Ana Dela Cruz",   department: "Studio",         status: "active" },
  { id: 4, name: "Carlo Mendoza",   department: "TOC",            status: "active" },
  { id: 5, name: "Nina Villanueva", department: "Uplink",         status: "active" },
  { id: 6, name: "Ramon Garcia",    department: "TV Maintenance", status: "active" },
];
const interns = realInterns.length > 0 ? realInterns : MOCK_INTERNS_ROW;
  const deptInterns = interns.filter(i => i.department === oic.department && i.status === "active");
  return (
    <div className="adm-oic-card">
      <div className="adm-oic-card-top">
        <div className="adm-oic-card-avatar">{oic.name.charAt(0).toUpperCase()}</div>
        <div className="adm-oic-card-info">
          <p className="adm-oic-card-name">{oic.name}</p>
          <span className="adm-oic-card-dept"><Shield size={10} /> {oic.department}</span>
        </div>
      </div>
      <div className="adm-oic-card-divider" />
      <div className="adm-oic-card-meta">
        <div className="adm-oic-card-meta-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Username:</span>
          <span className="adm-oic-card-meta-val">{oic.username}</span>
        </div>
        <div className="adm-oic-card-meta-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>Active interns:</span>
          <span className="adm-oic-card-interns">{deptInterns.length} intern{deptInterns.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="adm-oic-card-divider" />
      <button className="adm-oic-card-reset-btn" onClick={() => onReset(oic)}>
        <KeyRound size={13} /> Reset Password
      </button>
    </div>
  );
}
