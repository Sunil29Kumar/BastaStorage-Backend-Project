import {useContext} from "react";
import {BastaStorageContext} from "../../hooks/Context/ContextAPI";

function CreateFolderInputBox() {
  const {handleCreateDirectory, setNewDirname, newDirname, setShowInputBox} =
    useContext(BastaStorageContext);

  return (
    <div className=" w-[30vw] rounded-md border-2 border-blue-200 bg-gray-100 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-5 flex flex-col gap-5 ">
      <div className=" flex justify-between ">
        <h1 className=" text-[2vw] ">Create Folder</h1>
        <button
          onClick={() => setShowInputBox(false)}
          className=" cursor-pointer "
        >
          <i className="ri-close-large-line"></i>
        </button>
      </div>
      {/* FORM  */}
      <form onSubmit={handleCreateDirectory} className=" flex gap-5 flex-col ">
        <div>
          <input
            type="text"
            onChange={(e) => setNewDirname(e.target.value)}
            value={newDirname}
            className=" border-2 border-black w-[100%] py-2 px-1 "
          />
        </div>
        <div className=" flex gap-5 justify-end ">
          <button
            onClick={() => setShowInputBox(false)}
            className=" cursor-pointer text-blue-400 "
          >
            Cancle
          </button>
          <input
            type="submit"
            className=" cursor-pointer bg-blue-500 py-1 px-3 rounded-md"
            value={"Ok"}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateFolderInputBox;
