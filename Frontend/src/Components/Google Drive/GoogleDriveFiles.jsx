import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';

function GoogleDriveFiles() {
    const { isDarkMode, googleDriveFilesData, sendDriveFilesData, googleDriveFileLoading } = useContext(BastaStorageContext);

    return (
        <>

            {!googleDriveFileLoading ?
                <>
                    <div className="flex justify-between items-center mt-6">
                        <h2 className="text-lg font-semibold">Files</h2>
                    </div>

                    <div className=" mt-3 flex flex-wrap  items-center gap-2">
                        {googleDriveFilesData
                            .filter(file => file.mimeType !== "application/vnd.google-apps.folder")
                            .map((file, index) => (
                                <div
                                    key={index}
                                    // onClick={() => sendDriveFilesData(file)}
                                    onClick={() => sendDriveFilesData({ id: file.id, createdTime: file.createdTime, mimeType: file.mimeType, name: file.name, size: file.size, thumbnailLink: file.thumbnailLink, webViewLink: file.webViewLink })}

                                    // 
                                    className={`imgbox relative group w-[15vw] h-[25vh]  cursor-pointer rounded-md p-2 flex flex-wrap items-center  ${isDarkMode ? "bg-gray-800" : "bg-blue-50"} `}
                                >
                                    <img
                                        src={file.thumbnailLink}
                                        alt={file.name.slice(0, 15)}
                                        className="object-contain w-full h-full   "
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

                :
                <div className="flex justify-center items-center gap-2 h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <p className={`${isDarkMode ? "text-white " : "text-black"} text-lg`}>Sending Google Drive file to BastaStorage</p>
                </div>
            }

        </>
    );
}

export default GoogleDriveFiles;
