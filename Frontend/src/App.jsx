import Register from "./Auth/Register";
import "remixicon/fonts/remixicon.css";
import BastaStoreDashboard from "./BastaStoreDashboard";
import { Route, Routes } from "react-router-dom";
import BastaStorageProvider from "./hooks/Context/ContextAPI";
import Login from "./Auth/Login";
import GetAllUser from "./Admin Dash/GetAllUser";

import RecoverRequest from "./Account recover/RecoverRequest";
import RecoverAccount from "./Account recover/RecoverAccount";
import SharedFileViewer from "./Components/Share files/SharedFileViewer";
import PrivateShareFileViewer from "./Components/Share files/PrivateShareFileViewer";

import ManageSubscription from "./plans/ManageSubscription";
import MyFiles from "./Components/MyFiles";
import Terms from "./Components/legal/Terms";
import PrivacyPolicy from "./Components/legal/PrivacyPolicy";
import Plans from "./plans/plans";

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
        path="/my-files"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/storageOverview"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/storageAnalytics"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/help-support"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/settings"
        element={
          <BastaStorageProvider>
            <BastaStoreDashboard />
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

      {/* public share  */}
      <Route path="/share/:token" element={
        <BastaStorageProvider>
          <SharedFileViewer />
        </BastaStorageProvider>
      } />

      {/* private share  */}
      <Route path="/share/:fileId/view/:token"
        element={
          <BastaStorageProvider>
            <PrivateShareFileViewer />
          </BastaStorageProvider>
        }
      />


      {/* plans  */}
      <Route
        path="/plans"
        element={
          <BastaStorageProvider>
            <Plans />
          </BastaStorageProvider>
        }
      />


      <Route
        path="/manage-subscription"
        element={
          <BastaStorageProvider>
            <ManageSubscription />
          </BastaStorageProvider>
        }
      />

      <Route
        path="/terms"
        element={
          <BastaStorageProvider>
            <Terms />
          </BastaStorageProvider>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <BastaStorageProvider>
            <PrivacyPolicy />
          </BastaStorageProvider>
        }
      />

    </Routes>
  );
}

export default App;
