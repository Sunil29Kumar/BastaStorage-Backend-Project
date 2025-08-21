import React from 'react'
import { useContext } from 'react'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI'
import GoogleDriveFilesFolderList from './GoogleDriveLayout';

function GoogleDrive() {
    const { googleDriveFiles, setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);
    return (
        <div className=' relative '>
            {googleDriveFilesData.length == 0 ?
                <div onClick={() => {
                    googleDriveFiles()
                    setIsGDBoxOpen(true)
                }}
                    className=' w-[3vw] h-[3vw]  cursor-pointer '
                ><img src='/google drive.png' /></div>

                : <div> <div onClick={() => {
                    setIsGDBoxOpen(true)
                }}
                    className=' w-[3vw] h-[3vw]  cursor-pointer '
                ><img src='/google drive.png' /></div></div>}

        </div>
    )
}

export default GoogleDrive