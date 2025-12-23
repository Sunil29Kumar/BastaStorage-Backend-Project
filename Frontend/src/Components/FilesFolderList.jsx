import TopMenu from "./TopMenu";
import Home from "./Home";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import Breadcrumb from "./Breadcrumb";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import MyFiles from "./MyFiles";
function FilesFolderList() {
  const { isDarkMode, filesList, directoriesList, isNavMinimized } = useContext(BastaStorageContext);

  const location = useLocation();
  useEffect(() => {
  }, [location]);

  return (
    <div className={`fileFolderList pb-1  ${!isNavMinimized ? "w-[85%]" : "w-[94%]"}  transition-all duration-100 ease-in-out   overflow-hidden flex flex-col gap-1 px-2 relative rounded-l-4xl  ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"}`}>
      <TopMenu />

      {location.pathname === "/" ? <Home /> : <MyFiles />}
    </div>
  );
}

export default FilesFolderList;
