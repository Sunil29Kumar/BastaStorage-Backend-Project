import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { useContext } from 'react';

function GoogleDriveNavbar() {
    const { setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);

    return (
        <div className="  pb-4 ">
            <div className=" flex gap-2 ">
                <button
                    onClick={() => setIsGDBoxOpen(false)}
                    className="  text-black text-[1rem] px-2 border-2 rounded-[100%] cursor-pointer ">X</button>
                <h1>Google Drive</h1>
            </div>
            <div className="flex justify-center items-center gap-3  ">
                <Link to="" className="text-blue-400 border-b-2 border-blue-400 ">
                    All
                </Link>
                <Link to="" className="hover:text-blue-700">Folders</Link>
                <Link to="" className="hover:text-blue-700">Files</Link>
            </div>

        </div>
    )
}

export default GoogleDriveNavbar