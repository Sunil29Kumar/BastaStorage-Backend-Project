import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';

function GoogleDriveFiles() {
    const { googleDriveFilesData, sendDriveFilesData } = useContext(BastaStorageContext);

    return (
        <>
            <div className="flex justify-between items-center mt-6">
                <h2 className="text-lg font-semibold">Files</h2>
            </div>

            <div className=" mt-3 flex flex-wrap  items-center gap-x-4 gap-y-1">
                {googleDriveFilesData
                    .filter(file => file.mimeType !== "application/vnd.google-apps.folder")
                    .map((file, index) => (
                        <div
                            key={index}
                            // onClick={() => sendDriveFilesData(file)}
                            onClick={() => sendDriveFilesData({createdTime: file.createdTime,  mimeType: file.mimeType, name: file.name, size: file.size, thumbnailLink: file.thumbnailLink, webViewLink: file.webViewLink})}

                            // 
                            className="imgbox relative group w-[11vw] h-[15vh]  cursor-pointer rounded-md p-2 flex flex-wrap items-center border-2 border-gray-400"
                        >
                            <img
                                src={file.thumbnailLink}
                                alt={file.name.slice(0, 15)}
                                className="object-contain  "
                            />
                            <div className="absolute px-2  inset-0 bg-black/40 flex items-start justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <i
                                    onClick={() => window.open(file.webViewLink)}

                                    className="ri-eye-line text-white text-[2rem] cursor-pointer hover:text-blue-600 "></i>
                            </div>

                        </div>

                    ))}


            </div>
        </>
    );
}

export default GoogleDriveFiles;
