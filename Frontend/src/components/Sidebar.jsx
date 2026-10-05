import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  History,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/" className="sidebar-link">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/analyze" className="sidebar-link">
          <Activity size={20} />
          <span>Analyze</span>
        </NavLink>

        <NavLink to="/history" className="sidebar-link">
          <History size={20} />
          <span>History</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;