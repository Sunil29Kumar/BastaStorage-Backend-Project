import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import GoogleDriveNavbar from "./GoogleDriveNavbar";
import GoogleDriveFiles from "./GoogleDriveFiles";
import GoogleDriveFolders from "./GoogleDriveFolders";

function GoogleDriveLayout() {

    const { setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);



    return (
        <div className="absolute left-[100%] bottom-0  w-[40vw] h-[60vh]  border-2 border-blue-400 rounded-md bg-white flex flex-col p-4 overflow-x-auto z-[1]">

            {googleDriveFilesData.length > 0 && googleDriveFilesData ?

                <>
                    <GoogleDriveNavbar />
                    <div className=' overflow-x-auto '>
                        <GoogleDriveFolders />
                        <GoogleDriveFiles />
                    </div>
                </>

                :
                <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600 text-lg">Loading Google Drive files...</p>
                </div>
            }


        </div>
    );
}

export default GoogleDriveLayout;
