import { useContext, useEffect, useRef, useState } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { fileFormats } from "../../Utils/FileTypes.jsx";
import { formatSize } from "../../Utils/formatSize.js";

function File() {
  const {
    isDarkMode, filesList, BASE_URL, renameFile, handleDeleteFile, fileRenameMessage, fileDeleteMessage,
    setShowFileRenameInputBox, setShowFileInfo, setFileInfo,
    setShowShareFile, setShareFileId, shareLink, setIsShareLinkCopied
  } = useContext(BastaStorageContext);

  const [openMenueId, setOpenMenueId] = useState(null);
  const [isShareFileHover, setIsShareFileHover] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const menuRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenueId(null);
        setIsShareFileHover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getExtension = (filename) => filename.split(".").pop().toLowerCase();

  // Updated: Yeh function ab pura format object return karega
  const getFileFormatData = (filename) => {
    const ext = getExtension(filename);
    const format = fileFormats.find(f => f.extensions.includes(ext));
    return format || fileFormats.find(f => f.type === "Unknown");
  };

  const actionProps = {
    isDarkMode, BASE_URL, openMenueId, setOpenMenueId, menuRef,
    renameFile, setShowFileRenameInputBox, setShowFileInfo, setFileInfo,
    handleDeleteFile, isShareFileHover, setIsShareFileHover,
    setShowShareFile, setShareFileId, shareLink, setIsShareLinkCopied,
    getFileFormatData, getExtension
  };

  return (
    <div className={`mt-1 p-5   rounded-b-4xl rounded-t-xl transition-all  ${isDarkMode ? "bg-[#111315] border border-white/5" : "bg-white shadow-sm border border-gray-100 text-gray-800"}`}>

      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <i className="ri-file-list-3-fill text-2xl text-blue-500"></i>
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight">Files</h4>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 mt-0.5">{filesList.length} items stored</p>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className={`flex p-1 rounded-xl w-fit self-end sm:self-auto  ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>

          <button onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${viewMode === "list" ? (isDarkMode ? "bg-gray-700 shadow-md" : "bg-white text-blue-600 shadow-sm") : "opacity-50 hover:opacity-100"}`}>
            <i className="ri-list-settings-line"></i> List
          </button>

          <button onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${viewMode === "grid" ? (isDarkMode ? "bg-gray-700 shadow-md" : "bg-white text-blue-600 shadow-sm") : "opacity-50 hover:opacity-100"}`}>
            <i className="ri-grid-fill"></i> Grid
          </button>
        </div>
      </div>

      {/* --- Content --- */}
      {viewMode === "list" ? (
        <div className=" ">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest  font-black  ">
                <th className="px-4 py-2 ">File Name</th>
                <th className="px-4 py-2 hidden md:table-cell">Date</th>
                <th className="px-4 py-2 hidden sm:table-cell">Size</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filesList.filter((file) => file.status !== "initiated" && file.status !== "uploading").map((file) => <ListRow key={file.id} file={file} {...actionProps} />)}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filesList.filter((file) => file.status !== "initiated" && file.status !== "uploading").map((file) => <GridCard key={file.id} file={file} {...actionProps} />)}
        </div>
      )}
    </div>
  );
}

/* --- Action Menu --- */
const ActionMenu = ({ file, isDarkMode, openMenueId, setOpenMenueId, menuRef, renameFile, setShowFileRenameInputBox, setShowFileInfo, setFileInfo, handleDeleteFile, isShareFileHover, setIsShareFileHover, setShowShareFile, setShareFileId, shareLink, setIsShareLinkCopied, BASE_URL, getFileFormatData }) => {

  const format = getFileFormatData(file.name);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState("right"); // Default side

  const handleToggleMenu = (e) => {
    if (openMenueId === file.id) {
      setOpenMenueId(null);
    } else {
      // Screen width ke hisab se position check karein
      const rect = buttonRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      // Agar button screen ke left half mein hai (rect.left < screenWidth / 2)
      // Toh menu ko right side mein dikhayenge (left-10)
      if (rect.left < screenWidth / 2) {
        setMenuPosition("left-10");
      } else {
        // Agar button right half mein hai, toh menu ko left mein shift karenge (right-10)
        setMenuPosition("right-10");
      }
      setOpenMenueId(file.id);
    }
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        className={`p-2 rounded-full transition-all cursor-pointer z-20 ${openMenueId === file.id
          ? (isDarkMode ? "bg-gray-700 opacity-100" : "bg-gray-100 opacity-100")
          : " hover:bg-gray-500/10"
          }`}
      >
        <i className="ri-more-2-fill text-xl font-bold"></i>
      </button>

      {/* Dropdown Menu */}
      {openMenueId === file.id && (
        <div
          ref={menuRef}
          className={`absolute z-[100] bottom-[10%] w-56 rounded-2xl shadow-2xl border py-2 animate-in fade-in zoom-in duration-200 backdrop-blur-xl 
          ${menuPosition} 
          ${isDarkMode ? "bg-gray-900/95 border-white/10 shadow-black" : "bg-gray-50 border-gray-100 shadow-blue-500/10"}`}
        >
          <div className={`px-5 py-2 text-[10px] font-black text-start uppercase tracking-[0.15em] opacity-30 border-b mb-1 ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
            File Management
          </div>

          <MenuBtn icon="ri-download-cloud-2-line" label="Download"
            onClick={() => window.open(`${BASE_URL}/file/${file.id}?action=download`)} isDarkMode={isDarkMode} />

          <MenuBtn icon="ri-edit-circle-line" label="Rename"
            onClick={() => {
              renameFile(file.id, file.name);
              setShowFileRenameInputBox(true);
              setOpenMenueId(null);
            }}
            isDarkMode={isDarkMode} />

          <MenuBtn icon="ri-information-fill" label="File Info"
            onClick={() => {
              setFileInfo([{ fileId: file.id, icon: format.icon, fileName: file.name, fileSize: formatSize(file.size), fileCreationDate: file.timeStamp.fileCreatedAt, fileOpenDate: file.timeStamp.opened, fileModifiedDate: file.timeStamp.lastModified, fileDownloadDate: file.timeStamp.lastDownload }]);
              setShowFileInfo(true);
              setOpenMenueId(null);
            }}
            isDarkMode={isDarkMode} />

          {/* Share Sub-Menu */}
          <div
            className="relative"
            onMouseEnter={() => setIsShareFileHover(true)}
            onMouseLeave={() => setIsShareFileHover(false)}
          >
            <button className={`w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-bold transition-all ${isDarkMode ? "text-gray-300 hover:bg-white/5 hover:text-blue-400" : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"}`}>
              <span className="flex items-center gap-3"><i className="ri-share-forward-line text-lg"></i> Share</span>
              <i className={menuPosition === "left-10" ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"}></i>
            </button>

            {isShareFileHover && (
              <div className={`absolute top-0 right-[100%] w-48 rounded-xl shadow-2xl border p-1 animate-in slide-in-from-top-1 backdrop-blur-xl 
           
                ${isDarkMode ? "bg-gray-900/95 border-white/10 shadow-black" : "bg-gray-50 border-gray-100"}`}>
                <MenuBtn icon="ri-user-add-line" label="Direct Share"
                  onClick={() => { setShowShareFile(true); setShareFileId(file.id); setOpenMenueId(null); }}
                  isDarkMode={isDarkMode} />
                <MenuBtn icon="ri-links-line" label="Copy URL"
                  onClick={() => { shareLink(file.id); setIsShareLinkCopied(true); setOpenMenueId(null); setTimeout(() => setIsShareLinkCopied(false), 1500); }}
                  isDarkMode={isDarkMode} />
              </div>
            )}
          </div>

          <div className={`my-1 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`} />
          <MenuBtn icon="ri-delete-bin-line" label="Delete" danger
            onClick={() => { handleDeleteFile(file.id); setOpenMenueId(null); }}
            isDarkMode={isDarkMode} />
        </div>
      )}
    </div>
  );
};

