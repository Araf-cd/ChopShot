import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("Upload successful. Processing...");
      } else {
        setStatus("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Upload error.");
    }
  };

  return (
    <div className="App">
      <input type="file" accept="video/*" onChange={handleFileChange} />

      <button onClick={handleUpload} disabled={!videoFile}>
        Upload
      </button>

      <p>{status}</p>
    </div>
  );
};

export default App;
