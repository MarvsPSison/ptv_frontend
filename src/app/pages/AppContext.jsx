import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [interns, setInterns] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ptv_interns")) || []; } catch { return []; }
  });
  const [attendanceMap, setAttendanceMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ptv_attendance")) || {}; } catch { return {}; }
  });
  const [reportsMap, setReportsMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ptv_reports")) || {}; } catch { return {}; }
  });
  const [currentIntern, setCurrentIntern] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ptv_current_intern")) || null; } catch { return null; }
  });
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => { localStorage.setItem("ptv_interns",         JSON.stringify(interns));       }, [interns]);
  useEffect(() => { localStorage.setItem("ptv_attendance",      JSON.stringify(attendanceMap)); }, [attendanceMap]);
  useEffect(() => { localStorage.setItem("ptv_reports",         JSON.stringify(reportsMap));    }, [reportsMap]);
  useEffect(() => { localStorage.setItem("ptv_current_intern",  JSON.stringify(currentIntern)); }, [currentIntern]);

  const registerIntern = (formData) => {
    const newIntern = {
      id: Date.now(),
      name: formData.fullName,
      email: formData.regEmail,
      phone: "",
      address: formData.address,
      school: formData.school,
      course: formData.course,
      guardianContact: formData.guardianContact,
      department: "",
      supervisor: "",
      startDate: "",
      endDate: "",
      requiredHours: "",
      photo: null,
      status: "pending",
      approved: false,
      registeredAt: new Date().toLocaleDateString("en-PH"),
    };
    setInterns(prev => [...prev, newIntern]);
    setAttendanceMap(prev => ({ ...prev, [newIntern.id]: [] }));
    setReportsMap(prev => ({ ...prev, [newIntern.id]: [] }));
    return newIntern;
  };

  const approveIntern = (internId) => {
    setInterns(prev =>
      prev.map(i => i.id === internId ? { ...i, approved: true, status: "active" } : i)
    );
  };

  const adminUpdateIntern = (internId, fields) => {
    setInterns(prev =>
      prev.map(i => i.id === internId ? { ...i, ...fields } : i)
    );
    if (currentIntern?.id === internId) {
      setCurrentIntern(prev => ({ ...prev, ...fields }));
    }
  };

  const internUpdateProfile = (fields) => {
    if (!currentIntern) return;
    const updated = { ...currentIntern, ...fields };
    setCurrentIntern(updated);
    setInterns(prev =>
      prev.map(i => i.id === currentIntern.id ? updated : i)
    );
  };

  const addAttendanceRecord = (internId, record) => {
    setAttendanceMap(prev => ({
      ...prev,
      [internId]: [record, ...(prev[internId] || []).filter(r => r.date !== record.date)]
        .sort((a, b) => b.date.localeCompare(a.date)),
    }));
  };

  const updateAttendanceRecord = (internId, updatedRecord) => {
    setAttendanceMap(prev => ({
      ...prev,
      [internId]: (prev[internId] || [])
        .map(r => r.id === updatedRecord.id ? updatedRecord : r)
        .sort((a, b) => b.date.localeCompare(a.date)),
    }));
  };

  const flagAttendanceRecord = (internId, recordId, flagged, adminNote = "") => {
    setAttendanceMap(prev => ({
      ...prev,
      [internId]: (prev[internId] || []).map(r =>
        r.id === recordId ? { ...r, flagged, adminNote } : r
      ),
    }));
  };

  const addReport = (internId, report) => {
    setReportsMap(prev => ({
      ...prev,
      [internId]: [report, ...(prev[internId] || []).filter(r => r.date !== report.date)]
        .sort((a, b) => b.date.localeCompare(a.date)),
    }));
  };

  const updateReport = (internId, updatedReport) => {
    setReportsMap(prev => ({
      ...prev,
      [internId]: (prev[internId] || [])
        .map(r => r.id === updatedReport.id ? updatedReport : r)
        .sort((a, b) => b.date.localeCompare(a.date)),
    }));
  };

  const removeReport = (internId, reportId) => {
    setReportsMap(prev => ({
      ...prev,
      [internId]: (prev[internId] || []).filter(r => r.id !== reportId),
    }));
  };

  const addAdminComment = (internId, reportId, commentText) => {
    const comment = {
      role: "admin",
      text: commentText,
      time: new Date().toLocaleString("en-PH", {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      }),
    };
    setReportsMap(prev => ({
      ...prev,
      [internId]: (prev[internId] || []).map(r =>
        r.id === reportId
          ? { ...r, comments: [...(r.comments || []), comment] }
          : r
      ),
    }));
  };

  const setReportStatus = (internId, reportId, status) => {
    setReportsMap(prev => ({
      ...prev,
      [internId]: (prev[internId] || []).map(r =>
        r.id === reportId ? { ...r, status } : r
      ),
    }));
  };

  const signInIntern = (email) => {
    const found = interns.find(i => i.email.toLowerCase() === email.toLowerCase());
    if (found && found.approved) {
      setCurrentIntern(found);
      return { success: true, intern: found };
    }
    if (found && !found.approved) return { success: false, reason: "pending" };
    return { success: false, reason: "not_found" };
  };

  const signOutIntern = () => setCurrentIntern(null);
  const signOutAdmin  = () => setCurrentAdmin(null);

  const getInternAttendance = (internId) => attendanceMap[internId] || [];
  const getInternReports    = (internId) => reportsMap[internId]    || [];

  const getRenderedHours = (internId) => {
    const log = attendanceMap[internId] || [];
    return log
      .filter(r => r.timeOut)
      .reduce((acc, r) => {
        return acc + (r.timeOutMs - r.timeInMs - (parseInt(r.breakMins) || 0) * 60000) / 3600000;
      }, 0);
  };

  return (
    <AppContext.Provider value={{
      interns, setInterns,
      currentIntern, setCurrentIntern,
      currentAdmin, setCurrentAdmin,
      attendanceMap, reportsMap,

      registerIntern,
      approveIntern,
      adminUpdateIntern,
      internUpdateProfile,
      signInIntern,
      signOutIntern,
      signOutAdmin,

      addAttendanceRecord,
      updateAttendanceRecord,
      flagAttendanceRecord,

      addReport,
      updateReport,
      removeReport,
      addAdminComment,
      setReportStatus,

      getInternAttendance,
      getInternReports,
      getRenderedHours,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export default AppContext;