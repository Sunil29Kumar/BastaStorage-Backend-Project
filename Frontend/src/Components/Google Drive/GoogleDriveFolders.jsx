import React, { useContext } from 'react';
import { FaFolder } from 'react-icons/fa';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';

function GoogleDriveFolders() {
    const {isDarkMode, googleDriveFilesData } = useContext(BastaStorageContext);

    return (
        <>
            {/* Folders Section */}
            <div className="flex justify-between items-center mt-4">
                <h2 className="text-lg font-semibold">Folders</h2>
            </div>

            <div className="  flex flex-wrap gap-3 mt-2">
                {googleDriveFilesData
                    .filter(file => file.mimeType === "application/vnd.google-apps.folder")
                    .map((folder, index) => (
                        <div
                            key={folder.id || index}
                            onClick={() => window.open(folder.webViewLink)}
                            className={` px-3  py-2 cursor-pointer rounded-md  flex justify-center items-center gap-4    ${isDarkMode ? "bg-gray-800  hover:bg-gray-900 " : "bg-white  hover:bg-blue-50 "}`}
                        >
                            <FaFolder className="text-yellow-500 text-[3vw]  " />
                            <p className=" ">{folder.name.length > 15 ? folder.name.slice(0, 15) + "..." : folder.name}</p>
                        </div>
                    ))}
            </div>
        </>
    );
}

export default GoogleDriveFolders;
