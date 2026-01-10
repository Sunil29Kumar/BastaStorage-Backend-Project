import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiMoreVertical, FiDownload, FiEdit3, FiTrash2,
  FiAlertCircle, FiFileText, FiChevronLeft, FiLoader
} from 'react-icons/fi';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import RenameFileInputBox from '../Rename file folder/RenameFileInputBox';

function PrivateShareFileViewer() {
  const {
    renameFile, BASE_URL, setShowFileRenameInputBox,
    showFileRenameInputBox, removeSharedUser, inviteUserMessage, isDarkMode
  } = useContext(BastaStorageContext);

  const { fileId, token } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  async function privateShare() {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/file/${fileId}/share/private/${token}`,
        { credentials: "include" }
      );
      const data = await response.json();
      console.log(data);


      if (response.ok) {
        setFileData(data.fileData);
        setError(null);
      } else {
        setError(data.error || "Access Denied");
      }
    } catch (err) {
      setError("Failed to load file. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    privateShare();
  }, [token, fileId]);

  const renderPreview = () => {
    if (loading) return (
      <div className="flex flex-col items-center gap-4">
        <FiLoader className="text-4xl animate-spin text-blue-500" />
        <p className="text-sm font-medium animate-pulse">Decrypting your file...</p>
      </div>
    );

    if (error) return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-800 max-w-md">
        <FiAlertCircle className="text-5xl text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Error</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm">Go Back</button>
      </div>
    );

    if (fileData?.type.startsWith("image/")) {
      return <img src={fileData.viewUrl} alt={fileData.name} className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg" />;
    }

    if (fileData?.type === "application/pdf") {
      return <iframe src={fileData.viewUrl} title={fileData.name} className="w-full h-[85vh] rounded-xl shadow-lg border-none" />;
    }

    if (fileData?.type.startsWith("video/")) {
      return (
        <video controls className="max-w-full max-h-[85vh] rounded-xl shadow-2xl">
          <source src={fileData.viewUrl} type={fileData.type} />
        </video>
      );
    }

    if (fileData?.type.startsWith("audio/")) {
      return (
        <div className="w-full max-w-xl p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
          <p className="mb-4 font-bold text-center">{fileData.name}</p>
          <audio controls className="w-full">
            <source src={fileData.viewUrl} type={fileData.type} />
          </audio>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center p-12 bg-white dark:bg-slate-800 rounded-3xl shadow-xl">
        <FiFileText className="text-7xl text-blue-500 mb-4" />
        <p className="font-bold text-lg mb-1">{fileData?.name}</p>
        <p className="text-sm text-gray-500 mb-6">Preview not available for this file type</p>
        <a href={fileData?.viewUrl} download className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30">
          <FiDownload /> Download File
        </a>
      </div>
    );
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>

      {/* Top Floating Bar */}
      {!loading && !error && (
        <nav className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] max-w-5xl z-50  px-6 py-3 rounded-2xl  flex items-center justify-between border ${isDarkMode ? "border-gray-50" : "border-gray-600 "} `}>

          {/* nav left side  */}
          <div className="flex items-center gap-3 overflow-hidden">
            <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <FiChevronLeft size={20} />
            </Link>
            <span className="font-bold text-sm truncate max-w-[150px] md:max-w-md">{fileData?.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase  ${isDarkMode ? "bg-gray-300 text-blue-300" : "bg-blue-100 text-blue-600"} `}>{fileData?.permission}</span>
          </div>

          {/* nav right side  */}
          <div className="flex items-center gap-2 relative">
            <a
              onClick={() => window.open(`${BASE_URL}/file/${fileData.id}/share/private/${token}?action=download`)}
              download={fileData.name}
              className="p-2.5 cursor-pointer bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <FiDownload size={18} />
            </a>

            {fileData?.permission !== "View" && (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2.5 cursor-pointer ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"} rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700`}>
                <FiMoreVertical size={18} />
              </button>
            )}

            {/* Modern Context Menu */}
            {showMenu && (
              <div className={`absolute right-0 top-14 w-48 ${isDarkMode ? "bg-gray-600" : "bg-white border-gray-200"} border rounded-2xl shadow-xl z-50 flex flex-col py-2 `}>
                <button 
                onClick={() => { renameFile(fileId, fileData.name); setShowFileRenameInputBox(true); setShowMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"} hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors cursor-pointer `}>
                  <FiEdit3 className="text-blue-500" /> Rename
                </button>
                <button
                  onClick={() => { removeSharedUser(fileId, fileData.userId); setShowMenu(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl ${isDarkMode ? "text-red-400" : "text-red-600"} transition-colors cursor-pointer`}>
                  <FiTrash2 /> Remove Access
                </button>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Main Viewer Area */}
      <div className="h-screen w-full flex flex-col items-center justify-center p-4 pt-24">
        {renderPreview()}
      </div>

      {showFileRenameInputBox && <RenameFileInputBox />}

      {/* Floating Status Messages */}
      {(inviteUserMessage?.message || inviteUserMessage?.error) && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 ${inviteUserMessage.error ? "bg-red-500 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"}`}>
            {inviteUserMessage.error ? <FiAlertCircle /> : <FiFileText />}
            {inviteUserMessage.message || inviteUserMessage.error}
          </div>
        </div>
      )}
    </div>
  );
}

export default PrivateShareFileViewer;