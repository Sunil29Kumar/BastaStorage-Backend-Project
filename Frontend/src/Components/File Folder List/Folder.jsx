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

  // Close menu on click outside
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
    <div className="p-4 bg-gray-50 rounded-2xl min-h-[20vh] max-h-[35vh] overflow-x-hidden ">

      <div className="flex items-center gap-3 mb-6">
        <i className="ri-folder-4-line text-yellow-500 text-2xl "></i>
        <div>
          <h4 className="text-xl font-bold tracking-tight">Folders</h4>
          <p className="text-xs opacity-50 font-medium">{directoriesList.length} items stored</p>
        </div>
      </div>

      {/* Professional Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4   ">
        {directoriesList.map((folder) => (
          <div
            key={folder.id}
            className={`group  relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 
              ${isDarkMode
                ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700 hover:border-blue-500 text-gray-100"
                : "bg-white border-gray-200 hover:shadow-lg hover:border-blue-400 text-gray-800"
              }`}
          >
            {/* Folder Main Link */}
            <Link
              to={`/directory/${folder.id}`}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="text-3xl text-blue-500 group-hover:scale-110 transition-transform duration-200">
                <i className="ri-folder-4-line"></i>
              </div>
              <span className="text-sm font-medium truncate">
                {folder.name}
              </span>
            </Link>

            {/* Menu Button */}
            <div className="relative ">
              <button
                onClick={() => setOpenFolderMenueId(openFolderMenueId === folder.id ? null : folder.id)}
                className={`p-1.5 rounded-full transition-colors ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
              >
                <i className="ri-more-2-fill"></i>
              </button>

              {/* Dropdown Menu */}
              {openFolderMenueId === folder.id && (
                <div
                  ref={menuRef}
                  className={`absolute right-0  mt-2 w-48 rounded-lg shadow-xl z-100 border py-1 animate-in fade-in zoom-in duration-150 
                    ${isDarkMode ? "bg-gray-900 border-gray-700 shadow-black/50" : "bg-white border-gray-100"}`}
                >
                  <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider opacity-50 border-b mb-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
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

                  <div className={`my-1 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`} />

                  <MenuAction
                    icon="ri-delete-bin-7-line"
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

// Sub-component for Menu Items to keep code clean
function MenuAction({ icon, label, onClick, danger, isDarkMode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
        ${danger ? "text-red-500 hover:bg-red-50" : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}
        ${isDarkMode && danger ? "hover:bg-red-900/20" : ""}
      `}
    >
      <i className={icon}></i>
      {label}
    </button>
  );
}

export default Folder;