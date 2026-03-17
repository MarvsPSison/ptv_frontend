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
  const [modalStep, setModalStep] = useState(1); // Step 1: personal info | Step 2: email verification
  const [regForm, setRegForm] = useState({
    fullName: "", course: "", school: "", address: "", guardianContact: "",
    regEmail: "", verificationCode: "",
  });
  const [regErrors, setRegErrors] = useState({});
  const [regSuccess, setRegSuccess] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

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
    setModalStep(1);
    setRegForm({
      fullName: "", course: "", school: "", address: "", guardianContact: "",
      regEmail: "", verificationCode: "",
    });
    setRegErrors({});
    setRegSuccess(false);
    setCodeSent(false);
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
          <h1 className="left-title">People's Television Network</h1>
          <p className="left-sub">Intern Monitoring System</p>
        </div>
      </div>

      {/* ── RIGHT: Auth panel ── */}
      <div className="login-right">
        <div className="right-inner">

          {/* Portal — role selection */}
          {view === "portal" && (
            <div className="panel-fade">
              <h2 className="right-title"><span>PTV</span> Intern Portal</h2>
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
              <p className="right-footer">© 2025 People's Television Network · IMS v1.0</p>
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
                  {modalStep === 1 ? "Fill in your personal details." : "Verify your email address."}
                </p>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {/* Step progress indicator */}
            {!regSuccess && (
              <div className="modal-steps">
                <div className={`modal-step ${modalStep >= 1 ? "active" : ""}`}>
                  <div className="step-dot">1</div>
                  <span>Personal Info</span>
                </div>
                <div className="step-line" />
                <div className={`modal-step ${modalStep >= 2 ? "active" : ""}`}>
                  <div className="step-dot">2</div>
                  <span>Verification</span>
                </div>
              </div>
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