import { useState } from "react";
import { useApp } from "./AppContext";
import "./AdminInterns.css";
import { User, CheckCircle, XCircle, Pencil, Save, X, ChevronDown, ChevronUp } from "lucide-react";

const DEPARTMENTS = [
  "News & Current Affairs", "Production", "Digital Media",
  "Engineering", "Finance", "Human Resources", "Marketing", "Legal",
];

export default function AdminInterns() {
  const { interns, approveIntern, adminUpdateIntern } = useApp();
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState("all");

  const filtered = interns.filter(i => {
    if (filter === "all")      return true;
    if (filter === "active")   return i.status === "active";
    if (filter === "pending")  return i.status === "pending";
    return true;
  });

  const startEdit = (intern) => {
    setEditId(intern.id);
    setEditForm({
      department:    intern.department    || "",
      supervisor:    intern.supervisor    || "",
      startDate:     intern.startDate     || "",
      endDate:       intern.endDate       || "",
      requiredHours: intern.requiredHours || "",
    });
  };

  const saveEdit = (internId) => {
    adminUpdateIntern(internId, editForm);
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
                      onClick={() => approveIntern(intern.id)}
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
                        Fields below are admin-assigned. Intern cannot edit these.
                      </p>
                      <div className="adm-int-edit-grid">
                        <div className="adm-field">
                          <label>Department</label>
                          <select
                            value={editForm.department}
                            onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))}
                          >
                            <option value="">— Select —</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="adm-field">
                          <label>Supervisor</label>
                          <input
                            type="text"
                            value={editForm.supervisor}
                            placeholder="e.g. Ms. Reyes"
                            onChange={e => setEditForm(f => ({ ...f, supervisor: e.target.value }))}
                          />
                        </div>
                        <div className="adm-field">
                          <label>Start Date</label>
                          <input
                            type="date"
                            value={editForm.startDate}
                            onChange={e => setEditForm(f => ({ ...f, startDate: e.target.value }))}
                          />
                        </div>
                        <div className="adm-field">
                          <label>End Date</label>
                          <input
                            type="date"
                            value={editForm.endDate}
                            min={editForm.startDate || undefined}
                            onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value }))}
                          />
                        </div>
                        <div className="adm-field">
                          <label>Required Hours</label>
                          <input
                            type="number"
                            value={editForm.requiredHours}
                            placeholder="e.g. 300"
                            onChange={e => setEditForm(f => ({ ...f, requiredHours: e.target.value }))}
                          />
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
                          onClick={() => saveEdit(intern.id)}
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
    </div>
  );
}