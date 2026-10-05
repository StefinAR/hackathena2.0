import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FileUpload from "../components/FileUpload";
import AnalysisStatus from "../components/AnalysisStatus";
import ResultCard from "../components/ResultCard";

function Analyze() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(null);

  const handleStartAnalysis = () => {
    if (!selectedFile) {
      return;
    }

    setStatus("analyzing");

    // Temporary UI test.
    // Backend connection will be added later.
    setTimeout(() => {
      setStatus("completed");
    }, 2000);
  };

  return (
    <div className="app">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <div className="page-header">
            <h1>Analyze Network Traffic</h1>

            <p>
              Upload a network capture file to detect
              potential DoS attacks.
            </p>
          </div>

          <FileUpload
            onFileSelect={(file) => {
              setSelectedFile(file);
              setStatus(null);
            }}
          />

          {selectedFile && (
            <div className="analysis-action">
              <button
                className="primary-button"
                onClick={handleStartAnalysis}
                disabled={status === "analyzing"}
              >
                {status === "analyzing"
                  ? "Analyzing..."
                  : "Start Analysis"}
              </button>
            </div>
          )}

          <AnalysisStatus status={status} />
          {status === "completed" && (
  <ResultCard
    prediction="DoS Attack"
    confidence={94}
    packetsAnalyzed={12540}
    requestRate={1250}
  />
)}
        </main>
      </div>
    </div>
  );
}

export default Analyze;