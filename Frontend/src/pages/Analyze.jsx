import { useState } from "react";
import { useDetections } from "../context/useDetection";
import { uploadTrafficFile } from "../api/api";

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

  const handleAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const data = await uploadTrafficFile(selectedFile);

      console.log("Backend response:", data);

      if (!data.success) {
        throw new Error("Backend analysis failed.");
      }

      const analysis = data.result;

      let detectedType;

      switch (analysis.status.toLowerCase()) {
        case "normal":
          detectedType = "Normal";
          break;

        case "suspicious":
          detectedType = "Suspicious";
          break;

        case "ddos_attack":
          detectedType = "Malicious";
          break;

        default:
          detectedType = "Malicious";
          break;
      }

      addDetection({
        id: Date.now(),

        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),

        filename: selectedFile.name,

        type: detectedType,

        ddosPercentage: analysis.ddos_percentage ?? 0,
        packets: analysis.packets ?? 0,
        samples: analysis.samples ?? 0,
        windows: analysis.windows ?? 0,
      });

      setResult({
        status: analysis.status === "Normal"
          ? "Analysis Complete"
          : "Threat Detected",

        type: detectedType,

        source: "-",

        destination: "-",

        protocol: "-",

        message:
          analysis.status === "Normal"
            ? "Normal traffic detected during analysis."
            : `${analysis.status} traffic detected during analysis.`,

        ddosPercentage: analysis.ddos_percentage,

        packets: analysis.packets,

        samples: analysis.samples,

        windows: analysis.windows,
      });

    } catch (error) {
      console.error("Analysis error:", error);

      setResult({
        status: "Analysis Failed",
        type: "Invalid",
        source: "-",
        destination: "-",
        protocol: "-",
        message:
          error.message ||
          "Unable to analyze the uploaded traffic file.",
      });

    } finally {
      setIsAnalyzing(false);
    }
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

              <strong className="analysis-status">
                {result.status}
              </strong>

              <p>{result.message}</p>

              <div className="analysis-details">

                <div>
                  <span>Status</span>
                  <strong className={`traffic-status ${result.type.toLowerCase()}`}>
                    {result.type}
                  </strong>
                </div>

                <div>
                  <span>DDoS Probability</span>
                  <strong>
                    {result.ddosPercentage !== undefined
                      ? `${result.ddosPercentage}%`
                      : "-"}
                  </strong>
                </div>

                <div>
                  <span>Packets</span>
                  <strong>
                    {result.packets ?? "-"}
                  </strong>
                </div>

                <div>
                  <span>Samples</span>
                  <strong>
                    {result.samples ?? "-"}
                  </strong>
                </div>

                <div>
                  <span>Windows</span>
                  <strong>
                    {result.windows ?? "-"}
                  </strong>
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