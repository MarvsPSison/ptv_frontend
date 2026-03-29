import { useRef } from "react";
import { User, Camera, Pencil } from "lucide-react";
import "./InternProfile.css";

export default function ProfileTab({
  intern, editMode, setEditMode, editForm, setEditForm, saveProfile,
}) {
  const photoInputRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditForm(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
  };

  const hasProfile = intern.name.trim() !== "";

  return (
    <div className="ids-tab-profile">

      <div className="ids-profile-hero">
        <div className="ids-profile-photo-wrap">
          <div className="ids-profile-photo">
            {(editMode ? editForm.photo : intern.photo)
              ? <img src={editMode ? editForm.photo : intern.photo} alt="Profile" />
              : <User size={32} />}
          </div>
          {editMode && (
            <>
              <button className="ids-change-photo-btn" onClick={() => photoInputRef.current.click()}>
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
          {intern.department && <span className="ids-dept-tag">{intern.department}</span>}
        </div>

        <div className="ids-profile-actions">
          {editMode ? (
            <>
              <button className="ids-btn-save" onClick={saveProfile}>Save Changes</button>
              <button className="ids-btn-cancel" onClick={() => { setEditMode(false); setEditForm({ ...intern }); }}>Cancel</button>
            </>
          ) : (
            <button className="ids-btn-edit" onClick={() => { setEditMode(true); setEditForm({ ...intern }); }}>
              <Pencil size={13} /> {hasProfile ? "Edit Profile" : "Set Up Profile"}
            </button>
          )}
        </div>
      </div>

      <div className="ids-profile-grid">

        {/* Personal Info */}
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
              <div className="ids-info-row"><span>Email</span><strong>{intern.email || "—"}</strong></div>
              <div className="ids-info-row"><span>Phone</span><strong>{intern.phone || "—"}</strong></div>
              <div className="ids-info-row"><span>Address</span><strong>{intern.address || "—"}</strong></div>
            </div>
          )}
        </div>

        {/* Academic & Placement */}
        <div className="ids-panel">
          <h3 className="ids-panel-title">Academic & Placement</h3>
          {editMode ? (
            <div className="ids-edit-fields">
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
              {[
                { label: "Department",     key: "department",    type: "select" },
                { label: "Supervisor",     key: "supervisor",    type: "text"   },
                { label: "Start Date",     key: "startDate",     type: "date"   },
                { label: "End Date",       key: "endDate",       type: "date"   },
                { label: "Required Hours", key: "requiredHours", type: "number" },
              ].map(({ label, key, type }) => {
                const isAdminField = key === "department" || key === "supervisor";
                return (
                  <div key={key} className="ids-field">
                    <label className={isAdminField ? "ids-field-label-locked" : ""}>
                      {label}
                      {isAdminField && <span className="ids-field-admin-tag">Admin only</span>}
                    </label>
                    {isAdminField ? (
                      <div className="ids-field-locked">
                        <span>{editForm[key] || "—"}</span>
                        <span className="ids-field-locked-icon">🔒</span>
                      </div>
                    ) : type === "select" ? (
                      <select value={editForm[key]}
                        onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}>
                      </select>
                    ) : (
                      <input
                        type={type}
                        value={editForm[key]}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        min={key === "endDate" && editForm.startDate ? editForm.startDate : undefined}
                        onChange={e => {
                          const val = e.target.value;
                          if (key === "endDate" && editForm.startDate && val < editForm.startDate) return;
                          setEditForm(p => ({ ...p, [key]: val }));
                        }} />
                    )}
                  </div>
                );
              })}
              {editForm.startDate && editForm.endDate && editForm.requiredHours && (() => {
                const start = new Date(editForm.startDate);
                const end   = new Date(editForm.endDate);
                const weekdays = Array.from(
                  { length: Math.round((end - start) / 86400000) + 1 },
                  (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d.getDay(); }
                ).filter(d => d !== 0 && d !== 6).length;
                const hrsPerDay = weekdays > 0 ? (Number(editForm.requiredHours) / weekdays).toFixed(1) : 0;
                return (
                  <div style={{ marginTop: "8px" }}>
                    <div className="ids-info-row"><span>Working Days</span><strong>{weekdays} days</strong></div>
                    <div className="ids-info-row"><span>Hrs / Day Needed</span><strong>{Math.ceil(hrsPerDay)} hrs</strong></div>
                    <div className="ids-info-row"><span>Total Required</span><strong>{editForm.requiredHours} hrs</strong></div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="ids-info-list">
              {[
                { label: "School",         val: intern.school },
                { label: "Course",         val: intern.course },
                { label: "Department",     val: intern.department },
                { label: "Supervisor",     val: intern.supervisor },
                { label: "Start Date",     val: intern.startDate },
                { label: "End Date",       val: intern.endDate },
                { label: "Required Hours", val: intern.requiredHours ? `${intern.requiredHours} hrs` : "" },
              ].map(({ label, val }) => (
                <div key={label} className="ids-info-row">
                  <span>{label}</span><strong>{val || "—"}</strong>
                </div>
              ))}
              {intern.startDate && intern.endDate && intern.requiredHours && (() => {
                const start = new Date(intern.startDate);
                const end   = new Date(intern.endDate);
                const weekdays = Array.from(
                  { length: Math.round((end - start) / 86400000) + 1 },
                  (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d.getDay(); }
                ).filter(d => d !== 0 && d !== 6).length;
                const hrsPerDay = weekdays > 0 ? (Number(intern.requiredHours) / weekdays).toFixed(1) : 0;
                return (
                  <div style={{ marginTop: "8px" }}>
                    <div className="ids-info-row"><span>Working Days</span><strong>{weekdays} days</strong></div>
                    <div className="ids-info-row"><span>Hrs / Day Needed</span><strong>{Math.ceil(hrsPerDay)} hrs</strong></div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}