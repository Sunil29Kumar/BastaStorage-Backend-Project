import { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { FaFolderPlus, FaTimes } from "react-icons/fa";

function CreateFolderInputBox() {
  const {
    isDarkMode,
    handleCreateDirectory,
    setNewDirname,
    newDirname,
    setShowInputBox,
  } = useContext(BastaStorageContext);

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal */}
      <div
        className={`
          w-[420px] rounded-2xl p-6 shadow-xl
          ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-blue-100"
              }`}
            >
              <FaFolderPlus className="text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold">Create folder</h2>
          </div>

          <button
            onClick={() => setShowInputBox(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateDirectory} className="space-y-5">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Folder name
            </label>
            <input
              type="text"
              placeholder="Untitled folder"
              value={newDirname}
              onChange={(e) => setNewDirname(e.target.value)}
              autoFocus
              className={`
                w-full px-4 py-2 rounded-lg border text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-800"}
              `}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowInputBox(false)}
              className={`
                px-4 py-2 rounded-lg text-sm
                ${isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"}
              `}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!newDirname.trim()}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFolderInputBox;
