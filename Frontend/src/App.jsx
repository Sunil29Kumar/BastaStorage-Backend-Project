import Register from "./Auth/Register";
import "remixicon/fonts/remixicon.css";
import BastaStoreDashboard from "./BastaStoreDashboard";
import { Route, Routes } from "react-router-dom";
import BastaStorageProvider from "./hooks/Context/ContextAPI";
import Login from "./Auth/Login";
import MyDrive from "./Components/MyDrive";
import StorageDashboard from "./Components/Total Storage/StorageDashboard";
import GetAllUser from "./Admin Dash/GetAllUser";

import RecoverRequest from "./Account recover/RecoverRequest";
import RecoverAccount from "./Account recover/RecoverAccount";
import SharedFileViewer from "./Components/Share files/SharedFileViewer";

function App() {
  return (
    <Routes>
      {/* BastaStoreDashboard ko context se wrap karna */}
      <Route
        path="/"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/directory/:dirId"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
          </BastaStorageProvider>
        }
      />

      {/* Register and Login components ko bhi context se wrap karna */}
      <Route
        path="/Register"
        element={
          <BastaStorageProvider>
            <Register />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/Login"
        element={
          <BastaStorageProvider>
            <Login />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/my-drive"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/storage-dashboard"
        element={
          <BastaStorageProvider>
            <StorageDashboard />
          </BastaStorageProvider>
        }
      />

      <Route
        path="/users"
        element={
          <BastaStorageProvider>
            <GetAllUser />
          </BastaStorageProvider>
        }
      />

      <Route
        path="/recover-request"
        element={
          <BastaStorageProvider>
            <RecoverRequest />
          </BastaStorageProvider>
        }
      />

      <Route
        path="/recover-account"
        element={
          <BastaStorageProvider>
            <RecoverAccount />
          </BastaStorageProvider>
        }
      />

      <Route path="/share/:token" element={<SharedFileViewer />} />

      

    </Routes>
  );
}

export default App;
