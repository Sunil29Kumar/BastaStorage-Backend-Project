import SideBar from "./Components/SideBar";
import FilesFolderList from "./Components/FilesFolderList";
import {useContext, useEffect} from "react";
import {BastaStorageContext} from "./hooks/Context/ContextAPI";
import CreateFolderInputBox from "./Components/Create folder/CreateFolderInputBox";
import RenameFileInputBox from "./Components/Rename file folder/RenameFileInputBox";
import RenameFolderInputBox from "./Components/Rename file folder/RenameFolderInputBox";
import {Link, useParams} from "react-router-dom";
import FileInformation from "./Components/File Folder List/FileInformation";
import FolderInformation from "./Components/File Folder List/FolderInformation";
import AccountMenu from "./Auth/AccountMenu";
import Logout from "./Auth/Logout";
import CreateUploadFFList from "./Components/CreateUploadFFList";
import FileProgress from "./Components/progress file folder/FileProgress";
import FileUploadCancleMessage from "./Components/progress file folder/fileUploadCancleMessage";

function BastaStoreDashboard() {
  // const {dirId} = useParams();
  const {
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
  } = useContext(BastaStorageContext);

  return (
    <div className=" px-3 py-2 bg-gray-800  h-[100vh] ">
      <div className="bastaStoreContainer w-[100%] h-[100%] rounded-xl p-1 flex bg-white text-black relative  ">
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
      </div>
    </div>
  );
}

export default BastaStoreDashboard;
