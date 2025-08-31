import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { useContext } from 'react';

function GoogleDriveNavbar() {
    const { isDarkMode, setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);

    return (
        <div className=" flex  justify-center items-center gap-5 mb-3">
            <i
                onClick={() => setIsGDBoxOpen(false)}
                className={`ri-close-large-fill cursor-pointer text-[2vw] hover:scale-150 transition-all duration-300 ${isDarkMode ? "text-white " : "text-black"}`}>
            </i>
            <div className=' flex justify-center items-center  '>
                <div className=' w-[3vw] h-[3vw] '>
                    <img src='/google drive.png' />
                </div>
                <h1 className=' text-[2vw] text-center ' >Google Drive</h1>
            </div>


        </div>
    )
}

export default GoogleDriveNavbar