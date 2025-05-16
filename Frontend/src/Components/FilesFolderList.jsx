import TopMenu from "./TopMenu";
import Home from "./Home";
import {useLocation, useParams} from "react-router-dom";
import {useEffect} from "react";
import MyDrive from "./MyDrive";
function FilesFolderList() {
  const location = useLocation();
  useEffect(() => {
    console.log(location);
  }, [location]);
  return (
    <div className="fileFolderList  w-[85%] overflow-hidden flex flex-col gap-4 px-4 relative  ">
      <TopMenu />
      {location.pathname == "/my-drive" ? <MyDrive /> : <Home />}
    </div>
  );
}

export default FilesFolderList;
