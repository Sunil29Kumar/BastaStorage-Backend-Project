import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI'
import RenameFileInputBox from '../Rename file folder/RenameFileInputBox'

function PrivateShareFileViewer() {

  const { renameFile, setShowFileRenameInputBox, showFileRenameInputBox,removeSharedUser } = useContext(BastaStorageContext)

  const { fileId, token } = useParams()
  const [fileData, setFileData] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  console.log(fileData);
  

  // fetch file data from backend
  async function privateShare() {
    try {
      const response = await fetch(
        `http://localhost:2000/file/${fileId}/share/private/${token}`,
        { credentials: "include" }
      )
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        setFileData(data.fileData)
        setMessage(data.message)
        setError(null)
      }
      if (response.status === 404 || response.status === 403 || response.status === 401) {
        setError(data.error)
        setFileData(null)
        setMessage(null)
      }

    } catch (error) {
      console.error("Error fetching file:", error)
    }
  }

  useEffect(() => {
    privateShare()
  }, [token, fileId])


  const renderPreview = () => {
    if (error) return <p className="text-red-500 text-4xl ">{error}</p>
    else if (!fileData) return <p>Loading...</p>
    else if (fileData?.type.startsWith("image/")) {
      return (
        <img
          src={fileData.viewUrl}
          alt={fileData.name}
          className="w-full h-[100vh] object-contain "
        />
      )
    }

    else if (fileData?.type === "application/pdf") {
      return (
        <iframe
          src={fileData.viewUrl}
          title={fileData.name}
          className="w-full h-screen"
          style={{ border: "none" }}
        />
      )
    }

    else if (fileData?.type.startsWith("video/")) {
      return (
        <video controls className="w-full h-[100vh]">
          <source src={fileData.viewUrl} type={fileData.type} />
          Your browser does not support the video tag.
        </video>
      )
    }

    else if (fileData?.type.startsWith("audio/")) {
      return (
        <audio controls className="w-full h-[100vh]l">
          <source src={fileData.viewUrl} type={fileData.type} />
          Your browser does not support the audio element.
        </audio>
      )
    }

    return (
      <div className="flex flex-col items-center text-gray-600">
        <span className="text-6xl">📄</span>
        <p className="mt-2">Preview not available</p>
      </div>
    )
  }

  return (
    <div className=" relative h-[100vh] w-full flex items-center justify-center p-4">
      {renderPreview()}
      {showFileRenameInputBox && (
        <RenameFileInputBox />
      )}
      <div className=''>
        {fileData?.permission !== "View" && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className=' absolute right-5 top-2  cursor-pointer text-xl font-bold p-2 rounded-full ' >:</button>
        )}
        {/* menu  */}
        {showMenu && (
          <div className='absolute right-10 top-10  w-[10vw]  bg-gray-300 rounded-md px-3 py-2 '>
            {fileData?.permission !== "View" && (
              <ul className=' text-[1.5vw] cursor-pointer flex flex-col gap-3 '>
                <li
                  onClick={() => {
                    renameFile(fileId, fileData.name);
                    setShowFileRenameInputBox(true);
                  }}
                >Rename File</li>
                <li
                  onClick={() => {
                    removeSharedUser(fileId,fileData.userId );
                  }}
                >Delete</li>

              </ul>
            )}
          </div>
        )}
      </div >
    </div>
  )
}

export default PrivateShareFileViewer
