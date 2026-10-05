import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Activity,
  History,
} from "lucide-react";

function Sidebar() {
  const getNavClass = ({ isActive }) =>
    isActive
      ? "sidebar-link active"
      : "sidebar-link";

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <ShieldLogo />
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className={getNavClass}
          end
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/analyze"
          className={getNavClass}
        >
          <Activity size={20} />
          <span>Analyze Traffic</span>
        </NavLink>

        <NavLink
          to="/history"
          className={getNavClass}
        >
          <History size={20} />
          <span>History</span>
        </NavLink>

      </nav>

    </aside>
  );
}

function ShieldLogo() {
  return (
    <div className="shield-logo">
      🛡
    </div>
  );
}

export default Sidebar;