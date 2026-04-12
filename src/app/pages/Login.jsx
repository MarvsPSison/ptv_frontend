import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  // Current view: "portal" | "intern" | "admin"
  const [view, setView] = useState("portal");

  // Sign in form
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Registration modal
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [regForm, setRegForm] = useState({
    fullName: "", course: "", school: "", address: "", guardianContact: "", internPhone: "",
    regEmail: "", verificationCode: "",
  });
  const [regErrors, setRegErrors] = useState({});
  const [regSuccess, setRegSuccess] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState("");

  // Handle sign in field changes
  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handle registration field changes
  const handleReg = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
    setRegErrors({ ...regErrors, [e.target.name]: "" });
  };

  // Validate sign in fields
  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = "Email is required.";
    if (!form.password.trim()) e.password = "Password is required.";
    return e;
  };

  // Validate registration step 1 fields
  const validateStep1 = () => {
    const e = {};
    if (!regForm.fullName.trim())        e.fullName        = "Full name is required.";
    if (!regForm.course.trim())          e.course          = "Course is required.";
    if (!regForm.school.trim())          e.school          = "School is required.";
    if (!regForm.address.trim())         e.address         = "Address is required.";
    if (!regForm.guardianContact.trim()) e.guardianContact = "Guardian contact is required.";
    if (!regForm.internPhone.trim())     e.internPhone     = "Phone number is required.";
    return e;
  };

  // Validate registration step 2 fields
  const validateStep2 = () => {
    const e = {};
    if (!regForm.regEmail.trim())         e.regEmail         = "Email is required.";
    if (!regForm.verificationCode.trim()) e.verificationCode = "Verification code is required.";
    return e;
  };

  // Sign in → route to intern dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    navigate("/intern-dash");
  };

