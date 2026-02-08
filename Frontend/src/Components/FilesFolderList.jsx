import TopMenu from "./TopMenu";
import Home from "./Home";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import Breadcrumb from "./Breadcrumb";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import MyFiles from "./MyFiles";
import StorageOverview from "./Total Storage/StorageOverview ";
import StorageAnalytics from "./Total Storage/StorageAnalytics";
import HelpSupport from "./Help and support/HelpSupport";
import Settings from "./Settings/Settings";
import RecentFiles from "./RecentFiles";
import Favorites from "./Favorites";
import GoogleDriveLayout from "./Google Drive/GoogleDriveLayout";
function FilesFolderList() {
  const { isDarkMode, isNavMinimized, windowWidth } = useContext(BastaStorageContext);

  const location = useLocation();

  const components = {
    "/home": <Home />,
    "/recent-files": <RecentFiles />,
    "/my-file/google-drive": <GoogleDriveLayout />,
    "/favorites": <Favorites />,
    "/storageOverview": <StorageOverview />,
    "/storageAnalytics": <StorageAnalytics />,
    "/help-support": <HelpSupport />,
    "/settings": <Settings />
  };

  const CurrentComponent = components[location.pathname] || <MyFiles />;

  let dashboardWidth = "w-[83%]  left-[17%]"
  if (isNavMinimized && windowWidth > 1285) {
    dashboardWidth = "w-[92%] left-[8%]"
  }
  if (isNavMinimized && windowWidth < 1285 && windowWidth >= 1000) {
    dashboardWidth = "w-[91%] left-[9%] ";
  }
  else {
    if (windowWidth < 1285 && windowWidth >= 1000) {
      dashboardWidth = "w-[77%] left-[23%]"
    }
    if (windowWidth < 1000) {
      dashboardWidth = "w-[100%] left-0"
    }
  }

  return (
    <div className={`fileFolderList  ${windowWidth <= 1285 ? "p-3" : " py-1  px-2  "}  absolute  top-[0%] bottom-0 ${dashboardWidth}  transition-all duration-100 ease-in-out   overflow-hidden flex flex-col gap-1 ${windowWidth >= 1000 ? " rounded-l-4xl" : ""}  ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}>
      <TopMenu />

      {CurrentComponent}

    </div>
  );
}

export default FilesFolderList;
