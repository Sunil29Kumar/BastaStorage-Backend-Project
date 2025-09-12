
import { useContext } from 'react'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI'

function GoogleDrive() {
    const { isDarkMode, setShowFileFolderMenu, googleDriveFiles, setIsGDBoxOpen, googleDriveFilesData } = useContext(BastaStorageContext);
    return (

        googleDriveFilesData.length == 0 ? (
            <div
                onClick={() => {
                    googleDriveFiles()
                    setIsGDBoxOpen(true)
                    setShowFileFolderMenu(false)
                }} className={`relative  cursor-pointer ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                <div className=' w-[3vw] h-[3vw]  cursor-pointer '>
                    <img src='/google drive.png' />
                </div>
            </div>)
            :
            (<div
                onClick={() => {
                    setIsGDBoxOpen(true)
                    setShowFileFolderMenu(false)
                }}
                className={`relative  cursor-pointer ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                <div>
                    <div className=' w-[3vw] h-[3vw]  cursor-pointer '>
                        <img src='/google drive.png' /></div>
                </div>
            </div>)


    )
}

export default GoogleDrive