import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import GoogleDriveNavbar from "./GoogleDriveNavbar";
import GoogleDriveFiles from "./GoogleDriveFiles";
import GoogleDriveFolders from "./GoogleDriveFolders";

function GoogleDriveLayout() {

    const { isDarkMode, setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);



    return (
        <div className={`absolute left-[100%] bottom-0  w-[50vw] h-[65vh]    rounded-md  flex flex-col p-4 overflow-x-auto z-[1] ${isDarkMode ? "bg-gray-900 text-white border-l-2 border-blue-400" : "bg-white text-black border-2 border-blue-400"}`}>

            {googleDriveFilesData.length > 0 && googleDriveFilesData ?

                <>
                    <GoogleDriveNavbar />
                    <div className=' overflow-x-auto '>
                        <GoogleDriveFolders />
                        <GoogleDriveFiles />
                    </div>
                </>

                :
                <div className=" relative flex flex-col items-center justify-center h-full gap-3">
                    <i
                        onClick={() => setIsGDBoxOpen(false)}
                        className={`ri-close-large-fill cursor-pointer absolute top-0 left-0 text-[2vw] hover:scale-150 transition-all duration-300 ${isDarkMode ? "text-white " : "text-black"}`}>
                    </i>
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <p className={`${isDarkMode ? "text-white " : "text-black"} text-lg`}>Loading Google Drive files...</p>
                </div>
            }


        </div>
    );
}

export default GoogleDriveLayout;
