import { useState } from "react";
import { useApp } from "./AppContext";
import "./AdminReports.css";
import { FileText, MessageSquare, Download, Send, X, CheckCircle, XCircle } from "lucide-react";

const TYPE_CONFIG = {
  daily:    { cls: "adm-rep-type-daily",    label: "DTR"      },
  weekly:   { cls: "adm-rep-type-weekly",   label: "WEEKLY"   },
  monthly:  { cls: "adm-rep-type-monthly",  label: "MONTHLY"  },
  incident: { cls: "adm-rep-type-incident", label: "INCIDENT" },
  other:    { cls: "adm-rep-type-other",    label: "OTHER"    },
};

export default function AdminReports() {
  const { interns, getInternReports, addAdminComment, setReportStatus } = useApp();

  const [selectedInternId, setSelectedInternId] = useState(interns[0]?.id ?? null);
  const [viewModal,  setViewModal]  = useState(null);
  const [newComment, setNewComment] = useState("");
  const [filter,     setFilter]     = useState("all");

  const selectedIntern = interns.find(i => i.id === selectedInternId);
  const reports = selectedInternId ? getInternReports(selectedInternId) : [];

  const filtered = reports.filter(r => {
    if (filter === "all")      return true;
    if (filter === "pending")  return !r.status || r.status === "pending";
    if (filter === "approved") return r.status === "approved";
    return true;
  });

  const sendComment = () => {
    if (!newComment.trim() || !viewModal) return;
    addAdminComment(selectedInternId, viewModal.id, newComment.trim());
    // Refresh the modal with updated report
    const updated = getInternReports(selectedInternId).find(r => r.id === viewModal.id);
    setViewModal(prev => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        {
          role: "admin",
          text: newComment.trim(),
          time: new Date().toLocaleString("en-PH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
        },
      ],
    }));
    setNewComment("");
  };

  return (
    <div className="adm-tab-reports">

      {/* Intern Selector */}
      <div className="adm-panel adm-rep-selector">
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
        <div className="adm-panel">
          <div className="adm-rep-table-header">
            <h3 className="adm-panel-title" style={{ marginBottom: 0 }}>
              Reports — {selectedIntern.name}
            </h3>
            <div style={{ display: "flex", gap: "6px" }}>
              {["all", "pending", "approved"].map(f => (
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
            <div className="adm-empty-state">
              <FileText size={28} />
              <p>No reports found.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="adm-rep-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Files</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="adm-att-date-cell">
                          <span>{new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                          <span className="adm-att-dow">{new Date(r.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "short" })}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`adm-rep-type-badge ${TYPE_CONFIG[r.type]?.cls ?? ""}`}>
                          {TYPE_CONFIG[r.type]?.label ?? r.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="adm-rep-desc">
                        {r.description
                          ? r.description.length > 60 ? r.description.slice(0, 60) + "…" : r.description
                          : <span style={{ color: "var(--adm-text-sm)" }}>—</span>}
                      </td>
                      <td>
                        {r.files?.length > 0 ? (
                          <div className="adm-rep-file-tags">
                            {r.files.map((f, i) => (
                              <span
                                key={i}
                                className="adm-rep-file-tag"
                                onClick={() => f.url && window.open(f.url, "_blank")}
                              >
                                <FileText size={10} /> {f.name}
                              </span>
                            ))}
                          </div>
                        ) : <span style={{ color: "var(--adm-text-sm)", fontSize: "12px" }}>—</span>}
                      </td>
                      <td>
                        <span className={`adm-rep-status-badge adm-rep-status-${r.status ?? "pending"}`}>
                          {r.status ?? "Pending"}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--adm-text-muted)", whiteSpace: "nowrap" }}>
                        {r.submittedAt}
                      </td>
                      <td>
                        <button
                          className="adm-btn adm-btn-ghost"
                          style={{ fontSize: "11px", padding: "5px 12px", whiteSpace: "nowrap" }}
                          onClick={() => { setViewModal(r); setNewComment(""); }}
                        >
                          <MessageSquare size={11} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View / Comment Modal */}
      {viewModal && (
        <div className="adm-modal-backdrop" onClick={() => setViewModal(null)}>
          <div className="adm-rep-modal adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-rep-modal-header">
              <div>
                <h3 style={{ textAlign: "left" }}>Report Details</h3>
                <p style={{ textAlign: "left", marginBottom: 0, fontSize: "13px" }}>
                  {selectedIntern?.name} ·{" "}
                  {new Date(viewModal.date + "T00:00:00").toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
                  {" "}·{" "}
                  <span className={`adm-rep-type-badge ${TYPE_CONFIG[viewModal.type]?.cls ?? ""}`}>
                    {TYPE_CONFIG[viewModal.type]?.label ?? viewModal.type}
                  </span>
                </p>
              </div>
              <button className="adm-modal-close-btn" onClick={() => setViewModal(null)}><X size={18} /></button>
            </div>

            {/* Description */}
            {viewModal.description && (
              <div className="adm-rep-modal-desc">
                <p className="adm-rep-modal-desc-label">Description</p>
                <p className="adm-rep-modal-desc-text">{viewModal.description}</p>
              </div>
            )}

            {/* Files */}
            {viewModal.files?.length > 0 && (
              <div className="adm-rep-modal-files">
                <p className="adm-rep-modal-desc-label">Attached Files</p>
                <div className="adm-rep-file-tags">
                  {viewModal.files.map((f, i) => (
                    <span
                      key={i}
                      className="adm-rep-file-tag"
                      onClick={() => f.url && window.open(f.url, "_blank")}
                    >
                      <FileText size={11} /> {f.name}
                      {f.url && <span className="adm-rep-file-view"> · Download</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status Actions */}
            <div className="adm-rep-status-actions">
              <span style={{ fontSize: "12px", color: "var(--adm-text-muted)", fontWeight: 600 }}>Status:</span>
              <span className={`adm-rep-status-badge adm-rep-status-${viewModal.status ?? "pending"}`}>
                {viewModal.status ?? "Pending"}
              </span>
              <button
                className="adm-btn adm-btn-ghost"
                style={{ fontSize: "12px", padding: "5px 12px", marginLeft: "auto" }}
                onClick={() => {
                  const newStatus = viewModal.status === "approved" ? "pending" : "approved";
                  setReportStatus(selectedInternId, viewModal.id, newStatus);
                  setViewModal(prev => ({ ...prev, status: newStatus }));
                }}
              >
                {viewModal.status === "approved"
                  ? <><XCircle size={12} /> Unapprove</>
                  : <><CheckCircle size={12} /> Approve</>}
              </button>
            </div>

            {/* Comments */}
            <div className="adm-rep-comments">
              <p className="adm-rep-modal-desc-label">Comments</p>
              {(!viewModal.comments || viewModal.comments.length === 0) ? (
                <p className="adm-rep-comments-empty">No comments yet. Leave a note below.</p>
              ) : (
                <div className="adm-rep-comments-list">
                  {viewModal.comments.map((c, i) => (
                    <div key={i} className={`adm-rep-comment ${c.role === "admin" ? "adm-rep-comment-admin" : "adm-rep-comment-intern"}`}>
                      <div className="adm-rep-comment-meta">
                        <span className="adm-rep-comment-author">{c.role === "admin" ? "You (Admin)" : selectedIntern?.name}</span>
                        <span className="adm-rep-comment-time">{c.time}</span>
                      </div>
                      <p className="adm-rep-comment-text">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="adm-rep-comment-input-row">
                <input
                  type="text"
                  className="adm-rep-comment-input"
                  placeholder="Leave a comment for the intern..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendComment(); }}
                />
                <button
                  className="adm-btn adm-btn-primary"
                  style={{ padding: "9px 16px", borderRadius: "20px" }}
                  disabled={!newComment.trim()}
                  onClick={sendComment}
                >
                  <Send size={13} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}