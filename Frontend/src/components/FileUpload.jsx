import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

function FileUpload({ onFileSelect }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files[0];

    if (!droppedFile) {
      return;
    }

    setFile(droppedFile);

    if (onFileSelect) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="upload-section">
      <div
        className="upload-box"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current.click()}
      >
        <div className="upload-icon">
          <Upload size={28} />
        </div>

        <h3>Upload Network Traffic</h3>

        <p>
          Drag and drop your network capture file here
        </p>

        <span className="upload-or">
          or
        </span>

        <button
          type="button"
          className="primary-button"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current.click();
          }}
        >
          Choose File
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pcap,.pcapng,.csv"
          onChange={handleFileChange}
          hidden
        />

        <p className="upload-formats">
          Supported formats: PCAP, PCAPNG, CSV
        </p>
      </div>

      {file && (
        <div className="selected-file">
          <FileText size={20} />

          <div>
            <strong>{file.name}</strong>

            <span>
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;