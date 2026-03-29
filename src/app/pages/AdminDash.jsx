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

export default function AdminDash() {
  const navigate = useNavigate();
  const { interns, getRenderedHours } = useApp();

  const [activeTab, setActiveTab]   = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode]     = useState(false);
  const [modal, setModal]           = useState(null);

  const navItems = [
    { key: "overview",    Icon: LayoutDashboard, label: "Overview"    },
    { key: "interns",     Icon: Users,           label: "Interns"     },
    { key: "attendance",  Icon: CalendarCheck,   label: "Attendance"  },
    { key: "reports",     Icon: ClipboardList,   label: "Reports"     },
  ];

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

        <div className="adm-admin-card">
          <div className="adm-admin-avatar">
            <Shield size={18} />
          </div>
          <div className="adm-admin-info">
            <p className="adm-admin-name">Administrator</p>
            <p className="adm-admin-role">PTV · IMS Admin</p>
          </div>
        </div>

        <nav className="adm-nav">
          <span className="adm-nav-section-label">MENU</span>
          {navItems.map(({ key, Icon, label }) => (
            <button
              key={key}
              className={`adm-nav-item ${activeTab === key ? "active" : ""}`}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
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
          {activeTab === "overview"   && <AdminOverview   darkMode={darkMode} setActiveTab={setActiveTab} />}
          {activeTab === "interns"    && <AdminInterns    darkMode={darkMode} />}
          {activeTab === "attendance" && <AdminAttendance darkMode={darkMode} />}
          {activeTab === "reports"    && <AdminReports    darkMode={darkMode} />}
        </div>
      </div>

      {sidebarOpen && (
        <div className="adm-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIGN OUT MODAL */}
      {modal?.type === "signOut" && (
        <div className="adm-modal-backdrop" onClick={() => setModal(null)}>
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