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
function FilesFolderList() {
  const { isDarkMode, isNavMinimized } = useContext(BastaStorageContext);

  const location = useLocation();

  const components = {
    "/": <Home />,
    "/storageOverview": <StorageOverview />,
    "/storageAnalytics": <StorageAnalytics />,
    "/help-support": <HelpSupport />,
    "/settings": <Settings />
  };

  const CurrentComponent = components[location.pathname] || <MyFiles />;

  return (
    <div className={`fileFolderList pb-1  ${!isNavMinimized ? "w-[85%]" : "w-[94%]"}  transition-all duration-100 ease-in-out   overflow-hidden flex flex-col gap-1 px-2 relative rounded-l-4xl  ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}>
      <TopMenu />

      {CurrentComponent}

    </div>
  );
}

export default FilesFolderList;
