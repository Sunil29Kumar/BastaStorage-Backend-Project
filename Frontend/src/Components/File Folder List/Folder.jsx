import { useContext, useEffect, useRef, useState } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { Link } from "react-router-dom";
import { formatSize } from "../../Utils/formatSize.js";

function Folder() {
  const {
    isDarkMode,
    directoriesList,
    renameFile,
    handleDeleteDirectory,
    setShowFolderRenameInputBox,
    setShowFolderInfo,
    setFolderInfo,
  } = useContext(BastaStorageContext);

  const [openFolderMenueId, setOpenFolderMenueId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenFolderMenueId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`
      p-6 rounded-[2rem] transition-all duration-500
      ${isDarkMode ? "bg-[#111315] border border-white/5" : "bg-white shadow-sm border border-gray-100"}
    `}>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
          <i className="ri-folder-4-fill text-yellow-500 text-2xl"></i>
        </div>
        <div>
          <h4 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Folders</h4>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{directoriesList.length} items stored</p>
        </div>
      </div>

      {/* Professional Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {directoriesList.map((folder) => (
          <div
            key={folder.id}
            className={`
              group relative flex items-center justify-between p-4 rounded-[1.8rem] border transition-all duration-300
              ${isDarkMode
                ? "bg-[#1c1f23] border-white/5 hover:border-blue-500/40 hover:bg-[#23272b] shadow-xl shadow-black/20"
                : "bg-white border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 text-gray-800"
              }`}
          >
            {/* Folder Main Link */}
            <Link
              to={`/directory/${folder.id}`}
              className="flex items-center gap-4 overflow-hidden flex-1"
            >
              <div className="text-3xl text-blue-500 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-[-10deg]">
                <i className="ri-folder-fill"></i>
              </div>
              <span className="text-[13px] font-bold truncate tracking-tight">
                {folder.name}
              </span>
            </Link>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setOpenFolderMenueId(openFolderMenueId === folder.id ? null : folder.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                  isDarkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <i className="ri-more-2-fill"></i>
              </button>

              {/* Dropdown Menu */}
              {openFolderMenueId === folder.id && (
                <div
                  ref={menuRef}
                  className={`
                    absolute right-0 mt-3 w-48 rounded-2xl shadow-2xl z-[100] border py-2 
                    animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl
                    ${isDarkMode ? "bg-gray-900/95 border-white/10 shadow-black" : "bg-white/95 border-gray-100 shadow-blue-500/10"}
                  `}
                >
                  <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] opacity-30 border-b mb-1 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
                    Folder Options
                  </div>

                  <MenuAction
                    icon="ri-edit-line"
                    label="Rename"
                    onClick={() => {
                      renameFile(folder.id, folder.name);
                      setShowFolderRenameInputBox(true);
                      setOpenFolderMenueId(null);
                    }}
                    isDarkMode={isDarkMode}
                  />

                  <MenuAction
                    icon="ri-information-line"
                    label="Details"
                    onClick={() => {
                      setFolderInfo([{
                        folderId: folder.id,
                        folderName: folder.name,
                        folderSize: formatSize(folder.size),
                        folderCreationDate: folder.folderTimeStamp.folderCreatedAt,
                        folderOpendedDate: folder.folderTimeStamp.opened,
                        folderLastModified: folder.folderTimeStamp.lastModified,
                      }]);
                      setShowFolderInfo(true);
                      setOpenFolderMenueId(null);
                    }}
                    isDarkMode={isDarkMode}
                  />

                  <div className={`my-1 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`} />

                  <MenuAction
                    icon="ri-delete-bin-line"
                    label="Delete"
                    danger
                    onClick={() => handleDeleteDirectory(folder.id)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuAction({ icon, label, onClick, danger, isDarkMode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-bold transition-all
        ${danger 
          ? "text-red-500 hover:bg-red-500/10" 
          : isDarkMode ? "text-gray-300 hover:bg-white/5 hover:text-blue-400" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"}
      `}
    >
      <i className={`${icon} text-base`}></i>
      {label}
    </button>
  );
}

export default Folder;