import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ptvLogo from "/src/assets/ptv-logo.png";
import "./AdminDash.css";
import {
  LayoutDashboard, Users, CalendarCheck, ClipboardList,
  LogOut, Menu, Shield, Moon, Sun,
} from "lucide-react";
import { useApp } from "./AppContext";
import AdminOverview from "./AdminOverview";
import AdminInterns from "./AdminInterns";
import AdminAttendance from "./AdminAttendance";
import AdminReports from "./AdminReports";
import AdminOIC from "./AdminOIC";
import OICRemarks from "./OICRemarks";

export default function AdminDash() {
  const navigate = useNavigate();
  const { interns, oics: realOics, activeOIC, setActiveOIC } = useApp();

const MOCK_OICS = [
  { id: 101, name: "Ricky Galeza",      department: "Transmitter",    username: "oic_transmitter", password: "Ptv@1234" },
  { id: 102, name: "Darius Dela Cruz",  department: "TV Maintenance", username: "oic_tvmaint",     password: "Ptv@1234" },
  { id: 103, name: "Joselito Tanggol",  department: "Uplink",         username: "oic_uplink",      password: "Ptv@1234" },
  { id: 104, name: "Narciso Rodriguez", department: "TOC",            username: "oic_toc",         password: "Ptv@1234" },
  { id: 105, name: "Aljune Urrutia",    department: "Studio",         username: "oic_studio",      password: "Ptv@1234" },
  { id: 106, name: "Cyril Collao",      department: "IT",             username: "oic_it",          password: "Ptv@1234" },
];

const oics = realOics.length > 0 ? realOics : MOCK_OICS;

  const [activeTab, setActiveTab]     = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode]       = useState(false);
  const [modal, setModal]             = useState(null);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [oicLogin, setOicLogin] = useState({ username: "", password: "", error: "" });
  const [switchTarget, setSwitchTarget] = useState(null);
  const [confirmBackToAdmin, setConfirmBackToAdmin] = useState(false);