/* --- Row & Card Displays --- */
const ListRow = (props) => {
  const format = props.getFileFormatData(props.file.name);
  console.log("ppp , ", props);


  return (
    <tr className={`group transition-all ${props.isDarkMode ? "bg-gray-800/20 hover:bg-gray-800/50" : "bg-white hover:bg-blue-50 shadow-sm"} border rounded-xl`}>
      <td className="px-4 py-3 rounded-l-2xl">
        <div className="flex items-center gap-4">
          <div className={`text-2xl  p-2 rounded-lg ${format.bg} ${format.color} group-hover:scale-110 transition-transform`}>
            {format.icon}
          </div>
          <a href={`${props.BASE_URL}/file/${props.file.id}`} className="text-sm font-semibold truncate max-w-[200px] md:max-w-md hover:text-blue-500">{props.file.name}</a>
        </div>
      </td>
      <td className=" px-4 py-3 text-sm opacity-50 hidden md:table-cell ">{props.file.timeStamp.fileCreatedAt.split("T")[0]}</td>
      <td className=" px-4 py-3 text-sm opacity-50 hidden sm:table-cell font-bold">{formatSize(props.file.size)}</td>
      <td className=" px-4 py-3 text-right rounded-r-2xl  "><ActionMenu {...props} /></td>
    </tr>
  );
};

