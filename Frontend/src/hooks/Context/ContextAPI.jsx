import { createContext } from "react";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BastaStorageContext = createContext();

function ContextAPI({ children }) {
  const BASE_URL = "http://localhost:2000";
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);

  const [newFilename, setNewFilename] = useState("");
  const [newDirname, setNewDirname] = useState("");
  const { dirId } = useParams();
  const navigate = useNavigate();

  // file FileProgress
  const [FileProgress, setFileProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const [isFileInProgress, setIsFileInProgress] = useState(false);
  const [fileUplodingRemainingTime, setFileUploadingRemainingTime] =
    useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isFileUploadingCancle, setIsFileUploadingCancle] = useState(false);

  // get current folder name
  const [currentFolderName, setCurrentFolderName] = useState("");

  const [showInputBox, setShowInputBox] = useState(false);

  // show file and folder rename box
  const [showFileRenameInputBox, setShowFileRenameInputBox] = useState(false);
  const [showFolderRenameInputBox, setShowFolderRenameInputBox] =
    useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // file informatino or show file information states
  const [fileInfo, setFileInfo] = useState([]);
  const [showFileInfo, setShowFileInfo] = useState(false);

  // folder information or show folder information states
  const [folderInfo, setFolderInfo] = useState([]);
  const [showFolderInfo, setShowFolderInfo] = useState(false);

  // show file folder menu after click on  + new
  const [showFileFolderMenu, setShowFileFolderMenu] = useState(false);

  // Register request
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorRegister, setErrorRegister] = useState({});
  const [registerLimiterError, setRegisterLimiterError] = useState("");

  // Login request
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // fetch LOGIN DATA : fetch user Data after login
  const [storeUserData, setStoreUserData] = useState();

  // logOut states
  const [showLogOutBox, setShowLogOutBox] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const randomRGBcolor = `rgb(${r},${g},${b})`;
  const [randomAccountBGcolor, setRandomAccountBGcolor] =
    useState(randomRGBcolor);

  // get OPT

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpCountDown, setOtpCountDown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const [sentOtpMessage, setSentOtpMessage] = useState("");
  const [isOtpWrong, setIsOtpWrong] = useState(true);
  // verify otp
  const [isVerifyOtpWrong, setIsVerifyOtpWrong] = useState(true);
  const [verifyOtpMessage, setVerifyOtpMessage] = useState("");

  // otp limiter error 
  const [otpLimiterError, setOtpLimiterError] = useState("");

  //                                                 --------------------------------
  //                                  main code starrt
  // ---------------------------------

  // GET Request file and dir
  async function getDirectoryItems() {
    const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
      credentials: "include",
    });
    const data = await response.json();
    if (response.status == 401) {
      navigate("/Register");
    }

    setDirectoriesList(data.directories);
    setFilesList(data.files);

    console.log(dirId);
  }
  useEffect(() => {
    getDirectoryItems();
  }, [dirId]);

  // upload file
  const xhrRef = useRef(null);
  async function uploadFile(e) {
    const file = e.target.files[0];
    setCurrentFileName(file.name);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    const uploadStartTime = new Date().getTime();
    xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`, true);

    xhr.setRequestHeader("filename", file.name);
    xhr.withCredentials = true;
    xhr.setRequestHeader("size", file.size);
    xhr.addEventListener("load", () => {
      getDirectoryItems();
      setIsFileUploadingCancle(false);
      setTimeout(() => {
        setIsFileUploaded(true);
        setIsFileInProgress(false);
        setCurrentFileName("");
        setFileProgress(0);
      }, 1000);
    });
    xhr.upload.addEventListener("progress", (e) => {
      const currentTime = new Date().getTime();
      const timeElapsed = (currentTime - uploadStartTime) / 1000; // in second
      const uploadSpeed = e.loaded / timeElapsed;
      const remainingBytes = e.total - e.loaded;
      const remainingTime = remainingBytes / uploadSpeed;
      const totalFileProgress = (e.loaded / e.total) * 100; // total percentage %

      setFileProgress(totalFileProgress.toFixed(2));
      setFileUploadingRemainingTime(remainingTime.toFixed(1));
      setIsFileInProgress(true);
    });
    xhr.send(file);
  }

  // cancle uploading
  function cancleUpload() {
    if (xhrRef.current && xhrRef.current.readyState !== XMLHttpRequest.DONE) {
      xhrRef.current.abort();
      console.log("Upload cancelled.");
      setIsFileUploaded(false);

      setTimeout(() => {
        setIsFileUploadingCancle(true);
        setIsFileInProgress(false);
        setCurrentFileName("");
        setFileProgress(0);
        setFileUploadingRemainingTime(0);
      }, 1000);
    }
  }

  // delete file
  async function handleDeleteFile(fileId) {
    const response = await fetch(`${BASE_URL}/file/${fileId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    await getDirectoryItems();
  }

  // delete directroy
  async function handleDeleteDirectory(directoryId) {
    const response = await fetch(`${BASE_URL}/directory/${directoryId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    getDirectoryItems();
  }

  // rename file , directory
  async function renameFile(id, oldFilename) {
    console.log("Renaming folder with ID:", id, "and name:", oldFilename);
    setNewFilename(oldFilename);
    setSelectedId(id);
  }

  // save rename file
  async function saveFilename(e) {
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/file/${selectedId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newFilename }),
    });
    const data = await response.json();
    console.log(data);
    setNewFilename("");
    setSelectedId(null);
    setShowFileRenameInputBox(false);
    await getDirectoryItems();
  }

  // save rename directory
  async function saveDirectory(e) {
    e.preventDefault();
    const response = await fetch(`${BASE_URL}/directory/${selectedId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newDirName: newFilename }),
    });
    const data = await response.json();
    console.log(data);
    setNewFilename("");
    setSelectedId(null);
    setShowFolderRenameInputBox(false);
    await getDirectoryItems();
  }

  // create directory
  async function handleCreateDirectory(e) {
    e.preventDefault();
    const url = `${BASE_URL}/directory/${dirId || ""}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        dirname: newDirname,
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    setNewDirname("");
    setShowInputBox(false);
    await getDirectoryItems();
  }

  // Register Post Request
  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...registerData, otp }),
      });
      const data = await response.json();
      setErrorRegister({
        error: data,
      });
      if (data.statusCode === 429) {
        setRegisterLimiterError(data.error);
      }
      else if (data.details) {
        setErrorRegister({
          errorDescription:
            data.details.errInfo.details.schemaRulesNotSatisfied[0]
              .propertiesNotSatisfied[0].description,
          errorFieldName:
            data.details.errInfo.details.schemaRulesNotSatisfied[0]
              .propertiesNotSatisfied[0].propertyName,
        });
      } else if (data.error == "Email is already in use") {
        setErrorRegister({
          error: data.error,
        });
      }
      else {
        console.log(data);
        navigate("/Login");
        setRegisterData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // login user
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ login success — now fetch user data
        const res = await fetch(`${BASE_URL}/user`, {
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          setStoreUserData(userData); // 🎯 set in context
          setLoggedIn(true); // 🎯 set login flag
          await getDirectoryItems(); // 🎯 fetch directory data also
          navigate("/");
        } else {
          console.error("User data fetch failed");
        }
      } else {
        setLoginError(data.error);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  }

  // get / fetch user data after login
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${BASE_URL}/user`, {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setStoreUserData(userData);
          setLoggedIn(true);
          await getDirectoryItems();
        } else {
          setLoggedIn(false);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserData();
  }, []);

  // get Logout request
  async function handleLogout() {
    const response = await fetch(`${BASE_URL}/user/logout`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    setLoggedIn(false);
    navigate("/");
    getDirectoryItems();
  }

  // logout form all device
  async function logoutFromAllDevice() {
    const response = await fetch(`${BASE_URL}/user/logoutAllDevice`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    setLoggedIn(false);
    navigate("/");
    getDirectoryItems();
  }

  // get OPT
  async function sendOPT(email) {
    try {
      const response = await fetch(`${BASE_URL}/auth/sendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data.message);
      if (data.statusCode === 429) {
        setOtpLimiterError(data.error);
        setSentOtpMessage("");

      }
      if (response.ok) {
        setSentOtpMessage(data.message);
        setOtpSent(true);
        setOtpError("");
        setOtpLimiterError();
        setIsOtpWrong(false);
      }

      else {
        setOtpSent(false);
        setOtpError(data.error);
        setIsOtpWrong(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // verify opt
  async function verifyUserOtp({ email, otp }) {
    const response = await fetch(`${BASE_URL}/auth/verifyOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (response.ok) {
      setIsVerifyOtpWrong(false);
      setVerifyOtpMessage(data.message);
    } else {
      setIsVerifyOtpWrong(true);
      setVerifyOtpMessage(data.error);
    }
    console.log(data);
  }


  // Login with Google 
  async function loginWithGoogle(credential) {
    const response = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential })
    })
    const data = await response.json();
    if (response.ok) {
      // ✅ login success — now fetch user data
      const res = await fetch(`${BASE_URL}/user`, {
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        setStoreUserData(userData); // 🎯 set in context
        setLoggedIn(true); // 🎯 set login flag
        await getDirectoryItems(); // 🎯 fetch directory data also
        navigate("/");
      } else {
        console.error("User data fetch failed");
      }
    } else {
      setLoginError(data.error);
    }
    return data;
  }



  // Login with Github 
  const loginWithGithub = () => {
    window.location.href = `http://localhost:2000/auth/github`;
  }



  return (
    <BastaStorageContext.Provider
      value={{
        BASE_URL,
        directoriesList,
        setDirectoriesList,
        filesList,
        setFilesList,
        FileProgress,
        setFileProgress,
        newFilename,
        setNewFilename,
        newDirname,
        setNewDirname,
        dirId,
        showInputBox,
        setShowInputBox,
        showFileRenameInputBox,
        setShowFileRenameInputBox,
        showFolderRenameInputBox,
        setShowFolderRenameInputBox,
        selectedId,
        setSelectedId,
        fileInfo,
        setFileInfo,
        showFileInfo,
        setShowFileInfo,
        folderInfo,
        setFolderInfo,
        showFolderInfo,
        setShowFolderInfo,
        showLogOutBox,
        setShowLogOutBox,
        accountMenu,
        setAccountMenu,
        storeUserData,
        setStoreUserData, 
        // register 
        registerData,
        setRegisterData,
        errorRegister,
        setErrorRegister,
        registerLimiterError,
        // login 
        loginData,
        setLoginData,
        loginError,
        setLoginError,
        loggedIn,
        setLoggedIn,
        currentFolderName,
        setCurrentFolderName,
        showFileFolderMenu,
        setShowFileFolderMenu,
        currentFileName,
        setCurrentFileName,
        isFileInProgress,
        setIsFileInProgress,
        fileUplodingRemainingTime,
        setFileUploadingRemainingTime,
        randomAccountBGcolor,
        setRandomAccountBGcolor,
        isFileUploaded,
        setIsFileUploaded,
        isFileUploadingCancle,
        setIsFileUploadingCancle,
        getDirectoryItems,
        uploadFile,
        handleDeleteFile,
        handleDeleteDirectory,
        renameFile,
        saveFilename,
        saveDirectory,
        handleCreateDirectory,
        handleRegister,
        handleLogin,
        handleLogout,
        cancleUpload,
        logoutFromAllDevice,
        // otp
        otp,
        setOtp,
        sendOPT,
        otpSent,
        otpCountDown,
        setOtpCountDown,
        otpError,
        isOtpWrong,
        sentOtpMessage,
        otpLimiterError,
        // verify otp
        verifyUserOtp,
        setVerifyOtpMessage,
        verifyOtpMessage,
        isVerifyOtpWrong,
        setIsVerifyOtpWrong,

        // login with google 
        loginWithGoogle,

        // login with Github: 
        loginWithGithub,
      }}
    >
      {children}
    </BastaStorageContext.Provider>
  );
}

export default ContextAPI;
