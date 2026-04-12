import { useState } from "react";
import { useApp } from "./AppContext";
import "./AdminInterns.css";
import { User, CheckCircle, XCircle, Pencil, Save, X, ChevronDown, ChevronUp } from "lucide-react";

const DEPARTMENTS = [
  "Transmitter", "TV Maintenance", "Uplink", "TOC", "Studio", "IT", "OB Van",
];

const DEPT_SUPERVISORS = {
  "Transmitter":    "Ricky Galeza",
  "TV Maintenance": "Darius Dela Cruz",
  "Uplink":         "Joselito Tanggol",
  "TOC":            "Narciso Rodriguez",
  "Studio":         "Aljune Urrutia",
  "IT":             "Cyril Collao",
  "OB Van":         "Lyndon Valderama",
};

export default function AdminInterns() {
  const { interns: realInterns, approveIntern, adminUpdateIntern } = useApp();

const MOCK_INTERNS = [
  { id: 1, name: "Maria Santos",    email: "maria@email.com",  phone: "09171234567", address: "Quezon City",    school: "UP Diliman",       course: "BS Computer Science",         guardianContact: "09181234567", department: "IT",             supervisor: "Cyril Collao",      startDate: "2026-01-06", endDate: "2026-04-30", requiredHours: 486, photo: null, status: "active",  approved: true,  registeredAt: "01/06/2026" },
  { id: 2, name: "Jose Reyes",      email: "jose@email.com",   phone: "09182345678", address: "Makati City",    school: "DLSU Manila",      course: "BS Information Technology",   guardianContact: "09192345678", department: "Transmitter",    supervisor: "Ricky Galeza",      startDate: "2026-01-06", endDate: "2026-04-30", requiredHours: 486, photo: null, status: "active",  approved: true,  registeredAt: "01/06/2026" },
  { id: 3, name: "Ana Dela Cruz",   email: "ana@email.com",    phone: "09193456789", address: "Pasig City",     school: "Ateneo de Manila", course: "BS Electronics Engineering",  guardianContact: "09203456789", department: "Studio",         supervisor: "Aljune Urrutia",    startDate: "2026-01-13", endDate: "2026-05-07", requiredHours: 486, photo: null, status: "active",  approved: true,  registeredAt: "01/13/2026" },
  { id: 4, name: "Carlo Mendoza",   email: "carlo@email.com",  phone: "09204567890", address: "Caloocan City",  school: "PLM Manila",       course: "BS Computer Engineering",     guardianContact: "09214567890", department: "TOC",            supervisor: "Narciso Rodriguez", startDate: "2026-01-13", endDate: "2026-05-07", requiredHours: 486, photo: null, status: "active",  approved: true,  registeredAt: "01/13/2026" },
  { id: 5, name: "Nina Villanueva", email: "nina@email.com",   phone: "09215678901", address: "Mandaluyong",    school: "FEU Manila",       course: "BS Information Systems",      guardianContact: "09225678901", department: "Uplink",         supervisor: "Joselito Tanggol",  startDate: "2026-02-03", endDate: "2026-05-28", requiredHours: 486, photo: null, status: "active",  approved: true,  registeredAt: "02/03/2026" },
  { id: 6, name: "Ramon Garcia",    email: "ramon@email.com",  phone: "09226789012", address: "Marikina City",  school: "TUP Manila",       course: "BS Electronics Technology",   guardianContact: "09236789012", department: "TV Maintenance", supervisor: "Darius Dela Cruz",  startDate: "2026-02-03", endDate: "2026-05-28", requiredHours: 486, photo: null, status: "active",  approved: true,  registeredAt: "02/03/2026" },
  { id: 7, name: "Lea Bautista",    email: "lea@email.com",    phone: "09237890123", address: "Taguig City",    school: "UST Manila",       course: "BS Communication Technology", guardianContact: "09247890123", department: "OB Van",         supervisor: "Lyndon Valderama",  startDate: "2026-02-10", endDate: "2026-06-04", requiredHours: 486, photo: null, status: "pending", approved: false, registeredAt: "02/10/2026" },
  { id: 8, name: "Marco Reyes",     email: "marco@email.com",  phone: "09248901234", address: "Las Piñas City", school: "PUP Manila",       course: "BS Electrical Engineering",   guardianContact: "09258901234", department: "IT",             supervisor: "Cyril Collao",      startDate: "2026-02-10", endDate: "2026-06-04", requiredHours: 486, photo: null, status: "pending", approved: false, registeredAt: "02/10/2026" },
];

const [mockInterns, setMockInterns] = useState(MOCK_INTERNS);
const interns = realInterns.length > 0 ? realInterns : mockInterns;

const handleApprove = (internId) => {
  if (realInterns.length > 0) {
    approveIntern(internId);
  } else {
    setMockInterns(prev =>
      prev.map(i => i.id === internId ? { ...i, approved: true, status: "active" } : i)
    );
  }
};
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState("all");
  const [confirmApprove, setConfirmApprove] = useState(null);
  const [confirmSave,    setConfirmSave]    = useState(null);

  const filtered = interns.filter(i => {
    if (filter === "all")      return true;
    if (filter === "active")   return i.status === "active";
    if (filter === "pending")  return i.status === "pending";
    return true;
  });

  const startEdit = (intern) => {
    setEditId(intern.id);
    setEditForm({
      department: intern.department || "",
      supervisor: intern.supervisor || "",
    });
  };

  const saveEdit = (internId) => {
    if (realInterns.length > 0) {
      adminUpdateIntern(internId, editForm);
    } else {
      setMockInterns(prev =>
        prev.map(i => i.id === internId ? { ...i, ...editForm } : i)
      );
    }
    setEditId(null);
  };

  return (
    <div className="adm-tab-interns">

      {/* Filter */}
      <div className="adm-int-topbar">
        <h2 className="adm-int-title">All Interns</h2>
        <div className="adm-int-filters">
          {["all", "active", "pending"].map(f => (
            <button
              key={f}
              className={`adm-int-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="adm-panel adm-empty-state">
          <User size={32} />
          <p>No interns found.</p>
          <p style={{ fontSize: "12px" }}>Interns appear here once they register.</p>
        </div>
      ) : (
        <div className="adm-int-list">
          {filtered.map(intern => (
            <div key={intern.id} className="adm-panel adm-int-card">

              {/* Card Header */}
              <div className="adm-int-card-header">
                <div className="adm-int-card-left">
                  <div className="adm-ov-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                    {intern.photo
                      ? <img src={intern.photo} alt={intern.name} />
                      : intern.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="adm-int-name">{intern.name}</p>
                    <p className="adm-int-meta">{intern.course} · {intern.school}</p>
                    <p className="adm-int-email">{intern.email}</p>
                  </div>
                </div>
                <div className="adm-int-card-right">
                  <span className={`adm-int-status-badge adm-int-status-${intern.status}`}>
                    {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                  </span>
                  {intern.status === "pending" && (
                    <button
                      className="adm-btn adm-btn-gold"
                      style={{ fontSize: "12px", padding: "6px 14px" }}
                      onClick={() => setConfirmApprove(intern)}
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                  )}
                  {editId !== intern.id && (
                    <button
                      className="adm-btn adm-btn-ghost"
                      style={{ fontSize: "12px", padding: "6px 14px" }}
                      onClick={() => startEdit(intern)}
                    >
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                  <button
                    className="adm-btn adm-btn-ghost"
                    style={{ fontSize: "12px", padding: "6px 10px" }}
                    onClick={() => setExpanded(expanded === intern.id ? null : intern.id)}
                  >
                    {expanded === intern.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === intern.id && (
                <div className="adm-int-card-body">

                  {/* View Mode */}
                  {editId !== intern.id && (
                    <div className="adm-int-info-grid">
                      {[
                        { label: "Department",     val: intern.department    || "—" },
                        { label: "Supervisor",     val: intern.supervisor    || "—" },
                        { label: "Start Date",     val: intern.startDate     || "—" },
                        { label: "End Date",       val: intern.endDate       || "—" },
                        { label: "Required Hours", val: intern.requiredHours ? `${intern.requiredHours} hrs` : "—" },
                        { label: "Phone",          val: intern.phone         || "—" },
                        { label: "Address",        val: intern.address       || "—" },
                        { label: "Guardian Contact", val: intern.guardianContact || "—" },
                      ].map(({ label, val }) => (
                        <div key={label} className="adm-info-row">
                          <span>{label}</span>
                          <strong>{val}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Edit Mode */}
                  {editId === intern.id && (
                    <div className="adm-int-edit-form">
                      <p className="adm-int-edit-hint">
                        Assign the intern to a department. Supervisor is automatically filled based on the selected department.
                      </p>
                      <div className="adm-int-edit-grid">
                        <div className="adm-field">
                          <label>Assign Department</label>
                          <select
                            value={editForm.department}
                            onChange={e => {
                              const dept = e.target.value;
                              setEditForm(f => ({
                                ...f,
                                department: dept,
                                supervisor: DEPT_SUPERVISORS[dept] || "",
                              }));
                            }}
                          >
                            <option value="">— Select Department —</option>
                            {DEPARTMENTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div className="adm-field">
                          <label>Supervisor</label>
                          <div style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            padding: "10px 14px", borderRadius: "8px",
                            border: "1.5px solid #e2e6f0", background: "#f8fafc",
                            fontSize: "13px", color: editForm.supervisor ? "#0b1d45" : "#9ca3af",
                          }}>
                            {editForm.supervisor
                              ? <>
                                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#0b1d45,#1a2f6b)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                    {editForm.supervisor.charAt(0)}
                                  </div>
                                  <span style={{ fontWeight: 600 }}>{editForm.supervisor}</span>
                                </>
                              : <span>— Auto-filled when department is selected —</span>
                            }
                          </div>
                        </div>
                      </div>
                      <div className="adm-int-edit-actions">
                        <button
                          className="adm-btn adm-btn-ghost"
                          onClick={() => setEditId(null)}
                        >
                          <X size={13} /> Cancel
                        </button>
                        <button
                          className="adm-btn adm-btn-primary"
                          onClick={() => setConfirmSave(intern.id)}
                        >
                          <Save size={13} /> Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          ))}
        </div>
      )}
    {/* Confirm Approve Modal */}
      {confirmApprove && (
        <div className="adm-modal-backdrop" onClick={() => setConfirmApprove(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon" style={{ background: "#e8f5e9" }}>
              <CheckCircle size={22} style={{ color: "#15803d" }} />
            </div>
            <h3>Approve Intern</h3>
            <p style={{ fontSize: "13px", color: "#6b7494" }}>
              Are you sure you want to approve <strong>{confirmApprove.name}</strong>? They will be granted active intern status.
            </p>
            <div className="adm-modal-actions" style={{ marginTop: "20px" }}>
              <button className="adm-modal-cancel" onClick={() => setConfirmApprove(null)}>
                <X size={13} /> Cancel
              </button>
              <button
                className="adm-modal-confirm"
                style={{ background: "linear-gradient(135deg,#15803d,#16a34a)", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}
                onClick={() => { handleApprove(confirmApprove.id); setConfirmApprove(null); }}
              >
                <CheckCircle size={13} /> Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Save Modal */}
      {confirmSave && (
        <div className="adm-modal-backdrop" onClick={() => setConfirmSave(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon" style={{ background: "#e8f0fe" }}>
              <Save size={22} style={{ color: "#0b1d45" }} />
            </div>
            <h3>Save Changes</h3>
            <p style={{ fontSize: "13px", color: "#6b7494" }}>
              Are you sure you want to save the changes to this intern's details?
            </p>
            <div className="adm-modal-actions" style={{ marginTop: "20px" }}>
              <button className="adm-modal-cancel" onClick={() => setConfirmSave(null)}>
                <X size={13} /> Cancel
              </button>
              <button
                className="adm-modal-confirm"
                style={{ background: "linear-gradient(135deg,#0b1d45,#1a2f6b)", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}
                onClick={() => { saveEdit(confirmSave); setConfirmSave(null); }}
              >
                <Save size={13} /> Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}