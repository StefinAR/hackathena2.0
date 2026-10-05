import { ShieldCheck } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <ShieldCheck size={28} />
        <span>NetShield</span>
      </div>

      <div className="navbar-status">
        <span className="status-dot"></span>
        System Online
      </div>
    </header>
  );
}

export default Navbar;