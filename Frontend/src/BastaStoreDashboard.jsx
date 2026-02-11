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
import FileDeleteRenameMessage from "./Components/progress file folder/FileDeleteRenameMessage.jsx";
import DirDeleteRenameMessage from "./Components/progress file folder/DirDeleteRenameMessage.jsx";
import Notification from "./Components/Notification/Notification.jsx";
import CookieConsent from "./CookieConsent.jsx";
import FavoriteFileMessage from "./Components/progress file folder/FavoriteFileMessage.jsx";
import GoogleDriveFileProgress from "./Components/Google Drive/GoogleDriveFileProgress.jsx";


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

    isManageProfileShowing,
    isStorageFull,
    storeUserData,
    showShareFile,
    isShareLinkCopied,
    isGDBoxOpen,
    googleDriveFileLoading,
    dirUploadMessage, isClickOnNotificationBell,
  } = useContext(BastaStorageContext);

  // 1285 
  return (
    <div className={` ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} h-[100vh]`}>
      <div className="bastaStoreContainer w-[100%] h-[100%] rounded-xl  flex relative  ">
        <SideBar />
        <FilesFolderList />
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
        <FavoriteFileMessage />
        {isManageProfileShowing && <ManageUserProfile />}
        {isStorageFull && <StorageFullMessage />}
        {storeUserData?.isPasswordSet === false && <GoogleLoginSetPasswordMessage />}
        {showShareFile && <ShareFilesDashboard />}
        {isShareLinkCopied && <LinkCopiedMessage />}
        {((fileRenameMessage.message.length > 0 || fileRenameMessage.error.length > 0) || (fileDeleteMessage.message.length > 0 || fileDeleteMessage.error.length > 0)) && <FileDeleteRenameMessage />}
        {((dirRenameMessage.message.length > 0 || dirRenameMessage.error.length > 0) || (dirDeleteMessage.message.length > 0 || dirDeleteMessage.error.length > 0) || (dirUploadMessage.message.length > 0 || dirUploadMessage.error.length > 0)) && <DirDeleteRenameMessage />}
        {isClickOnNotificationBell && <Notification />}
        <GoogleDriveFileProgress />

        <CookieConsent />

      </div>
    </div>
  );


}

export default BastaStoreDashboard;
