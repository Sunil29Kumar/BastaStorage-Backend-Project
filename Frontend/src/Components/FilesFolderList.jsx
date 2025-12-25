import TopMenu from "./TopMenu";
import Home from "./Home";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import Breadcrumb from "./Breadcrumb";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import MyFiles from "./MyFiles";
import StorageOverview from "./Total Storage/StorageOverview ";
import StorageAnalytics from "./Total Storage/StorageAnalytics";
function FilesFolderList() {
  const { isDarkMode, isNavMinimized } = useContext(BastaStorageContext);

  const location = useLocation();

  const components = {
    "/": <Home />,
    "/storageOverview": <StorageOverview />,
    "/storageAnalytics": <StorageAnalytics />,
  };

  const CurrentComponent = components[location.pathname] || <MyFiles />;

  return (
    <div className={`fileFolderList pb-1  ${!isNavMinimized ? "w-[85%]" : "w-[94%]"}  transition-all duration-100 ease-in-out   overflow-hidden flex flex-col gap-1 px-2 relative rounded-l-4xl  ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"}`}>
      <TopMenu />

      {CurrentComponent}
      {/* {location.pathname === "/" ? <Home /> : location.pathname === "/storageOverview" ? <StorageOverview /> : location.pathname === "/storageAnalytics" ? <StorageAnalytics /> : <MyFiles />} */}
    </div>
  );
}

export default FilesFolderList;
