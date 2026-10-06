import { useState } from "react";
import axios from "axios";

import { useDetections } from "../context/useDetection";
import { uploadTrafficFile } from "../api/api";

import {
  Upload,
  FileText,
  ShieldCheck,
  X,
  Activity,
} from "lucide-react";

import "../styles/Analyze.css";

function Analyze() {
  const { addDetection } = useDetections();

  // ------------------------------------------------------------
  // PCAP analysis state
  // ------------------------------------------------------------

  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // ------------------------------------------------------------
  // Domain monitoring state
  // ------------------------------------------------------------

  const [domain, setDomain] = useState("");
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState(null);

  // Backend currently accepts these file types
  const allowedExtensions = [
    ".pcap",
    ".pcapng",
    ".cap",
  ];

  // ------------------------------------------------------------
  // Validate PCAP file
  // ------------------------------------------------------------

  const isValidFileType = (file) => {
    const fileName = file.name.toLowerCase();

    return allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );
  };

  // ------------------------------------------------------------
  // Select PCAP
  // ------------------------------------------------------------

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
          "Unsupported file type. Please select a PCAP, PCAPNG, or CAP file.",
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

  // ------------------------------------------------------------
  // Remove selected PCAP
  // ------------------------------------------------------------

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  // ============================================================
  // PCAP + LUCID ANALYSIS
  // ============================================================

  const handleAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      // ----------------------------------------------------------
      // Send PCAP to FastAPI
      // ----------------------------------------------------------

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/analysis/upload",
        formData
      );

      console.log("PCAP analysis response:", response.data);

      const data = response.data;
      const lucidResult = data.result;

      // ----------------------------------------------------------
      // Validate backend response
      // ----------------------------------------------------------

      if (!data.success || !lucidResult) {
        throw new Error(
          "The backend did not return a valid LUCID result."
        );
      }

      // ----------------------------------------------------------
      // Values returned by LUCID
      // ----------------------------------------------------------

      const filename =
        data.filename || selectedFile.name;

      const ddosScore =
        lucidResult["DDOS%"] ?? "N/A";

      const packets =
        lucidResult.Packets ?? "N/A";

      const samples =
        lucidResult.Samples ?? "N/A";

      const processingTime =
        lucidResult.Time ?? "N/A";

      const model =
        lucidResult.Model ?? "LUCID";

      // ----------------------------------------------------------
      // Determine detection type
      // ----------------------------------------------------------

      let detectedType = "Normal";

      const numericDdosScore =
        Number.parseFloat(
          String(ddosScore).replace("%", "")
        );

      if (!Number.isNaN(numericDdosScore)) {
        if (numericDdosScore >= 50) {
          detectedType = "Malicious";
        } else if (numericDdosScore >= 20) {
          detectedType = "Suspicious";
        }
      }

      // ----------------------------------------------------------
      // Add to existing detection history
      // ----------------------------------------------------------

      addDetection({
        id: Date.now(),

        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString(),

        filename,

        type: detectedType,

        ddosPercentage:
          Number.isNaN(numericDdosScore)
            ? 0
            : numericDdosScore,

        packets:
          packets === "N/A"
            ? 0
            : packets,

        samples:
          samples === "N/A"
            ? 0
            : samples,

        windows:
          lucidResult.Windows ??
          lucidResult.windows ??
          0,
      });

      // ----------------------------------------------------------
      // Display LUCID result
      // ----------------------------------------------------------

      setResult({
        status:
          detectedType === "Normal"
            ? "Analysis Complete"
            : "Threat Detected",

        type: detectedType,

        source: "-",
        destination: "-",
        protocol: "-",

        message:
          detectedType === "Normal"
            ? "Normal traffic detected during analysis."
            : `${detectedType} traffic detected during analysis.`,

        filename,
        model,
        ddosScore,
        packets,
        samples,
        processingTime,

        accuracy:
          lucidResult.Accuracy ?? "N/A",

        f1Score:
          lucidResult.F1Score ?? "N/A",

        tpr:
          lucidResult.TPR ?? "N/A",

        fpr:
          lucidResult.FPR ?? "N/A",

        tnr:
          lucidResult.TNR ?? "N/A",

        fnr:
          lucidResult.FNR ?? "N/A",

        rawResult: lucidResult,
      });
    } catch (error) {
      console.error("PCAP analysis failed:", error);

      setResult({
        status: "Analysis Failed",
        type: "Error",
        source: "-",
        destination: "-",
        protocol: "-",
        message:
          error.response?.data?.detail ||
          error.message ||
          "Unable to analyze the uploaded traffic file.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ============================================================
  // DOMAIN HEALTH MONITOR
  // ============================================================

  const handleDomainCheck = async () => {
    if (!domain.trim() || isCheckingDomain) return;

    let cleanDomain = domain.trim();

    if (!/^https?:\/\//i.test(cleanDomain)) {
      cleanDomain = `https://${cleanDomain}`;
    }

    setIsCheckingDomain(true);
    setDomainResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/monitor/start",
        {
          url: cleanDomain,
        }
      );

      const data = response.data;

      setDomainResult({
        domain: data.target,
        status: data.detection.status,
        anomalyScore: data.detection.anomaly_score,
        reasons: data.detection.reasons,
        checks: data.checks,
        metrics: data.metrics,
      });
    } catch (error) {
      console.error("Domain monitoring failed:", error);

      setDomainResult({
        domain: cleanDomain,
        status: "ERROR",
        anomalyScore: null,
        reasons: [
          error.response?.data?.detail ||
            "Unable to connect to the monitoring backend.",
        ],
        checks: [],
        metrics: null,
      });
    } finally {
      setIsCheckingDomain(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="analyze-page">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="analyze-header">
        <div>
          <h2>Analyze Traffic</h2>

          <p>
            Upload network traffic for security analysis.
          </p>
        </div>
      </div>

      {/* ======================================================
          PCAP ANALYSIS CARD
      ====================================================== */}

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

        {/* Upload area */}

        <label className="upload-area">

          <input
            type="file"
            onChange={handleFileChange}
            accept=".pcap,.pcapng,.cap"
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

        {/* Selected file */}

        {selectedFile && (
          <div className="selected-file">

            <FileText size={20} />

            <div className="selected-file-info">

              <strong>
                {selectedFile.name}
              </strong>

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

        {/* Analyze button */}

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

        {/* ==================================================
            DOMAIN MONITOR
        ================================================== */}

        <div className="domain-check-card">

          <div className="domain-check-header">

            <div>

              <h3>Domain Health Monitor</h3>

              <p>
                Monitor a domain's availability,
                response time, and service health.
              </p>

            </div>

            <div className="domain-check-icon">
              <Activity size={22} />
            </div>

          </div>

          <div className="domain-check-form">

            <input
              type="text"
              placeholder="Enter domain name..."
              value={domain}
              onChange={(event) =>
                setDomain(event.target.value)
              }
            />

            <button
              type="button"
              onClick={handleDomainCheck}
              disabled={
                !domain.trim() ||
                isCheckingDomain
              }
            >
              {isCheckingDomain
                ? "Checking..."
                : "Check Domain"}
            </button>

          </div>

          {/* Domain result */}

          {domainResult && (
            <div
              className={`domain-result ${
                domainResult.status?.toLowerCase() ||
                "error"
              }`}
            >

              <div className="domain-result-header">

                <strong>
                  {domainResult.domain}
                </strong>

                <span>
                  {domainResult.status}
                </span>

              </div>

              {domainResult.metrics && (
                <div className="domain-result-details">

                  <div>
                    <span>
                      Availability
                    </span>

                    <strong>
                      {
                        domainResult.metrics
                          .availability_percent
                      }%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Avg Response
                    </span>

                    <strong>
                      {
                        domainResult.metrics
                          .average_response_time_ms
                      } ms
                    </strong>
                  </div>

                  <div>
                    <span>
                      5xx Errors
                    </span>

                    <strong>
                      {
                        domainResult.metrics
                          .error_5xx_rate_percent
                      }%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Timeouts
                    </span>

                    <strong>
                      {
                        domainResult.metrics
                          .timeout_rate_percent
                      }%
                    </strong>
                  </div>

                  <div>
                    <span>
                      Anomaly Score
                    </span>

                    <strong>
                      {domainResult.anomalyScore}
                    </strong>
                  </div>

                </div>
              )}

              {domainResult.reasons?.length > 0 && (
                <div className="domain-result-reasons">

                  <strong>
                    Detection Reasons
                  </strong>

                  <ul>
                    {domainResult.reasons.map(
                      (reason, index) => (
                        <li key={index}>
                          {reason}
                        </li>
                      )
                    )}
                  </ul>

                </div>
              )}

              {domainResult.checks?.length > 0 && (
                <div className="domain-checks">

                  <strong>
                    Monitoring Checks
                  </strong>

                  {domainResult.checks.map(
                    (check) => (
                      <div
                        className="domain-check-row"
                        key={check.check_number}
                      >

                        <span>
                          Check {check.check_number}
                        </span>

                        <span>
                          HTTP{" "}
                          {check.status_code ?? "ERROR"}
                        </span>

                        <span>
                          {check.response_time_ms} ms
                        </span>

                        <span>
                          {check.available
                            ? "Available"
                            : "Unavailable"}
                        </span>

                      </div>
                    )
                  )}

                </div>
              )}

              <p className="domain-result-note">
                This result is based on black-box
                service monitoring. It measures
                observable response behavior and does
                not directly measure the target
                server's total network traffic.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* ======================================================
          RESULT CARD
      ====================================================== */}

      <div className="result-card">

        <div className="result-header">

          <div>

            <h3>Analysis Result</h3>

            <p>
              Security analysis results will appear here.
            </p>

          </div>

        </div>

        {/* Empty state */}

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

        {/* ==================================================
            LUCID RESULT
        ================================================== */}

        {result && (
          <div
            className={`analysis-success ${
              result.type === "Error" ||
              result.type === "Invalid"
                ? "invalid"
                : "normal"
            }`}
          >

            <div className="success-icon">
              <ShieldCheck size={24} />
            </div>

            <div className="analysis-result-content">

              <strong className="analysis-status">
                {result.status}
              </strong>

              <p>
                {result.message}
              </p>

              {/* LUCID information */}

              {result.rawResult && (
                <div className="analysis-details">

                  <div>
                    <span>
                      Status
                    </span>

                    <strong>
                      {result.type}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Model
                    </span>

                    <strong>
                      {result.model}
                    </strong>
                  </div>

                  <div>
                    <span>
                      PCAP
                    </span>

                    <strong>
                      {result.filename}
                    </strong>
                  </div>

                  <div>
                    <span>
                      DDoS %
                    </span>

                    <strong>
                      {result.ddosScore}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Packets
                    </span>

                    <strong>
                      {result.packets}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Samples
                    </span>

                    <strong>
                      {result.samples}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Processing Time
                    </span>

                    <strong>
                      {result.processingTime}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Accuracy
                    </span>

                    <strong>
                      {result.accuracy}
                    </strong>
                  </div>

                  <div>
                    <span>
                      F1 Score
                    </span>

                    <strong>
                      {result.f1Score}
                    </strong>
                  </div>

                  <div>
                    <span>
                      TPR
                    </span>

                    <strong>
                      {result.tpr}
                    </strong>
                  </div>

                  <div>
                    <span>
                      FPR
                    </span>

                    <strong>
                      {result.fpr}
                    </strong>
                  </div>

                  <div>
                    <span>
                      TNR
                    </span>

                    <strong>
                      {result.tnr}
                    </strong>
                  </div>

                  <div>
                    <span>
                      FNR
                    </span>

                    <strong>
                      {result.fnr}
                    </strong>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Analyze;