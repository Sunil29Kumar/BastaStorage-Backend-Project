import SideBar from "./Components/SideBar";
import FilesFolderList from "./Components/FilesFolderList";
import { useContext, useEffect } from "react";
import { BastaStorageContext } from "./hooks/Context/ContextAPI";
import CreateFolderInputBox from "./Components/Create folder/CreateFolderInputBox";
import RenameFileInputBox from "./Components/Rename file folder/RenameFileInputBox";
import RenameFolderInputBox from "./Components/Rename file folder/RenameFolderInputBox";
import { Link, useParams } from "react-router-dom";
import FileInformation from "./Components/File Folder List/FileInformation";
import FolderInformation from "./Components/File Folder List/FolderInformation";
import AccountMenu from "./Auth/AccountMenu";
import Logout from "./Auth/Logout";
import CreateUploadFFList from "./Components/CreateUploadFFList";
import FileProgress from "./Components/progress file folder/FileProgress";
import FileUploadCancleMessage from "./Components/progress file folder/fileUploadCancleMessage";
import ManageUserProfile from "./Auth/ManageUserProfile.jsx";
import StorageFullMessage from "./Components/Total Storage/StorageFullMessage.jsx";
import GoogleLoginSetPasswordMessage from "./Auth/GoogleLoginSetPasswordMessage.jsx";
import ShareFilesDashboard from "./Components/Share files/ShareFilesDashboard.jsx";
import LinkCopiedMessage from "./Components/Share files/LinkCopiedMessage.jsx";
import GoogleDriveLayout from "./Components/Google Drive/GoogleDriveLayout.jsx";
import MyFiles from "./Components/MyFiles.jsx";
import FileDeleteRenameMessage from "./Components/progress file folder/FileDeleteRenameMessage.jsx";
import DirDeleteRenameMessage from "./Components/progress file folder/DirDeleteRenameMessage.jsx";
import StorageOverview from "./Components/Total Storage/StorageOverview .jsx";


function BastaStoreDashboard() {
  // const {dirId} = useParams();
  const {
    isDarkMode,
    showInputBox,
    showFileRenameInputBox,
    showFolderRenameInputBox,
    showFileInfo,
    showFolderInfo,
    accountMenu,
    showLogOutBox,
    showFileFolderMenu,
    isFileInProgress,
    fileRenameMessage, fileDeleteMessage,
    dirRenameMessage, dirDeleteMessage,
    isFileUploaded,
    isFileUploadingCancle,
    isManageProfileShowing,
    isStorageFull,
    storeUserData,
    showShareFile,
    isShareLinkCopied,
    isGDBoxOpen,
    dirUploadMessage
  } = useContext(BastaStorageContext);


  return (
    <div className={` ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} h-[100vh]`}>
      <div className="bastaStoreContainer w-[100%] h-[100%] rounded-xl  flex relative  ">
        <SideBar />
        <FilesFolderList />
        {isGDBoxOpen && <GoogleDriveLayout />}
        {showInputBox && <CreateFolderInputBox />}
        {showFileRenameInputBox && <RenameFileInputBox />}
        {showFolderRenameInputBox && <RenameFolderInputBox />}
        {showFileInfo && <FileInformation />}
        {showFolderInfo && <FolderInformation />}
        {accountMenu && <AccountMenu />}
        {showLogOutBox && <Logout />}
        {showFileFolderMenu && <CreateUploadFFList />}
        {isFileInProgress && <FileProgress />}
        <FileUploadCancleMessage />
        {isManageProfileShowing && <ManageUserProfile />}
        {isStorageFull && <StorageFullMessage />}
        {storeUserData?.isPasswordSet === false && <GoogleLoginSetPasswordMessage />}
        {showShareFile && <ShareFilesDashboard />}
        {isShareLinkCopied && <LinkCopiedMessage />}
        {((fileRenameMessage.message.length > 0 || fileRenameMessage.error.length > 0) || (fileDeleteMessage.message.length > 0 || fileDeleteMessage.error.length > 0)) && <FileDeleteRenameMessage />}
        {((dirRenameMessage.message.length > 0 || dirRenameMessage.error.length > 0) || (dirDeleteMessage.message.length > 0 || dirDeleteMessage.error.length > 0) || (dirUploadMessage.message.length > 0 || dirUploadMessage.error.length > 0)) && <DirDeleteRenameMessage />}

      </div>
    </div>
  );
}

export default BastaStoreDashboard;
