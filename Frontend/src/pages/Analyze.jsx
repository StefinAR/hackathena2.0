import { useState } from "react";
import { useDetections } from "../context/useDetection";

import {
  Upload,
  FileText,
  ShieldCheck,
  X,
} from "lucide-react";

import "../styles/Analyze.css";

function Analyze() {
  const { addDetection } = useDetections();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const allowedExtensions = [
  ".pcap",
  ".pcapng",
  ".csv",
  ".json",
];

const isValidFileType = (file) => {
  const fileName = file.name.toLowerCase();

  return allowedExtensions.some((extension) =>
    fileName.endsWith(extension)
  );
};

  const handleFileChange = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!isValidFileType(file)) {
    setSelectedFile(null);
    setIsAnalyzing(false);

    setResult({
      status: "Invalid File",
      type: "Invalid",
      message:
        "Unsupported file type. Please select a PCAP, PCAPNG, CSV, or JSON file.",
      source: "-",
      destination: "-",
      protocol: "-",
    });

    return;
  }

  setSelectedFile(file);
  setResult(null);
  setIsAnalyzing(false);
};

   
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleAnalyze = () => {
    if (!selectedFile || isAnalyzing) return;

    setIsAnalyzing(true);
    setResult(null);

    // Temporary frontend simulation.
    // Backend API will replace this later.
    setTimeout(() => {
      const resultTypes = [
        "Normal",
        "Normal",
        "Suspicious",
        "Malicious",
      ];

      const detectedType =
        resultTypes[
          Math.floor(Math.random() * resultTypes.length)
        ];

      const source = "192.168.1.50";
      const destination = "10.0.0.20";
      const protocol = "TCP";

      addDetection({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),
        source,
        destination,
        protocol,
        type: detectedType,
      });

      setIsAnalyzing(false);

      setResult({
        status: "Analysis Complete",
        type: detectedType,
        source,
        destination,
        protocol,
        message: `${detectedType} traffic detected during analysis.`,
      });
    }, 1500);
  };

  return (
    <div className="analyze-page">

      <div className="analyze-header">
        <div>
          <h2>Analyze Traffic</h2>

          <p>
            Upload network traffic for security analysis.
          </p>
        </div>
      </div>

      <div className="analyze-card">

        <div className="analyze-card-header">
          <div>
            <h3>Upload Traffic</h3>

            <p>
              Select a network traffic file to analyze.
            </p>
          </div>

          <div className="analyze-icon">
            <Upload size={22} />
          </div>
        </div>

        <label className="upload-area">

          <input
            type="file"
            onChange={handleFileChange}
            accept=".pcap,.pcapng,.csv,.json"
          />

          <Upload size={38} />

          <strong>
            {selectedFile
              ? selectedFile.name
              : "Drop your traffic file here"}
          </strong>

          <span>
            {selectedFile
              ? `${(selectedFile.size / 1024).toFixed(1)} KB`
              : "or click to browse files"}
          </span>

        </label>

        {selectedFile && (
          <div className="selected-file">

            <FileText size={20} />

            <div className="selected-file-info">
              <strong>{selectedFile.name}</strong>

              <span>
                File selected and ready for analysis
              </span>
            </div>

            <button
              type="button"
              className="remove-file"
              onClick={handleRemoveFile}
              aria-label="Remove selected file"
            >
              <X size={18} />
            </button>

          </div>
        )}

        <button
          type="button"
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
        >
          <ShieldCheck size={19} />

          {isAnalyzing
            ? "Analyzing..."
            : "Analyze Traffic"}
        </button>

      </div>

      <div className="result-card">

        <div className="result-header">
          <div>
            <h3>Analysis Result</h3>

            <p>
              Security analysis results will appear here.
            </p>
          </div>
        </div>

        {!result && (
          <div className="empty-result">

            <ShieldCheck size={42} />

            <strong>
              {isAnalyzing
                ? "Analyzing traffic..."
                : "Waiting for analysis"}
            </strong>

            <span>
              {isAnalyzing
                ? "Please wait while the traffic is being analyzed."
                : "Upload a traffic file and start an analysis."}
            </span>

          </div>
        )}

        {result && (
  <div
    className={`analysis-success ${
      result.type === "Invalid"
        ? "invalid"
        : result.type.toLowerCase()
    }`}
  >
            <div className="success-icon">
              <ShieldCheck size={24} />
            </div>

            <div className="analysis-result-content">

              <strong>{result.status}</strong>

              <p>{result.message}</p>

              <div className="analysis-details">

                <div>
                  <span>Type</span>
                  <strong>{result.type}</strong>
                </div>

                <div>
                  <span>Source</span>
                  <strong>{result.source}</strong>
                </div>

                <div>
                  <span>Destination</span>
                  <strong>{result.destination}</strong>
                </div>

                <div>
                  <span>Protocol</span>
                  <strong>{result.protocol}</strong>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Analyze;