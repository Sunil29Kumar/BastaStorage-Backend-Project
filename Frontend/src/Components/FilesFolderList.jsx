import TopMenu from "./TopMenu";
import Home from "./Home";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import MyDrive from "./MyDrive";
import Breadcrumb from "./Breadcrumb";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
function FilesFolderList() {
  const { isDarkMode, filesList, directoriesList } = useContext(BastaStorageContext);

  const location = useLocation();
  useEffect(() => {
  }, [location]);

  return (
    <div className="fileFolderList  w-[85%] overflow-hidden flex flex-col gap-4 px-4 relative  ">
      <TopMenu />
      <h3 className={` font-bold text-[1.5vw]  ${isDarkMode ? "text-white" : "text-gray-600"}`}>
        <Breadcrumb />
      </h3>
      {location.pathname == "/my-drive" ? <MyDrive /> : <Home />}
    </div>
  );
}

export default FilesFolderList;