const [oicTabLocked, setOicTabLocked] = useState(true);
const [oicPasswordModal, setOicPasswordModal] = useState(false);
const [oicPasswordInput, setOicPasswordInput] = useState("");
const [oicPasswordError, setOicPasswordError] = useState("");
  const adminNavItems = [
    { key: "overview",    Icon: LayoutDashboard, label: "Overview"   },
    { key: "interns",     Icon: Users,           label: "Interns"    },
    { key: "attendance",  Icon: CalendarCheck,   label: "Attendance" },
    { key: "reports",     Icon: ClipboardList,   label: "Reports"    },
    { key: "oic",         Icon: Shield,          label: "OIC Management" },
  ];

  const oicNavItems = [
  { key: "overview", Icon: LayoutDashboard, label: "Overview" },
  { key: "reports",  Icon: ClipboardList,   label: "Reports"  },
  { key: "remarks",  Icon: ClipboardList,   label: "Remarks"  },
];

  const navItems = activeOIC ? oicNavItems : adminNavItems;

  const activeInterns  = interns.filter(i => i.status === "active").length;
  const pendingInterns = interns.filter(i => i.status === "pending").length;

  return (
    <div className={`adm-root${darkMode ? " adm-dark" : ""}`}>

      {/* SIDEBAR */}
      <aside className={`adm-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="adm-sidebar-brand">
          <img src={ptvLogo} alt="PTV" className="adm-logo-img" />
          <div className="adm-brand-text">
            <span className="adm-brand-main">Admin Portal</span>
            <span className="adm-brand-sub">IMS v1.0</span>
          </div>
        </div>

        <div className="adm-admin-card"
          onClick={() => { setProfileDropdown(v => !v); setOicLogin({ username: "", password: "", error: "" }); }}
          style={{cursor:"pointer", position:"relative"}}>
          <div className="adm-admin-avatar" style={activeOIC ? {background:"linear-gradient(135deg,#a8843a,#c4a350)"} : {}}>
            {activeOIC
              ? <span style={{fontSize:"13px",fontWeight:"800",color:"#fff"}}>{activeOIC.name.charAt(0).toUpperCase()}</span>
              : <Shield size={18} />}
          </div>
          <div className="adm-admin-info">
            <p className="adm-admin-name">{activeOIC ? activeOIC.name : "Administrator"}</p>
            <p className="adm-admin-role">{activeOIC ? `OIC · ${activeOIC.department}` : "PTV · IMS Admin"}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{marginLeft:"auto",color:"rgba(255,255,255,0.5)",flexShrink:0}}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>

</div>

        <nav className="adm-nav">
          <span className="adm-nav-section-label">MENU</span>
          {navItems.map(({ key, Icon, label }) => (
            <button
              key={key}
              className={`adm-nav-item ${activeTab === key ? "active" : ""}`}
              onClick={() => {
                if (key === "oic" && oicTabLocked) {
                  setOicPasswordModal(true);
                  setOicPasswordInput("");
                  setOicPasswordError("");
                } else {
                  if (activeTab === "oic" && key !== "oic") setOicTabLocked(true);
                  setActiveTab(key);
                  setSidebarOpen(false);
                }
              }}
            >
              <Icon size={16} className="adm-nav-icon" />
              <span className="adm-nav-label">{label}</span>
              {key === "interns" && pendingInterns > 0 && (
                <span className="adm-nav-badge">{pendingInterns}</span>
              )}
              {activeTab === key && <span className="adm-nav-pip" />}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-sidebar-stats">
            <div className="adm-sidebar-stat">
              <span className="adm-sidebar-stat-val">{activeInterns}</span>
              <span className="adm-sidebar-stat-label">Active</span>
            </div>
            <div className="adm-sidebar-stat-div" />
            <div className="adm-sidebar-stat">
              <span className="adm-sidebar-stat-val">{pendingInterns}</span>
              <span className="adm-sidebar-stat-label">Pending</span>
            </div>
            <div className="adm-sidebar-stat-div" />
            <div className="adm-sidebar-stat">
              <span className="adm-sidebar-stat-val">{interns.length}</span>
              <span className="adm-sidebar-stat-label">Total</span>
            </div>
          </div>
          <button
            className="adm-logout-btn"
            onClick={() => setModal({ type: "signOut" })}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-hamburger" onClick={() => setSidebarOpen(v => !v)}>
            <Menu size={20} />
          </button>
          <div className="adm-topbar-title">
            {navItems.find(n => n.key === activeTab)?.label}
          </div>
          <div className="adm-topbar-right">
            <span className="adm-topbar-date">
              {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
            <button className="adm-theme-toggle" onClick={() => setDarkMode(v => !v)}>
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <div className="adm-content">
          {/* OIC Banner */}
          {activeOIC && (
            <div className="adm-oic-banner">
              <Shield size={14} />
              Viewing as OIC: <strong>{activeOIC.name}</strong> · {activeOIC.department} Department
              <button className="adm-oic-banner-back" onClick={() => setConfirmBackToAdmin(true)}>
                ← Back to Admin
              </button>
            </div>
          )}

          {activeTab === "overview"   && <AdminOverview   darkMode={darkMode} setActiveTab={setActiveTab} activeOIC={activeOIC} />}
          {activeTab === "interns"    && !activeOIC && <AdminInterns    darkMode={darkMode} />}
          {activeTab === "attendance" && !activeOIC && <AdminAttendance darkMode={darkMode} />}
          {activeTab === "reports"    && <AdminReports    darkMode={darkMode} activeOIC={activeOIC} />}
          {activeTab === "oic"     && !activeOIC && <AdminOIC     darkMode={darkMode} />}
          {activeTab === "remarks" &&  activeOIC && <OICRemarks   darkMode={darkMode} activeOIC={activeOIC} />}
        </div>
      </div>{/* end adm-main */}

      {sidebarOpen && (
        <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* PROFILE DROPDOWN — fixed outside sidebar to avoid clipping */}
      {profileDropdown && (
        <>
          <div
            style={{position:"fixed",inset:0,zIndex:9998}}
            onClick={() => setProfileDropdown(false)}
          />
          <div
            className="adm-profile-dropdown"
            onClick={e => e.stopPropagation()}
            style={{ position:"fixed", top:"130px", left:"12px", zIndex:9999, width:"236px" }}
          >
            {activeOIC ? (
              <>
                <div className="adm-profile-dropdown-header">
                  <p className="adm-profile-dropdown-label">Viewing as OIC</p>
                  <p className="adm-profile-dropdown-name">{activeOIC.name}</p>
                  <p className="adm-profile-dropdown-dept">{activeOIC.department}</p>
                </div>
                <div className="adm-profile-dropdown-divider"/>
                <button
                  className="adm-profile-dropdown-item adm-profile-dropdown-back"
                  onClick={() => { setProfileDropdown(false); setConfirmBackToAdmin(true); }}
                >
                  <Shield size={13}/> Back to Admin View
                </button>
              </>
            ) : (
              <>
                <div className="adm-profile-dropdown-header">
                  <p className="adm-profile-dropdown-label">Switch to OIC Account</p>
                </div>
                <div className="adm-switcher-oic-list">
                  {oics.map(o => (
                    <button
                      key={o.id}
                      className="adm-switcher-oic-row"
                      onClick={() => {
                        setSwitchTarget(o);
                        setOicLogin({ username: o.username, password: "", error: "" });
                        setProfileDropdown(false);
                      }}
                    >
                      <div className="adm-switcher-oic-avatar">{o.name.charAt(0)}</div>
                      <div>
                        <p className="adm-switcher-oic-name">{o.name}</p>
                        <p className="adm-switcher-oic-dept">{o.department}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* OIC PASSWORD MODAL */}
      {switchTarget && (
        <div className="adm-modal-backdrop" onClick={() => { setSwitchTarget(null); setOicLogin({ username: "", password: "", error: "" }); }}>
          <div className="adm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "380px" }}>
            <div className="adm-modal-icon" style={{ background: "#f0f4ff" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#0b1d45,#1a2f6b)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px", fontWeight: 800 }}>
                {switchTarget.name.charAt(0)}
              </div>
            </div>
            <h3 style={{ marginTop: "4px" }}>{switchTarget.name}</h3>
            <p style={{ fontSize: "13px", color: "#6b7494", marginBottom: "4px" }}>
              {switchTarget.department} Department
            </p>
            <p style={{ fontSize: "13px", color: "#6b7494", marginBottom: "20px" }}>
              Enter password to switch to this OIC account.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              <div className="login-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oicLogin.password}
                  autoFocus
                  onChange={e => setOicLogin(v => ({ ...v, password: e.target.value, error: "" }))}
                  onKeyDown={e => {
                    if (e.key !== "Enter") return;
                    const matched = oics.find(o => o.username === switchTarget.username && o.password === oicLogin.password);
                    if (!matched) { setOicLogin(v => ({ ...v, error: "Incorrect password. Try again." })); return; }
                    setActiveOIC(matched);
                    setActiveTab("overview");
                    setSwitchTarget(null);
                    setOicLogin({ username: "", password: "", error: "" });
                  }}
                />
                {oicLogin.error && (
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: "8px", padding: "9px 12px", marginTop: "4px" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9b2226" strokeWidth="2" width="14" height="14" style={{flexShrink:0}}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span style={{ fontSize: "12px", color: "#9b2226", fontWeight: 600 }}>{oicLogin.error}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="adm-modal-actions" style={{ marginTop: "20px" }}>
              <button className="adm-modal-cancel" onClick={() => { setSwitchTarget(null); setOicLogin({ username: "", password: "", error: "" }); }}>
                Cancel
              </button>
              <button className="adm-modal-confirm" onClick={() => {
                const matched = oics.find(o => o.username === switchTarget.username && o.password === oicLogin.password);
                if (!matched) { setOicLogin(v => ({ ...v, error: "Incorrect password. Try again." })); return; }
                setActiveOIC(matched);
                setActiveTab("overview");
                setSwitchTarget(null);
                setOicLogin({ username: "", password: "", error: "" });
              }}>
                <Shield size={14} /> Switch Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM BACK TO ADMIN MODAL */}
      {confirmBackToAdmin && (
        <div className="adm-modal-backdrop" onClick={() => setConfirmBackToAdmin(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon" style={{ background: "#f0f4ff" }}>
              <Shield size={22} style={{ color: "#0b1d45" }} />
            </div>
            <h3>Switch Back to Admin?</h3>
            <p style={{ fontSize: "13px", color: "#6b7494" }}>
              You are currently viewing as <strong>{activeOIC?.name}</strong> · {activeOIC?.department}. Are you sure you want to return to the Admin view?
            </p>
            <div className="adm-modal-actions" style={{ marginTop: "20px" }}>
              <button className="adm-modal-cancel" onClick={() => setConfirmBackToAdmin(false)}>
                Cancel
              </button>
              <button className="adm-modal-confirm" onClick={() => { setActiveOIC(null); setActiveTab("overview"); setConfirmBackToAdmin(false); }}>
                <Shield size={14} /> Yes, Back to Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OIC TAB PASSWORD MODAL */}
      {oicPasswordModal && (
        <div className="adm-modal-backdrop" onClick={() => setOicPasswordModal(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "380px" }}>
            <div className="adm-modal-icon" style={{ background: "#e8f0fe" }}>
              <Shield size={22} style={{ color: "#0b1d45" }} />
            </div>
            <h3>Admin Verification</h3>
            <p style={{ fontSize: "13px", color: "#6b7494", marginBottom: "20px" }}>
              Enter the admin password to access OIC Management.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              <div className="login-field">
                <label>Admin Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oicPasswordInput}
                  autoFocus
                  onChange={e => { setOicPasswordInput(e.target.value); setOicPasswordError(""); }}
                  onKeyDown={e => {
                    if (e.key !== "Enter") return;
                    if (oicPasswordInput === "AdminOnly") {
                      setOicTabLocked(false);
                      setOicPasswordModal(false);
                      setActiveTab("oic");
                      setSidebarOpen(false);
                    } else {
                      setOicPasswordError("Incorrect password. Try again.");
                    }
                  }}
                />
                {oicPasswordError && (
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: "8px", padding: "9px 12px", marginTop: "4px" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9b2226" strokeWidth="2" width="14" height="14" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span style={{ fontSize: "12px", color: "#9b2226", fontWeight: 600 }}>{oicPasswordError}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="adm-modal-actions" style={{ marginTop: "20px" }}>
              <button className="adm-modal-cancel" onClick={() => setOicPasswordModal(false)}>Cancel</button>
              <button className="adm-modal-confirm" onClick={() => {
                if (oicPasswordInput === "AdminOnly") {
                  setOicTabLocked(false);
                  setOicPasswordModal(false);
                  setActiveTab("oic");
                  setSidebarOpen(false);
                } else {
                  setOicPasswordError("Incorrect password. Try again.");
                }
              }}>
                <Shield size={14} /> Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGN OUT MODAL */}
      {modal?.type === "signOut" && (        <div className="adm-modal-backdrop" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-icon adm-modal-icon-red">
              <LogOut size={22} />
            </div>
            <h3>Sign Out</h3>
            <p>Are you sure you want to sign out of the admin portal?</p>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button
                className="adm-modal-confirm adm-modal-confirm-red"
                onClick={() => { setModal(null); navigate("/"); }}
              >
                <LogOut size={14} /> Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}