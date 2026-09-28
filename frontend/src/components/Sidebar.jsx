import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">
          <Logo />
        </span>
        <div>
          <p className="brand-name">Ledger</p>
          <p className="brand-sub">class records</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/overview" className="nav-item">
          Overview
        </NavLink>
        <NavLink to="/dashboard" className="nav-item">
          Dashboard
        </NavLink>
        {(user.role === "admin" || user.role === "teacher") && (
          <NavLink to="/students" className="nav-item">
            Students
          </NavLink>
        )}
        <NavLink to="/courses" className="nav-item">
          Courses
        </NavLink>
        <NavLink to="/attendance" className="nav-item">
          Attendance
        </NavLink>
        <NavLink to="/reports" className="nav-item">
          Reports
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p className="user-name">{user.name}</p>
        <p className="user-role">{user.role}</p>
        <button className="btn-link" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
