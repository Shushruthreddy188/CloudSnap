import { useEffect, useMemo, useState } from "react";
import "./App.css";

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getTime = () =>
  new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [bucketName, setBucketName] = useState("my-app-uploads");
  const [region, setRegion] = useState("us-east-1");
  const [prefix, setPrefix] = useState("");

  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Waiting...");
  const [logs, setLogs] = useState([
    {
      time: getTime(),
      type: "info",
      text: "Cloud Carnival ready. Pick an image to begin.",
    },
  ]);

  const [dimensions, setDimensions] = useState("—");
  const [dragActive, setDragActive] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      setDimensions(`${img.width}×${img.height}`);
    };
    img.src = previewUrl;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const addLog = (text, type = "info") => {
    setLogs((prev) => [...prev, { time: getTime(), type, text }]);
  };

  const resetAll = () => {
    setFile(null);
    setImageUrl("");
    setMessage("");
    setProgress(0);
    setProgressLabel("Waiting...");
    setDimensions("—");
    addLog("Workspace cleared.", "warn");
  };

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Only image files are supported");
      addLog("Rejected file. Only image uploads are allowed.", "error");
      return;
    }

    setFile(selectedFile);
    setImageUrl("");
    setMessage("Image selected. Ready for launch 🚀");
    addLog(
      `Selected ${selectedFile.name} (${formatBytes(selectedFile.size)})`,
      "info",
    );
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please choose an image first");
      addLog("Upload blocked. No file selected.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setMessage("");
      setProgress(8);
      setProgressLabel("Packing pixels...");
      addLog(
        `Preparing upload to s3://${bucketName}/${prefix}${file.name}`,
        "info",
      );

      const fakeSteps = [
        { pct: 18, label: "Opening cloud gate..." },
        { pct: 34, label: "Sending sparkles..." },
        { pct: 57, label: "Crossing atmosphere..." },
        { pct: 78, label: "Docking with S3..." },
        { pct: 92, label: "Polishing URL..." },
      ];

      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < fakeSteps.length) {
          setProgress(fakeSteps[stepIndex].pct);
          setProgressLabel(fakeSteps[stepIndex].label);
          stepIndex += 1;
        }
      }, 350);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setProgress(100);
      setProgressLabel("Upload complete");
      setImageUrl(data.fileUrl);
      setMessage("Image uploaded successfully ✨");
      addLog(`Upload complete: ${data.fileUrl}`, "success");
    } catch (error) {
      setProgress(0);
      setProgressLabel("Upload failed");
      setMessage(error.message || "Upload failed");
      addLog(error.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    handleFileSelection(droppedFile);
  };

  const handleCopyUrl = async () => {
    if (!imageUrl) return;
    await navigator.clipboard.writeText(imageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1800);
  };

  const handleCopyPath = async () => {
    if (!file) return;
    const s3Path = `s3://${bucketName}/${prefix}${file.name}`;
    await navigator.clipboard.writeText(s3Path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 1800);
  };

  return (
    <div className="app-shell">
      <div className="bg-noise" />
      <div className="bg-gradient" />
      <div className="bg-grid" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">☁️</div>
          <div>
            <div className="brand-title">CloudSnap</div>
            <div className="brand-subtitle">S3 image launcher</div>
          </div>
        </div>

        <div className="topbar-right">
          <span className="badge success">
            <span className="dot" />
            Ready
          </span>
          <span className="badge">{region}</span>
        </div>
      </header>

      <main className="main-layout">
        {/* ─── SIDEBAR ─── */}
        <aside className="sidebar glass-card">
          {/* DROP ZONE */}
          <div className="sidebar-section">
            <div className="section-label">Pick your image</div>

            <label
              className={`drop-zone ${dragActive ? "drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelection(e.target.files?.[0])}
              />
              <span className="drop-emoji">🪄</span>
              <div className="drop-title">
                {file ? "Image captured ✓" : "Drop image here"}
              </div>
              <div className="drop-subtitle">
                PNG, JPG, GIF, WebP · click or drag
              </div>
            </label>

            {/*
              KEY FIX: file-card-slot always occupies 76px of space.
              When empty it's just a transparent slot.
              When file is selected the card animates in.
              This prevents the sidebar from resizing.
            */}
            <div className="file-card-slot">
              {file && (
                <div className="file-card">
                  <div className="file-thumb">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Local preview" />
                    ) : (
                      <span>🖼️</span>
                    )}
                  </div>

                  <div className="file-meta">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatBytes(file.size)}</div>
                  </div>

                  <button
                    className="mini-btn danger"
                    onClick={() => {
                      setFile(null);
                      setImageUrl("");
                      setMessage("");
                      addLog("Selected file removed.", "warn");
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DESTINATION */}
          <div className="sidebar-section">
            <div className="section-label">Destination</div>

            <div className="form-stack">
              <div>
                <label className="input-label">Bucket name</label>
                <input
                  className="text-input"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  placeholder="your-bucket-name"
                />
              </div>

              <div>
                <label className="input-label">Region</label>
                <select
                  className="text-input"
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    addLog(`Region changed to ${e.target.value}`, "info");
                  }}
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">Europe (Ireland)</option>
                  <option value="ap-southeast-1">
                    Asia Pacific (Singapore)
                  </option>
                </select>
              </div>

              <div>
                <label className="input-label">Key prefix</label>
                <input
                  className="text-input"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="uploads/2026/"
                />
              </div>
            </div>
          </div>

          {/* UPLOAD CONTROLS */}
          <div className="upload-controls">
            <div
              className={`progress-wrap ${loading || progress > 0 ? "show" : ""}`}
            >
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-row">
                <span>{progressLabel}</span>
                <span>{progress}%</span>
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading…" : "Launch to S3 🚀"}
            </button>

            <button className="secondary-btn" onClick={resetAll}>
              Clear stage
            </button>

            {message && <div className="message-box">{message}</div>}
          </div>
        </aside>

        {/* ─── CONTENT ─── */}
        <section className="content">
          {/* HERO */}
          <div className="hero-panel glass-card">
            <div className="hero-copy">
              <div className="eyebrow">Tiny mission control</div>
              <h1>Send images to the cloud with style</h1>
              <p>
                Pick, preview, upload, celebrate. Your S3 bucket has never
                looked this good.
              </p>
            </div>

            <div className="stats-grid">
              <StatCard
                value={file ? formatBytes(file.size) : "—"}
                label="File size"
              />
              <StatCard value={dimensions} label="Dimensions" />
              <StatCard
                value={
                  file ? file.type.replace("image/", "").toUpperCase() : "—"
                }
                label="Format"
              />
            </div>
          </div>

          {/* PREVIEWS */}
          <div className="preview-grid">
            {/* LOCAL */}
            <div className="preview-card glass-card">
              <div className="card-header">
                <span>Local preview</span>
                <span className="pill">Before launch</span>
              </div>

              {/*
                KEY FIX: image-stage has a fixed height (340px via CSS).
                Whether empty or showing an image, the card height never changes.
              */}
              <div className="image-stage">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="main-image" />
                ) : (
                  <EmptyState
                    title="No image selected"
                    subtitle="Choose a file and it will appear here"
                    emoji="🖼️"
                  />
                )}
              </div>
            </div>

            {/* CLOUD */}
            <div className="preview-card glass-card">
              <div className="card-header">
                <span>Cloud result</span>
                <span className={`pill ${imageUrl ? "success" : ""}`}>
                  After launch
                </span>
              </div>

              <div className="image-stage">
                {imageUrl ? (
                  <img src={imageUrl} alt="Uploaded" className="main-image" />
                ) : (
                  <EmptyState
                    title="Nothing in orbit yet"
                    subtitle="Upload the image and the cloud version shows up here"
                    emoji="☁️"
                  />
                )}
              </div>

              {imageUrl && (
                <div className="url-panel">
                  {/* <div className="url-text">{imageUrl}</div> */}
                  <div className="url-actions">
                    <button className="mini-btn" onClick={handleCopyUrl}>
                      {copiedUrl ? "Copied!" : "Copy URL"}
                    </button>
                    <button className="mini-btn" onClick={handleCopyPath}>
                      {copiedPath ? "Copied!" : "Copy S3 path"}
                    </button>
                    <a
                      className="mini-btn link-btn"
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LOG */}
          <div className="log-panel glass-card">
            <div className="log-header">
              <div className="log-title">
                <span className="live-dot" />
                Activity log
              </div>
              <button className="mini-btn" onClick={() => setLogs([])}>
                Clear
              </button>
            </div>

            <div className="log-body">
              {logs.length === 0 ? (
                <div className="log-line muted">No activity yet.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={`${log.time}-${index}`} className="log-line">
                    <span className="log-time">{log.time}</span>
                    <span className={`log-text ${log.type}`}>{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button
        className={`toggle ${checked ? "on" : ""}`}
        type="button"
        onClick={onChange}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function EmptyState({ emoji, title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-emoji">{emoji}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-subtitle">{subtitle}</div>
    </div>
  );
}
