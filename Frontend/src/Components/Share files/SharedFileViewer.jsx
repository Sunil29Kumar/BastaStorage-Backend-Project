import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SharedFileViewer() {
  const { token } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchFile() {
    try {
      const response = await fetch(
        `http://localhost:2000/file/share/${token}`,
        { credentials: "include" }
      );
      const data = await response.json();
      setFileData(data);
    } catch (error) {
      console.error("Error fetching file:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFile();
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading file...
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        File not found or link expired.
      </div>
    );
  }

  // Preview renderer
  const renderPreview = () => {
    if (fileData.type.startsWith("image/")) {
      return (
        <img
          src={fileData.viewUrl}
          alt={fileData.name}
          className="h-[80vh] w-[70%] rounded-lg shadow"
        />
      );
    }

    if (fileData.type === "application/pdf") {
      return (
        <iframe
          src={fileData.viewUrl}
          title={fileData.name}
          className="w-[70%] h-[80vh] border rounded-lg shadow"
        />
      );
    }

    if (fileData.type.startsWith("video/")) {
      return (
        <video
          controls
          className="h-[80vh] w-[70%] rounded-lg shadow"
        >
          <source src={fileData.viewUrl} type={fileData.type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileData.type.startsWith("audio/")) {
      return (
        <audio controls className="w-full mt-4">
          <source src={fileData.viewUrl} type={fileData.type} />
          Your browser does not support the audio element.
        </audio>
      );
    }

    return (
      <div className="flex flex-col items-center text-gray-600">
        <span className="text-6xl">📄</span>
        <p className="mt-2">Preview not available</p>
      </div>
    );
  };

  return (
    <div className="h-[100vh] w-full bg-gray-900 flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-semibold text-center text-white mb-4">
        {fileData.name}
      </h2>

      {/* File Preview */}
      {renderPreview()}

      {/* Actions */}
      <div className="mt-6 flex justify-center gap-4">
        <a
          href={fileData.viewUrl}
          download={fileData.name}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Download
        </a>
        <a
          href={fileData.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Open in New Tab
        </a>
      </div>
    </div>
  );
}

export default SharedFileViewer;