// Step 0 → proceed to step 1 (require consent checkbox)
const handleConsentNext = (e) => {
  e.preventDefault();
  if (!consentChecked) {
    setConsentError("You must agree to the Privacy Policy and Data Consent to proceed.");
    return;
  }
  setConsentError("");
  setModalStep(1);
};

  // Step 1 → proceed to step 2
  const handleStep1Next = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return; }
    setModalStep(2);
  };

  // Send verification code to email (TODO: connect to backend)
  const handleSendCode = () => {
    if (!regForm.regEmail.trim()) {
      setRegErrors({ ...regErrors, regEmail: "Please enter your email first." });
      return;
    }
    setCodeSent(true);
  };

  // Step 2 → complete registration
  const handleStep2Submit = (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) { setRegErrors(errs); return; }
    setRegSuccess(true);
  };

  // Close and reset modal
 const closeModal = () => {
  setShowModal(false);
  setModalStep(0);
  setRegForm({
    fullName: "", course: "", school: "", address: "", guardianContact: "", internPhone: "",
    regEmail: "", verificationCode: "",
  });
  setRegErrors({});
  setRegSuccess(false);
  setCodeSent(false);
  setConsentChecked(false);
  setConsentError("");
};

  return (
    <div className="login-wrapper">

      {/* ── LEFT: Branding panel ── */}
      <div className="login-left">
        <div className="left-overlay" />
        <div className="left-content">
          <img
            src="https://tse1.explicit.bing.net/th/id/OIP.RWCD2dvArfs-tDB_6C5DfgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="PTV Logo"
            className="left-logo"
          />
          <h1 className="left-title">People's Television Network, Inc.</h1>
          <p className="left-sub">Intern Monitoring System</p>
        </div>
      </div>

      {/* ── RIGHT: Auth panel ── */}
      <div className="login-right">
        <div className="right-inner">

          {/* Portal — role selection */}
          {view === "portal" && (
            <div className="panel-fade">
              <h2 className="right-title"><span>PTV</span> Portal</h2>
              <p className="right-sub">Select your role to sign in</p>

              <div className="role-grid">
                <button className="role-btn intern-btn" onClick={() => setView("intern")}>
                  <div className="role-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="role-text">
                    <span className="role-name">INTERN</span>
                  </div>
                </button>

                <button className="role-btn admin-btn" onClick={() => setView("admin")}>
                  <div className="role-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="role-text">
                    <span className="role-name">ADMIN</span>
                  </div>
                </button>
              </div>

              <div className="right-divider" />

              {/* Office info */}
              <div className="right-info">
                <p>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                  Office Hours: Mon – Fri, 8:00 AM – 5:00 PM
                </p>
                <p>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Visayas Ave, Diliman, Quezon City
                </p>
              </div>
            </div>
          )}

          {/* Intern — sign in form */}
          {view === "intern" && (
            <div className="panel-fade">
              <button className="back-link" onClick={() => setView("portal")}>←</button>
              <h2 className="right-title"><span>Intern</span> Sign In</h2>
              <p className="right-sub">Enter your credentials to continue</p>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className={`login-field ${errors.email ? "has-error" : ""}`}>
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handle} placeholder="e.g. juan@email.com" />
                  {errors.email && <span className="login-error">{errors.email}</span>}
                </div>
                <div className={`login-field ${errors.password ? "has-error" : ""}`}>
                  <label>Password</label>
                  <input type="password" name="password" value={form.password} onChange={handle} placeholder="••••••••" />
                  {errors.password && <span className="login-error">{errors.password}</span>}
                </div>
                <button type="submit" className="login-submit-btn">Sign In</button>
              </form>

              <div className="right-divider" style={{ marginTop: "24px" }} />

              {/* Link to registration modal */}
              <div className="signup-row">
                <span>New Intern? </span>
                <button className="signup-link" onClick={() => setShowModal(true)}>
                  Create an Account
                </button>
              </div>
            </div>
          )}

          {/* Admin — sign in form → routes to AdminLog */}
          {view === "admin" && (
            <div className="panel-fade">
              <button className="back-link" onClick={() => setView("portal")}>←</button>
              <h2 className="right-title"><span>Admin</span> Sign In</h2>
              <p className="right-sub">Enter your admin credentials</p>

              <form className="login-form" onSubmit={(e) => { e.preventDefault(); navigate("/admin-log"); }}>
                <div className="login-field">
                  <label>Username</label>
                  <input type="text" placeholder="Admin username" />
                </div>
                <div className="login-field">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <button type="submit" className="login-submit-btn admin-submit">Sign In →</button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ── REGISTRATION MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Create an Account</h3>
                <p className="modal-sub">
                  {modalStep === 0 && "Please read and accept our Privacy Policy."}
                  {modalStep === 1 && "Fill in your personal details."}
                  {modalStep === 2 && "Verify your email address."}
                </p>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {/* Step progress indicator */}
            {!regSuccess && (
                <div className="modal-steps">
                  <div className={`modal-step ${modalStep >= 0 ? "active" : ""}`}>
                    <div className="step-dot">1</div>
                    <span>Privacy</span>
                  </div>
                  <div className="step-line" />
                  <div className={`modal-step ${modalStep >= 1 ? "active" : ""}`}>
                    <div className="step-dot">2</div>
                    <span>Personal Info</span>
                  </div>
                  <div className="step-line" />
                  <div className={`modal-step ${modalStep >= 2 ? "active" : ""}`}>
                    <div className="step-dot">3</div>
                    <span>Verification</span>
                  </div>
                </div>
              )}

{/* Step 0 — Data Privacy & Location Consent */}
{!regSuccess && modalStep === 0 && (
  <form className="modal-form" onSubmit={handleConsentNext}>

    {/* Mandatory Notice Banner */}
    <div className="dpcs-mandatory-banner">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{flexShrink:0}}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span><strong>Mandatory Notice:</strong> Location access is required to use Time In/Time Out features. Disabling location services will prevent attendance tracking.</span>
    </div>

    {/* Scrollable Content */}
    <div className="dpcs-scroll-body">

      {/* Section 1: Legal Basis */}
      <div className="dpcs-section">
        <h4 className="dpcs-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{color:"#9B2226",flexShrink:0}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Legal Basis
        </h4>
        <p>In compliance with <strong>Republic Act No. 10173 (Data Privacy Act of 2012)</strong>, this system ensures that all personal data collected is handled lawfully, securely, and transparently.</p>
        <p style={{marginTop:"8px"}}>This attendance system requires the collection and processing of certain personal data, including <strong>real-time location information</strong>, to properly function and maintain accurate attendance records.</p>
      </div>

      {/* Section 2: Location Access */}
      <div className="dpcs-section">
        <h4 className="dpcs-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{color:"#9B2226",flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Location Access Requirements
        </h4>
        <ul className="dpcs-list">
          <li>Location access is <strong>required and mandatory</strong> to use the Time In and Time Out features.</li>
          <li>You <strong>will not be able to Time In or Time Out</strong> if location services are turned off, disabled, or denied in your device settings.</li>
          <li>Location data will be recorded <strong>only during official office hours</strong>, including approved work-from-home or remote work arrangements.</li>
          <li>Location data is <strong>not tracked continuously</strong>—it is captured only at the moment of clocking in or out.</li>
        </ul>
      </div>

      {/* Section 3: How Data Is Used */}
      <div className="dpcs-section">
        <h4 className="dpcs-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{color:"#9B2226",flexShrink:0}}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> How Your Data Is Used
        </h4>
        <p>The collected location data is used solely for:</p>
        <ul className="dpcs-list dpcs-list-check">
          <li>Attendance verification and validation</li>
          <li>Work-from-home arrangement confirmation</li>
          <li>Compliance with company attendance policies</li>
          <li>Generating accurate attendance reports</li>
        </ul>
      </div>

      {/* Section 4: Data Protection */}
      <div className="dpcs-section">
        <h4 className="dpcs-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{color:"#9B2226",flexShrink:0}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Data Protection &amp; Your Rights
        </h4>
        <p>All collected data will be kept confidential and protected using appropriate technical and organizational security measures, including encryption and access controls.</p>
        <p style={{marginTop:"8px"}}>Data will not be shared with unauthorized third parties and will be retained only for as long as necessary for business and legal purposes.</p>
        <div className="dpcs-rights-box">
          <strong>Your Rights:</strong> Under the Data Privacy Act, you have the right to be informed, access your personal data, request corrections, and file complaints with the National Privacy Commission.
        </div>
      </div>

      {/* Section 5: Consent Acknowledgment */}
      <div className="dpcs-section">
        <h4 className="dpcs-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{color:"#9B2226",flexShrink:0}}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Consent Acknowledgment
        </h4>
        <label className={`dpcs-consent-box ${consentError ? "has-error" : ""} ${consentChecked ? "checked" : ""}`}>
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => {
              setConsentChecked(e.target.checked);
              if (e.target.checked) setConsentError("");
            }}
          />
          <span>
            I confirm that I have <strong style={{color:"#9B2226"}}>read and understood</strong> this notice and voluntarily give my consent to the collection and processing of my location data for attendance purposes. I acknowledge that{" "}
            <strong style={{color:"#9B2226"}}>disabling location access will prevent me from using the Time In and Time Out features</strong> of this system.
          </span>
        </label>
        {consentError && <span className="login-error">{consentError}</span>}
      </div>

    </div>{/* end scroll body */}

    <button
      type="submit"
      className={`dpcs-accept-btn ${consentChecked ? "active" : ""}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" style={{flexShrink:0}}>
        <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
      </svg>
      I Accept &amp; Continue
    </button>

    <p className="dpcs-footer-note">
      ⓘ By accepting, you agree to the terms outlined above. You may withdraw consent at any time by contacting your system administrator.
    </p>

  </form>
)}

            {/* Step 1 — personal information */}
            {!regSuccess && modalStep === 1 && (
              <form className="modal-form" onSubmit={handleStep1Next}>
                <div className={`login-field ${regErrors.fullName ? "has-error" : ""}`}>
                  <label>Full Name</label>
                  <input type="text" name="fullName" value={regForm.fullName} onChange={handleReg} placeholder="e.g. Juan Dela Cruz" />
                  {regErrors.fullName && <span className="login-error">{regErrors.fullName}</span>}
                </div>
                <div className={`login-field ${regErrors.course ? "has-error" : ""}`}>
                  <label>Course</label>
                  <input type="text" name="course" value={regForm.course} onChange={handleReg} placeholder="e.g. BS Communication" />
                  {regErrors.course && <span className="login-error">{regErrors.course}</span>}
                </div>
                <div className={`login-field ${regErrors.school ? "has-error" : ""}`}>
                  <label>School</label>
                  <input type="text" name="school" value={regForm.school} onChange={handleReg} placeholder="e.g. University of the Philippines" />
                  {regErrors.school && <span className="login-error">{regErrors.school}</span>}
                </div>
                <div className={`login-field ${regErrors.address ? "has-error" : ""}`}>
                  <label>Address</label>
                  <textarea name="address" value={regForm.address} onChange={handleReg} placeholder="e.g. 123 Mabini St, Manila" rows={2} />
                  {regErrors.address && <span className="login-error">{regErrors.address}</span>}
                </div>
                <div className={`login-field ${regErrors.internPhone ? "has-error" : ""}`}>
                  <label>Phone Number</label>
                  <input type="tel" name="internPhone" value={regForm.internPhone} onChange={handleReg} placeholder="e.g. 09XX XXX XXXX" />
                  {regErrors.internPhone && <span className="login-error">{regErrors.internPhone}</span>}
                </div>
                <div className={`login-field ${regErrors.guardianContact ? "has-error" : ""}`}>
                  <label>Guardian Contact #</label>
                  <input type="tel" name="guardianContact" value={regForm.guardianContact} onChange={handleReg} placeholder="e.g. 09XX XXX XXXX" />
                  {regErrors.guardianContact && <span className="login-error">{regErrors.guardianContact}</span>}
                </div>
                <button type="submit" className="login-submit-btn" style={{ marginTop: "8px" }}>
                  Next →
                </button>
              </form>
            )}

            {/* Step 2 — email & verification code */}
            {!regSuccess && modalStep === 2 && (
              <form className="modal-form" onSubmit={handleStep2Submit}>
                <div className={`login-field ${regErrors.regEmail ? "has-error" : ""}`}>
                  <label>Email Address</label>
                  <div className="input-with-btn">
                    <input
                      type="email"
                      name="regEmail"
                      value={regForm.regEmail}
                      onChange={handleReg}
                      placeholder="e.g. juan@email.com"
                    />
                    <button
                      type="button"
                      className={`send-code-btn ${codeSent ? "sent" : ""}`}
                      onClick={handleSendCode}
                      disabled={codeSent}
                    >
                      {codeSent ? "Sent ✓" : "Send Code"}
                    </button>
                  </div>
                  {regErrors.regEmail && <span className="login-error">{regErrors.regEmail}</span>}
                </div>
                <div className={`login-field ${regErrors.verificationCode ? "has-error" : ""}`}>
                  <label>Verification Code</label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={regForm.verificationCode}
                    onChange={handleReg}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  {regErrors.verificationCode && <span className="login-error">{regErrors.verificationCode}</span>}
                  {codeSent && <span className="code-hint">Code sent to {regForm.regEmail}</span>}
                </div>
                <div className="modal-step2-actions">
                  <button type="button" className="back-step-btn" onClick={() => setModalStep(1)}>←</button>
                  <button type="submit" className="login-submit-btn" style={{ flex: 1 }}>
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* Success state */}
            {regSuccess && (
              <div className="modal-success">
                <div className="modal-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l3 3 5-5" />
                  </svg>
                </div>
                <h4 className="modal-success-title">Account Created!</h4>
                <p className="modal-success-desc">
                  Welcome, <strong>{regForm.fullName}</strong>! Your account has been registered. You may now sign in.
                </p>
                <button className="login-submit-btn" onClick={closeModal}>
                  Back to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}