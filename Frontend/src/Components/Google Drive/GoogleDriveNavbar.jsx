import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { useContext } from 'react';

function GoogleDriveNavbar() {
    const { isDarkMode, setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);

    return (
        <div className=" ">

            <div className=' flex justify-between items-center mb-4 '>

                <div className=' flex justify-center items-center  '>
                    <div className=' w-[3vw] h-[3vw] '>
                        <img src='/google drive.png' />
                    </div>
                    <h1 className=' text-[2vw] text-center ' >Google Drive</h1>
                </div>

                <i
                    onClick={() => setIsGDBoxOpen(false)}
                    className={`ri-arrow-right-s-fill cursor-pointer text-[2vw] hover:scale-150 transition-all duration-300 ${isDarkMode ? "text-white " : "text-black"}`}>
                </i>

            </div>


            <div className={` googleDriveNavbar  w-full flex items-center gap-5 py-2 mb-5  ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                <Link>All</Link>
                <Link>Folder</Link>
                <Link>Files</Link>
            </div>


        </div>
    )
}

export default GoogleDriveNavbar