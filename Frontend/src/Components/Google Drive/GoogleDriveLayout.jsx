import { Link, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import GoogleDriveNavbar from "./GoogleDriveNavbar";
import GoogleDriveFiles from "./GoogleDriveFiles";
import GoogleDriveFolders from "./GoogleDriveFolders";
import GoogleDriveFileProgress from "./GoogleDriveFileProgress";

function GoogleDriveLayout() {

    const { isDarkMode, setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);
    const [activeTab, setActiveTab] = useState('All');


    return (
        <div className={` flex flex-col gap-5 p-4 mt-2 rounded-b-4xl rounded-t-2xl overflow-x-auto h-full  ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black "}`}>

            {googleDriveFilesData.length > 0 && googleDriveFilesData ?

                <>
                    <GoogleDriveFileProgress />
                    <GoogleDriveNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className=' overflow-x-auto flex flex-col gap-3 '>
                        {activeTab === "All" ?
                            <>
                                <GoogleDriveFolders />
                                <GoogleDriveFiles />
                            </>
                            : activeTab === "Folder" ? (
                                <GoogleDriveFolders />
                            ) : (
                                <GoogleDriveFiles />
                            )
                        }
                    </div>
                </>

                :
                <div className=" flex flex-col items-center justify-center h-full p-10 ">

                    {/* Close Button - Top Left */}
                    <Link to={"/my-files"}
                        onClick={() => setIsGDBoxOpen(false)}
                        className={` p-3 rounded-2xl transition-all active:scale-90 ${isDarkMode ? "bg-white/5 text-white hover:bg-white/10" : " text-black hover:bg-gray-200"
                            }`}
                    >
                        <i className="ri-arrow-left-line text-md"></i>Back to My Files
                    </Link>

                    {/* Main Animated Logo Container */}
                    <div className="relative flex items-center justify-center ">

                        {/* Outer Ripples */}
                        <div className="absolute w-32 h-32 bg-blue-500/20 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute w-24 h-24 bg-blue-400/10 rounded-full animate-pulse delay-700"></div>

                        {/* Spinning Border */}
                        <div className="w-20 h-20 rounded-3xl border-4 border-dashed border-blue-500/30 animate-[spin_10s_linear_infinite]"></div>

                        {/* Center Icon */}
                        <div className="absolute w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden animate-bounce">
                            <img
                                src='/google drive.png'
                                alt="GD"
                                className="w-8 h-8 object-contain"
                            />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col items-center gap-2">
                        <h3 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            Syncing Drive
                        </h3>

                        {/* Animated Dots/Progress Bar */}
                        <div className="flex gap-1.5 mb-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></span>
                        </div>

                        <p className={`text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 max-w-[200px] text-center leading-relaxed`}>
                            Establishing secure connection to cloud storage
                        </p>
                    </div>

                    {/* Subtle Background Glow */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                </div>
            }


        </div>
    );
}

export default GoogleDriveLayout;
