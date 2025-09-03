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
    isFileUploaded,
    isFileUploadingCancle,
    isManageProfileShowing,
    isStorageFull,
    storeUserData,
    showShareFile
  } = useContext(BastaStorageContext);


  return (
    <div className={`px-3 py-2  ${isDarkMode ? "bg-black text-white" : "bg-blue-50 text-black"} h-[100vh]`}>
      <div className="bastaStoreContainer w-[100%] h-[100%] rounded-xl p-1 flex   relative  ">
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
        {isManageProfileShowing && <ManageUserProfile />}
        {isStorageFull && <StorageFullMessage />}
        {storeUserData?.isPasswordSet === false && <GoogleLoginSetPasswordMessage />}
        {showShareFile && <ShareFilesDashboard />}

      </div>
    </div>
  );
}

export default BastaStoreDashboard;
