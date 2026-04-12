import { useState } from "react";
import { useApp } from "./AppContext";
import "./AdminOIC.css";

const RATING_OPTS = ["", "Needs Improvement", "Satisfactory", "Good", "Very Good", "Excellent"];

function emptyRemarkForm() {
  return {
    rating: 0,
    attitude: "",
    attendance: "",
    technical: "",
    comments: "",
    status: "draft",
    date: new Date().toISOString().split("T")[0],
  };
}

export default function OICRemarks({ darkMode, activeOIC }) {
  const { interns: realInterns } = useApp();
const MOCK_INTERNS = [
  { id: 1, name: "Maria Santos",    school: "UP Diliman",       department: "IT",             status: "active" },
  { id: 2, name: "Jose Reyes",      school: "DLSU Manila",      department: "Transmitter",    status: "active" },
  { id: 3, name: "Ana Dela Cruz",   school: "Ateneo de Manila", department: "Studio",         status: "active" },
  { id: 4, name: "Carlo Mendoza",   school: "PLM Manila",       department: "TOC",            status: "active" },
  { id: 5, name: "Nina Villanueva", school: "FEU Manila",       department: "Uplink",         status: "active" },
  { id: 6, name: "Ramon Garcia",    school: "TUP Manila",       department: "TV Maintenance", status: "active" },
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
  const [remarks,     setRemarks]     = useState({});
  const [remarkModal, setRemarkModal] = useState(null);
  const [form,        setForm]        = useState(emptyRemarkForm());
  const [submitted,     setSubmitted]     = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  if (!activeOIC) return null;

  const deptInterns = interns.filter(
    i => i.department === activeOIC?.department && i.status === "active"
  );

  const getRemarks = (internId) => remarks[internId] ?? null;

  const openRemark = (intern) => {
    const existing = getRemarks(intern.id);
    setForm(existing ? { ...existing } : emptyRemarkForm());
    setRemarkModal(intern);
    setSubmitted(false);
  };

  const saveRemark = (status) => {
    const finalForm = { ...form, status, date: new Date().toISOString().split("T")[0] };
    setRemarks(r => ({ ...r, [remarkModal.id]: finalForm }));
    if (status === "submitted") setSubmitted(true);
    else setRemarkModal(null);
  };

  const StarRating = ({ value, onChange }) => (
    <div className="adm-rmk-stars">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          className={`adm-rmk-star ${s <= value ? "filled" : ""}`}
          onClick={() => onChange(s)}>★</button>
      ))}
      <span className="adm-rmk-star-label">
        {["","Poor","Fair","Good","Very Good","Excellent"][value] ?? ""}
      </span>
    </div>
  );

  return (
    <div className="adm-rmk-wrap">

      {/* Header */}
      <div className="adm-oic-header">
        <div className="adm-oic-header-text">
          <h2 className="adm-oic-title">Intern Remarks</h2>
          <p className="adm-oic-sub">
            <span className="adm-oic-sub-dot" />
            {activeOIC.department} Department · {deptInterns.length} active intern{deptInterns.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Intern cards */}
      {deptInterns.length === 0 ? (
        <div className="adm-oic-empty">
          <div className="adm-oic-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <p>No active interns in {activeOIC.department} department.</p>
          <span>Interns will appear here once approved.</span>
        </div>
      ) : (
        <div className="adm-rmk-intern-grid">
          {deptInterns.map(intern => {
            const rec = getRemarks(intern.id);
            return (
              <div key={intern.id} className="adm-rmk-intern-card">
                <div className="adm-rmk-intern-top">
                  <div className="adm-rmk-intern-avatar">
                    {intern.name?.charAt(0).toUpperCase() ?? "I"}
                  </div>
                  <div className="adm-rmk-intern-info">
                    <p className="adm-rmk-intern-name">{intern.name}</p>
                    <span className="adm-rmk-intern-school">{intern.school ?? "—"}</span>
                  </div>
                </div>

                {rec ? (
                  <div className="adm-rmk-summary">
                    <div className="adm-rmk-summary-stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`adm-rmk-summary-star ${s <= rec.rating ? "filled" : ""}`}>★</span>
                      ))}
                      <span className="adm-rmk-summary-rating">{RATING_OPTS[rec.rating]}</span>
                    </div>
                    <div className="adm-rmk-summary-row">
                      <span className="adm-rmk-summary-meta">Attitude: <strong>{rec.attitude || "—"}</strong></span>
                      <span className="adm-rmk-summary-meta">Attendance: <strong>{rec.attendance || "—"}</strong></span>
                      <span className="adm-rmk-summary-meta">Technical: <strong>{rec.technical || "—"}</strong></span>
                    </div>
                    {rec.comments && (
                      <p className="adm-rmk-summary-comment">"{rec.comments}"</p>
                    )}
                    <div className="adm-rmk-summary-footer">
                      <span className={`adm-rmk-status-badge ${rec.status}`}>
                        {rec.status === "submitted" ? "✓ Submitted" : "⊙ Draft"}
                      </span>
                      <span className="adm-rmk-summary-date">{rec.date}</span>
                    </div>
                  </div>
                ) : (
                  <span className="adm-rmk-no-remark">No remarks yet</span>
                )}

                <button className="adm-rmk-btn" onClick={() => openRemark(intern)}>
                  {rec ? "Edit Remarks" : "Give Remarks"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Remark Modal */}
      {remarkModal && (
        <div className="adm-modal-backdrop" onClick={() => setRemarkModal(null)}>
          <div className="adm-rmk-modal" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="adm-rmk-success">
                <div className="adm-rmk-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="28" height="28">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>Remarks Submitted!</h4>
                <p>Remarks for <strong>{remarkModal.name}</strong> have been submitted successfully.</p>
                <button className="adm-rmk-modal-submit" onClick={() => setRemarkModal(null)}>Done</button>
              </div>
            ) : (
              <>
                <div className="adm-rmk-modal-header">
                  <div>
                    <h3>Intern Remarks</h3>
                    <p>{remarkModal.name} · {activeOIC.department}</p>
                  </div>
                  <button className="ids-modal-close" onClick={() => setRemarkModal(null)}>✕</button>
                </div>

                <div className="adm-rmk-modal-body">
                  <div className="adm-rmk-field">
                    <label>Overall Performance Rating</label>
                    <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                  </div>
                  <div className="adm-rmk-field">
                    <label>Attitude & Behavior</label>
                    <select value={form.attitude}
                      onChange={e => setForm(f => ({ ...f, attitude: e.target.value }))}
                      className="adm-rmk-select">
                      <option value="">Select rating</option>
                      {RATING_OPTS.slice(1).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="adm-rmk-field">
                    <label>Attendance & Punctuality</label>
                    <select value={form.attendance}
                      onChange={e => setForm(f => ({ ...f, attendance: e.target.value }))}
                      className="adm-rmk-select">
                      <option value="">Select rating</option>
                      {RATING_OPTS.slice(1).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="adm-rmk-field">
                    <label>Technical / Work Skills</label>
                    <select value={form.technical}
                      onChange={e => setForm(f => ({ ...f, technical: e.target.value }))}
                      className="adm-rmk-select">
                      <option value="">Select rating</option>
                      {RATING_OPTS.slice(1).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="adm-rmk-field">
                    <label>Overall Comments & Remarks</label>
                    <textarea rows={4} value={form.comments}
                      onChange={e => setForm(f => ({ ...f, comments: e.target.value }))}
                      placeholder="Write your remarks about this intern's performance, strengths, areas for improvement..."
                      className="adm-rmk-textarea" />
                  </div>
                  <div className="adm-rmk-field">
                    <label>Date</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="adm-rmk-input" />
                  </div>
                </div>

                <div className="adm-rmk-modal-actions">
                  <button className="adm-modal-cancel" onClick={() => setRemarkModal(null)}>Cancel</button>
                  <button className="adm-rmk-modal-draft" onClick={() => saveRemark("draft")}>Save Draft</button>
                  <button className="adm-rmk-modal-submit" onClick={() => setConfirmSubmit(true)}>Submit Remarks</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirm Submit Modal */}
      {confirmSubmit && remarkModal && (
        <div className="adm-modal-backdrop" onClick={() => setConfirmSubmit(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon" style={{ background: "#e8f5e9" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" width="22" height="22">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Submit Remarks</h3>
            <p style={{ fontSize: "13px", color: "#6b7494", marginBottom: "8px" }}>
              Are you sure you want to submit remarks for <strong>{remarkModal.name}</strong>?
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "9px 12px", fontSize: "12px", color: "#92400e" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" width="14" height="14" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Once submitted, remarks cannot be edited.
            </div>
            <div className="adm-modal-actions" style={{ marginTop: "20px" }}>
              <button className="adm-modal-cancel" onClick={() => setConfirmSubmit(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Go Back
              </button>
              <button
                className="adm-modal-confirm"
                style={{ background: "linear-gradient(135deg,#15803d,#16a34a)", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}
                onClick={() => { setConfirmSubmit(false); saveRemark("submitted"); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="13" height="13">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}