export const GridCard = (props) => {
  const format = props.getFileFormatData(props.file.name);
  const isImage = ["jpg", "jpeg", "png", "webp", "svg", "gif"].includes(props.getExtension(props.file.name));

  return (
    <div
      className={`  group  relative p-2 rounded-3xl border transition-all duration-300  flex flex-col justify-center
      ${props.isDarkMode
          ? "bg-gray-800/40 border-gray-700 hover:bg-gray-800 hover:border-blue-500 shadow-lg shadow-black/20"
          : "bg-white border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-300"
        }`}>


      {/* Preview Area (Image or Icon) */}

      <a
        href={`${props.BASE_URL}/file/${props.file.id}`}

        className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        {isImage ? (
          <img
            src={`${props.BASE_URL}/file/${props.file.id}`}
            alt={props.file.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-110 ${format.bg} ${format.color}`}>
            {format.icon}
          </div>
        )}

        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </a>

      {/* Info Section */}
      <div className="w-full px-1  flex justify-between items-center ">

        <div className=" flex flex-col gap-1 " >
          <a
            href={`${props.BASE_URL}/file/${props.file.id}`}
            className="text-[13px] font-bold leading-tight truncate block hover:text-blue-500 transition-colors"
            title={props.file.name}
          >
            {props.file.name.slice(0, 20)}{props.file.name.length > 20 ? "..." : ""}
          </a>

          <div className="flex  gap-1  ">
            <span className={`text-[9px]  py-0.5 rounded-md font-black uppercase tracking-tighter
            ${props.isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
              {format.type}
            </span>
            <span className="text-[10px] opacity-40 font-medium">
              {formatSize(props.file.size)}
            </span>
          </div>

        </div>

        <ActionMenu {...props} />

      </div>

    </div>
  );
};

const MenuBtn = ({ icon, label, onClick, isDarkMode, danger }) => (
  <button onClick={onClick} className={` w-full flex cursor-pointer  items-center gap-3 px-4 py-2.5 text-sm transition-all rounded-lg ${danger ? "text-red-500 hover:bg-red-500 hover:text-white" : isDarkMode ? "hover:bg-blue-600 hover:text-white" : "hover:bg-blue-50 hover:text-blue-600"}`}>
    <i className={`${icon} text-lg`}></i> {label}
  </button>
);



export default File;