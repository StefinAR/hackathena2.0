import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Analyze from "./pages/Analyze";
import History from "./pages/History";

import { DetectionProvider } from "./context/DetectionProvider";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <DetectionProvider>
        <div className="app-layout">
          <Sidebar />

          <div className="main-area">
            <Navbar />

            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </main>
          </div>
        </div>
      </DetectionProvider>
    </BrowserRouter>
  );
}

export default App;