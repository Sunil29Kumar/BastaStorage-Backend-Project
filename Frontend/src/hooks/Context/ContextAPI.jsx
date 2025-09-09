import { createContext } from "react";
import { use } from "react";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'


export const BastaStorageContext = createContext();

function ContextAPI({ children }) {
  const BASE_URL = "http://localhost:2000";
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [storageData, setStorageData] = useState({})
  const [storageFullMessage, setStorageFullMessage] = useState("");
  const [isStorageFull, setIsStorageFull] = useState(false);

  const [newFilename, setNewFilename] = useState("");
  const [newDirname, setNewDirname] = useState("");
  const { dirId } = useParams();
  const navigate = useNavigate();

  // dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // share link + invite user 
  const [showShareFile, setShowShareFile] = useState(false);
  const [shareFileId, setShareFileId] = useState(null);
  const [isShareLinkCopied, setIsShareLinkCopied] = useState(false);
  const [sharedUsersData, setSharedUsersData] = useState([]);
  const [inviteUserMessage, setInviteUserMessage] = useState({ message: "", error: "" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [updatePermissionLoading, setUpdatePermissionLoading] = useState(false);

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
  const [loginLimiter, setLoginLimiter] = useState("")

  // fetch LOGIN DATA : fetch user Data after login
  const [storeUserData, setStoreUserData] = useState(null);

  // logOut states
  const [showLogOutBox, setShowLogOutBox] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  // logout user by admin and manager
  // delete user by id by admin 
  const [logoutDeleteByIdMessage, setLogoutDeleteByIdMessage] = useState({
    success: "",
    error: ""
  });

  // update user data
  const [isUpdatedUserData, setIsUpdatedUserData] = useState(false);
  const [userUpdateMessage, setUserUpdateMessage] = useState({
    success: "",
    error: ""
  });

  // all users
  const [allUsers, setAllUsers] = useState([]);

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

  // manage user prfoile 
  const [isManageProfileShowing, setIsManageProfileShowing] = useState(false)

  // login with google 
  const [googleLoginError, setGoogleLoginError] = useState("");
  const [loginWithGoogleMessage, setLoginWithGoogleMessage] = useState({});

  // set google password 
  const [googlePasswordError, setGooglePasswordError] = useState("");
  const [googlePasswordSuccessMessage, setGooglePasswordSuccessMessage] = useState("");

  // google drive 
  const [googleDriveFilesData, setGoogleDriveFilesData] = useState([]);
  const [isGDBoxOpen, setIsGDBoxOpen] = useState(false);

  // recovery request 
  const [recoveryRequestMessage, setRecoveryRequestMessage] = useState({
    message: "",
    error: ""
  })

  // recover account 
  const [recoverAccountMessage, setRecoverAccountMessage] = useState({
    message: "",
    error: ""
  })

  // update Role 
  const [updateRoleMessage, setUpdateRoleMessage] = useState({
    message: "",
    error: ""
  });





  //                                                 --------------------------------
  //                                  main code starrt
  // ---------------------------------

  // dark mode  togge 

  useEffect(() => {
    let saveTheme = localStorage.getItem("isDarkMode");
    if (saveTheme == "true") {
      setIsDarkMode(true);
    }
  }, [])

  function toggleDarkMode() {
    const newTheme = isDarkMode === true ? false : true;
    setIsDarkMode(newTheme)
    localStorage.setItem("isDarkMode", newTheme)
  }

  // GET Request file and dir
  async function getDirectoryItems() {
    // if (!loggedIn) return; // 
    const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
      credentials: "include",
    });
    const data = await response.json();
    if (response.status == 401) {
      if (location.pathname !== "/recover-account" && location.pathname !== "/recover-request") {
        navigate("/Register");
      }
      return;
    }
    setDirectoriesList(data.directories);
    setFilesList(data.files);
    setStorageData(data.storageData);

  }
  useEffect(() => {

    getDirectoryItems();
  }, [dirId]);

  // upload file
  const xhrRef = useRef(null);
  async function uploadFile(e) {
    const file = e.target.files[0];
    console.log(file);

    console.log("file = >>>>", file);
    setCurrentFileName(file.name);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    const uploadStartTime = new Date().getTime();
    xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`, true);

    xhr.setRequestHeader("filename", file.name);
    xhr.withCredentials = true;
    xhr.setRequestHeader("size", file.size);
    xhr.setRequestHeader("type", file.type);
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        getDirectoryItems();
        setIsFileUploadingCancle(false);
        setTimeout(() => {
          setIsFileUploaded(true);
          setIsFileInProgress(false);
          setCurrentFileName("");
          setStorageFullMessage("");
          setFileProgress(0);
        }, 1000);
      }
      else {
        const response = JSON.parse(xhr.responseText);
        console.error("Upload failed:", response.message);
        // alert(response.message);
        setIsStorageFull(true);
        setIsFileInProgress(false);
        setStorageFullMessage(response.message);
        setTimeout(() => {
          setStorageFullMessage("");
          setIsStorageFull(false);
        }, 1000);

      }

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
        const res = await fetch(`${BASE_URL}/user`, {
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          setStoreUserData(userData);
          setLoggedIn(true);
          await getDirectoryItems();
          navigate("/");
        }
      }

      else if (data.statusCode === 429) {
        setLoginLimiter(data.error)
      }

    } catch (error) {
      console.error("Login Error:", error);
    }
  }

  // get / fetch user data after login
  async function fetchUserData() {

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


    }
  }
  useEffect(() => {
    fetchUserData();
  }, []);

  // update user data  ( name and photo ) 
  async function updateUserData(updateUserData) {

    const formDataToSend = new FormData();
    formDataToSend.append("userPhoto", updateUserData.photo);
    formDataToSend.append("name", updateUserData.name);

    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      credentials: "include",
      body: formDataToSend
    });
    const data = await response.json()

    if (response.ok) {
      setIsUpdatedUserData(true);
      setStoreUserData(data.updateUser)
      setUserUpdateMessage({ success: data.message, error: "" });
      setTimeout(() => {
        setUserUpdateMessage({ success: "", error: "" });
        setIsManageProfileShowing(false)
      }, 2000);
    }
    else if (data.error) {
      setIsUpdatedUserData(false);
      setUserUpdateMessage({ success: "", error: data.error });
      setTimeout(() => {
        setUserUpdateMessage({ success: "", error: "" });
      }, 2000);
    }

  }

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
  // ------------- get OPT
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


  // -------------- Login with Github 
  const loginWithGithub = () => {
    window.location.href = `http://localhost:2000/auth/github`;
  }

  // -------------- Login with Google 
  async function loginWithGoogle(credential) {
    const response = await fetch(`${BASE_URL}/auth/google/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential })
    })

    const data = await response.json();
    if (response.status === 403) {
      navigate("/recover-request");
      setGoogleLoginError(data.error);
      setLoggedIn(false)
      return;
    }

    if (response.ok) {
      setGoogleLoginError("");
      setLoginWithGoogleMessage(data);

      // fetch user data

      const res = await fetch(`${BASE_URL}/user`, {
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        setStoreUserData(userData);
        setLoggedIn(true);
        await getDirectoryItems();
        navigate("/");
      }
    }

    else {
      setLoginError(data.error);
    }
    return data;
  }
  // set login with google password
  async function setGooglePassword(password, confirmPassword) {
    const response = await fetch(`${BASE_URL}/auth/google/set-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, confirmPassword }),
    });
    const data = await response.json()
    if (response.ok) {
      setGooglePasswordSuccessMessage(data.message);
      setGooglePasswordError('');

      setTimeout(() => {
        fetchUserData();
      }, 1500);


    }
    else if (response.status === 400) {
      setGooglePasswordSuccessMessage("");
      setGooglePasswordError(data.error);

    }

  }







  // ------------------- google drive integration 
  // Google drive 
  const googleDriveFiles = () => {
    const popup = window.open(
      "http://localhost:2000/auth/google/drive",
      "Google Drive Login",
      `width=600,height=600,left=500,top=200`
    ); 5

    window.addEventListener("message", (event) => {
      if (event.data.success) {
        console.log(event.data.success);
        console.log("Google Drive login successful!");
        getGoogleDriveFilesFolder(); // files auto fetch
      }
      else if (event.data.error) {
        console.log(event.data.error);
        console.error("Google Drive login failed:", event.data.error);
      }
    })
  };
  // get Google Drive files
  async function getGoogleDriveFilesFolder() {
    const response = await fetch(`${BASE_URL}/auth/google/list-file`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      console.log("Google Drive files:", data.files);
      setGoogleDriveFilesData(data.files);
    } else {
      console.error("Failed to fetch Google Drive files:", data.error);
    }
  }
  // send google drive files data to backend
  async function sendDriveFilesData(file) {
    const response = await fetch(`${BASE_URL}/google-drive/file`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ file })
    });
    console.log(await response.json());
  }





  // ---------------- Role Based Access Control (RBAC) -  admin , manager , user
  // all user 
  async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`, {
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      setAllUsers(data.users);
    }
    else if (response.status === 403) {
      navigate("/");
      setAllUsers([]);
    }
    else {
      console.error("Failed to fetch all users");
    }
  }
  // logout user by admin and manager
  async function logoutUserById(userId) {
    const response = await fetch(`${BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json", // 👈 yeh jaruri hai
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (response.ok) {
      setLogoutDeleteByIdMessage({ success: data.message, error: "" });
      setTimeout(() => {
        setLogoutDeleteByIdMessage({ success: "", error: "" });
      }, 2500);
      getAllUsers(); // Refresh user list
    }
    if (response.status === 403) {
      setLogoutDeleteByIdMessage({ success: "", error: data.message });
      setTimeout(() => {
        setLogoutDeleteByIdMessage({ success: "", error: "" });
      }, 2500);
    }


  }

  // --- delete user using id by admin 
  // hard delete 
  async function hardDeleteUserById(userId) {
    const response = await fetch(`${BASE_URL}/users/delete/hard`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (response.ok) {
      setLogoutDeleteByIdMessage({ success: data.message, error: "" });
      setTimeout(() => {
        setLogoutDeleteByIdMessage({ success: "", error: "" });
      }, 2500);
      getAllUsers(); // Refresh user list
    }
    if (response.status === 403) {
      setLogoutDeleteByIdMessage({ success: "", error: data.message });
      setTimeout(() => {
        setLogoutDeleteByIdMessage({ success: "", error: "" });
      }, 2500);

    }
  }
  // soft delete 
  async function softDeleteUserById(userId) {
    const response = await fetch(`${BASE_URL}/users/delete/soft`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (response.ok) {
      setLogoutDeleteByIdMessage({ success: data.message, error: "" });
      setTimeout(() => {
        setLogoutDeleteByIdMessage({ success: "", error: "" });
      }, 2500);
      getAllUsers(); // Refresh user list
    }
    if (response.status === 403) {
      setLogoutDeleteByIdMessage({ success: "", error: data.message });
      setTimeout(() => {
        setLogoutDeleteByIdMessage({ success: "", error: "" });
      }, 2500);

    }
  }
  //  Recovery request
  async function sendRecoverRequest(email) {
    const response = await fetch(`${BASE_URL}/auth/recover-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) {
      setRecoveryRequestMessage({ message: data.message, error: "" });
    }
    if (response.status === 400) {
      setRecoveryRequestMessage({ message: "", error: data.error });
    }
  }
  // Recover Account 
  async function sendRecoverAccount(token) {
    const response = await fetch(`${BASE_URL}/auth/recover-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (response.ok) {
      setRecoverAccountMessage({ message: data.message, error: "" })
    }
    if (response.status == 400) {
      setRecoverAccountMessage({ message: "", error: data.error })
    }
  }
  // update user role 
  async function updateUserRole(userId, newRole) {
    const response = await fetch(`${BASE_URL}/users/changeRole`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, newRole }),
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      getAllUsers(); // Refresh user list
      setUpdateRoleMessage({ message: data.message, error: "" });
      setTimeout(() => {
        setUpdateRoleMessage({ message: "", error: "" });
      }, 2000);
    }
    if (response.status === 400) {
      setUpdateRoleMessage({ message: "", error: data.error });
      setTimeout(() => {
        setUpdateRoleMessage({ message: "", error: "" });
      }, 2000);
    }
  }


  // ----------------- share files

  // share file thorough link 
  async function shareLink(fileId) {
    const response = await fetch(`${BASE_URL}/file/${fileId}/share-link/`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json()
    if (response.ok) {
      await navigator.clipboard.writeText(data.link);
      setIsShareLinkCopied(true);
    }
    if (response.status === 404) {
      setIsShareLinkCopied(false);
    }
    console.log(data);
  }
  // share file thwough email with permission 
  async function inviteUser(email, permission, fileId) {

    setInviteLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/file/${fileId}/share`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, permission })
      })
      const data = await response.json();
      console.log("dsfsdf", data);

      if (response.ok) {
        setInviteUserMessage({ message: data.message, error: "" });
        setInviteLoading(false);
        setTimeout(() => {
          setInviteUserMessage({ message: "", error: "" });
        }, 2000);
      }
      if (response.status === 404) {
        setInviteUserMessage({ message: "", error: data.error });
        setTimeout(() => {
          setInviteUserMessage({ message: "", error: "" });
        }, 2000);
      }
    } catch (error) {
      setInviteUserMessage({ message: "", error: `Something went wrong. Please try again. ${error.message}` });
      setTimeout(() => {
        setInviteUserMessage({ message: "", error: "" });
      }, 2500);
    }
    finally {
      setInviteLoading(false);
    }

  }
  // fetch shared users
  async function fetchSharedUsers(fileId) {
    const response = await fetch(`${BASE_URL}/file/${fileId}/shared-users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();

    if (response.ok) {
      setSharedUsersData(data);
    }
  }
  // update shared file permission 
  async function updateSharedFilePermission(fileId, email, updatePermission) {
    try {
      setUpdatePermissionLoading(true)
      const response = await fetch(`${BASE_URL}/file/${fileId}/share`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, updatePermission })
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        fetchSharedUsers(fileId);
        setInviteUserMessage({ message: data.message, error: "" });
        setTimeout(() => {
          setInviteUserMessage({ message: "", error: "" });
        }, 2000);
      }
      if (response.status === 400 || response.status === 404) {
        setInviteUserMessage({ message: "", error: data.error });
      }
    } catch (error) {
      setInviteUserMessage({ message: "", error: `Something went wrong. Please try again. ${error.message}` });
      setTimeout(() => {
        setInviteUserMessage({ message: "", error: "" });
      }, 2000);
    }
    finally {
      setUpdatePermissionLoading(false)
    }
  }
  // remove shareWith user
  async function removeSharedUser(fileId, userId) {
    const response = await fetch(`${BASE_URL}/file/${fileId}/share/${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setInviteUserMessage({ message: data.message, error: "" });
      setTimeout(() => {
        setInviteUserMessage({ message: "", error: "" });
      }, 2000);
      fetchSharedUsers(fileId);
    }
    if (response.status === 400 || response.status === 404) {
      setInviteUserMessage({ message: "", error: data.error });
    }
  }


  return (
    <BastaStorageContext.Provider
      value={{
        BASE_URL,
        // dark mode
        toggleDarkMode,
        isDarkMode,
        // setIsDarkMode,

        directoriesList,
        setDirectoriesList,
        filesList,
        setFilesList,

        // storage full message
        storageData,
        storageFullMessage,
        isStorageFull,

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

        // ------- share file + share link
        setShowShareFile,
        showShareFile,
        setShareFileId,
        shareFileId,
        shareLink,
        isShareLinkCopied,
        setIsShareLinkCopied,
        // invite user 
        inviteUser,
        inviteUserMessage,
        inviteLoading,
        // fetch shared user 
        fetchSharedUsers,
        // update shared file permission 
        updateSharedFilePermission,
        updatePermissionLoading,
        sharedUsersData,
        // remove shared user
        removeSharedUser,

        //--- logout,    
        showLogOutBox,
        setShowLogOutBox,
        accountMenu,
        setAccountMenu,
        storeUserData,
        setStoreUserData,

        // fetch user data 
        fetchUserData,
        // update user data 
        updateUserData,
        isUpdatedUserData,
        userUpdateMessage,
        setIsUpdatedUserData,

        // all user 
        allUsers,
        getAllUsers,

        // logout user by admin and manager 
        // delete user by id 
        logoutUserById,
        hardDeleteUserById,
        softDeleteUserById,
        logoutDeleteByIdMessage,

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
        loginLimiter,

        // 

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

        googleLoginError,
        setGoogleLoginError,
        loginWithGoogleMessage,
        // set google password 
        setGooglePassword,
        googlePasswordSuccessMessage,
        googlePasswordError,

        // login with Github: 
        loginWithGithub,

        // manage user profile 
        isManageProfileShowing,
        setIsManageProfileShowing,

        // googleDriveFiles 
        googleDriveFiles,
        getGoogleDriveFilesFolder,
        googleDriveFilesData,
        isGDBoxOpen,
        setIsGDBoxOpen,

        // sending google drive files data to backend 
        sendDriveFilesData,

        // recovery request
        sendRecoverRequest,
        recoveryRequestMessage,

        // recovery account 
        sendRecoverAccount,
        recoverAccountMessage,

        // update user role 
        updateUserRole,
        updateRoleMessage,


      }}
    >
      {children}
    </BastaStorageContext.Provider>
  );
}

export default ContextAPI;
