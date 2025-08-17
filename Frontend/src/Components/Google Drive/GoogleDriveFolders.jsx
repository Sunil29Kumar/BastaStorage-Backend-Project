import React, { useContext } from 'react';
import { FaFolder } from 'react-icons/fa';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';

function GoogleDriveFolders() {
    const { googleDriveFilesData } = useContext(BastaStorageContext);

    return (
        <>
            {/* Folders Section */}
            <div className="flex justify-between items-center mt-4">
                <h2 className="text-lg font-semibold">Folders</h2>
            </div>

            <div className="  flex flex-wrap gap-2 mt-2">
                {googleDriveFilesData
                    .filter(file => file.mimeType === "application/vnd.google-apps.folder")
                    .map((folder, index) => (
                        <div
                            key={folder.id || index}
                            onClick={() => window.open(folder.webViewLink)}
                            className=" p-2 cursor-pointer rounded-md border-2 border-gray-100 flex justify-center items-center gap-3  "
                        >
                            <FaFolder className="text-yellow-500 text-[2vw]  " />
                            <p className=" ">{folder.name.length > 10 ? folder.name.slice(0, 10) + "..." : folder.name}</p>
                        </div>
                    ))}
            </div>
        </>
    );
}

export default GoogleDriveFolders;
