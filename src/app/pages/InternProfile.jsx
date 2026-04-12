import { useRef, useState } from "react";
import { User, Camera, Pencil, CheckCircle } from "lucide-react";
import "./InternProfile.css";

export default function ProfileTab({
  intern, editMode, setEditMode, editForm, setEditForm, saveProfile,
}) {
  const photoInputRef = useRef();
  const [confirmSave, setConfirmSave] = useState(false);

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
              <button className="ids-btn-save" onClick={() => setConfirmSave(true)}>Save Changes</button>
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
              ].map(({ label, key }) => (
                <div key={key} className="ids-field">
                  <label>{label}</label>
                  <input value={editForm[key]}
                    onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="ids-field">
                <label>Course / Program</label>
                <select value={editForm.course} onChange={e => setEditForm(p => ({ ...p, course: e.target.value }))}>
                  <option value="">-- Select a Course --</option>

                  <optgroup label="Business & Management">
                    <option>BS Accountancy</option>
                    <option>BS Accounting Information Systems</option>
                    <option>BS Business Administration</option>
                    <option>BS Business Administration major in Financial Management</option>
                    <option>BS Business Administration major in Human Resource Management</option>
                    <option>BS Business Administration major in Marketing Management</option>
                    <option>BS Business Administration major in Operations Management</option>
                    <option>BS Entrepreneurship</option>
                    <option>BS Office Administration</option>
                    <option>BS Public Administration</option>
                  </optgroup>

                  <optgroup label="Engineering & Technology">
                    <option>BS Architecture</option>
                    <option>BS Chemical Engineering</option>
                    <option>BS Civil Engineering</option>
                    <option>BS Computer Engineering</option>
                    <option>BS Electrical Engineering</option>
                    <option>BS Electronics Engineering</option>
                    <option>BS Environmental Engineering</option>
                    <option>BS Geodetic Engineering</option>
                    <option>BS Industrial Engineering</option>
                    <option>BS Mechanical Engineering</option>
                    <option>BS Mechatronics Engineering</option>
                    <option>BS Mining Engineering</option>
                    <option>BS Petroleum Engineering</option>
                    <option>BS Sanitary Engineering</option>
                  </optgroup>

                  <optgroup label="Information Technology & Computing">
                    <option>BS Computer Science</option>
                    <option>BS Information Systems</option>
                    <option>BS Information Technology</option>
                    <option>BS Data Science</option>
                    <option>BS Cybersecurity</option>
                    <option>BS Software Engineering</option>
                    <option>Associate in Computer Technology</option>
                  </optgroup>

                  <optgroup label="Communication & Media">
                    <option>AB Communication</option>
                    <option>AB Journalism</option>
                    <option>AB Broadcasting</option>
                    <option>AB Film</option>
                    <option>AB Media Studies</option>
                    <option>BS Communication Research</option>
                    <option>BS Digital Media Arts</option>
                    <option>BS Multimedia Arts</option>
                  </optgroup>

                  <optgroup label="Social Sciences & Humanities">
                    <option>AB Economics</option>
                    <option>AB History</option>
                    <option>AB Philosophy</option>
                    <option>AB Political Science</option>
                    <option>AB Psychology</option>
                    <option>AB Sociology</option>
                    <option>AB Anthropology</option>
                    <option>AB Literature</option>
                    <option>AB Linguistics</option>
                    <option>AB International Studies</option>
                    <option>BS Psychology</option>
                    <option>BS Social Work</option>
                  </optgroup>

                  <optgroup label="Education">
                    <option>Bachelor of Elementary Education</option>
                    <option>Bachelor of Secondary Education major in English</option>
                    <option>Bachelor of Secondary Education major in Filipino</option>
                    <option>Bachelor of Secondary Education major in Mathematics</option>
                    <option>Bachelor of Secondary Education major in Science</option>
                    <option>Bachelor of Secondary Education major in Social Studies</option>
                    <option>Bachelor of Special Needs Education</option>
                    <option>Bachelor of Physical Education</option>
                    <option>Bachelor of Early Childhood Education</option>
                    <option>Bachelor of Technology and Livelihood Education</option>
                    <option>Bachelor of Technical-Vocational Teacher Education</option>
                  </optgroup>

                  <optgroup label="Health & Medicine">
                    <option>BS Biology</option>
                    <option>BS Biochemistry</option>
                    <option>BS Dentistry</option>
                    <option>BS Medicine</option>
                    <option>BS Medical Technology</option>
                    <option>BS Midwifery</option>
                    <option>BS Nursing</option>
                    <option>BS Nutrition and Dietetics</option>
                    <option>BS Occupational Therapy</option>
                    <option>BS Pharmacy</option>
                    <option>BS Physical Therapy</option>
                    <option>BS Radiologic Technology</option>
                    <option>BS Respiratory Therapy</option>
                    <option>BS Speech-Language Pathology</option>
                  </optgroup>

                  <optgroup label="Science">
                    <option>BS Applied Mathematics</option>
                    <option>BS Applied Physics</option>
                    <option>BS Astronomy</option>
                    <option>BS Chemistry</option>
                    <option>BS Environmental Science</option>
                    <option>BS Forestry</option>
                    <option>BS Geology</option>
                    <option>BS Marine Biology</option>
                    <option>BS Mathematics</option>
                    <option>BS Meteorology</option>
                    <option>BS Physics</option>
                    <option>BS Statistics</option>
                    <option>BS Zoology</option>
                  </optgroup>

                  <optgroup label="Agriculture & Fisheries">
                    <option>BS Agriculture</option>
                    <option>BS Agricultural Engineering</option>
                    <option>BS Agribusiness</option>
                    <option>BS Agricultural Technology</option>
                    <option>BS Fisheries</option>
                    <option>BS Food Technology</option>
                    <option>BS Horticulture</option>
                    <option>BS Veterinary Medicine</option>
                  </optgroup>

                  <optgroup label="Hospitality & Tourism">
                    <option>BS Hospitality Management</option>
                    <option>BS Hotel and Restaurant Management</option>
                    <option>BS Tourism Management</option>
                    <option>BS Culinary Arts</option>
                  </optgroup>

                  <optgroup label="Law & Criminology">
                    <option>BS Criminology</option>
                    <option>Bachelor of Laws (LLB)</option>
                    <option>Juris Doctor</option>
                  </optgroup>

                  <optgroup label="Fine Arts & Design">
                    <option>BS Fine Arts</option>
                    <option>BS Graphic Design</option>
                    <option>BS Industrial Design</option>
                    <option>BS Interior Design</option>
                    <option>BS Fashion Design and Merchandising</option>
                  </optgroup>

                  <optgroup label="Others">
                    <option>AB Development Communication</option>
                    <option>BS Library and Information Science</option>
                    <option>BS Military Science</option>
                    <option>BS Physical Education and Sports Science</option>
                    <option>BS Real Estate Management</option>
                    <option value="Other / Not Listed">Other / Not Listed</option>
                  </optgroup>
                </select>
                {editForm.course === "Other / Not Listed" && (
                  <input
                    type="text"
                    style={{ marginTop: "8px" }}
                    placeholder="Please type your course/program"
                    value={editForm.customCourse || ""}
                    onChange={e => setEditForm(p => ({ ...p, customCourse: e.target.value }))}
                  />
                )}
              </div>
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
                { label: "Course", val: intern.course === "Other / Not Listed" ? intern.customCourse : intern.course },
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
    {confirmSave && (
        <div className="ids-modal-overlay">
          <div className="ids-modal-card">
            <div className="ids-modal-icon">
              <CheckCircle size={40} strokeWidth={1.5} />
            </div>
            <h3 className="ids-modal-title">Save Changes</h3>
            <p className="ids-modal-desc">Are you sure you want to save your profile changes?</p>
            <div className="ids-modal-actions">
              <button className="ids-modal-btn-cancel" onClick={() => setConfirmSave(false)}>Cancel</button>
              <button className="ids-modal-btn-confirm" onClick={() => { saveProfile(); setConfirmSave(false); }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}