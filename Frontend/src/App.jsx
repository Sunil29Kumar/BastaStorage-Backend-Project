import Register from "./Auth/Register";
import "remixicon/fonts/remixicon.css";
import BastaStoreDashboard from "./BastaStoreDashboard";
import {Route, Routes} from "react-router-dom";
import BastaStorageProvider from "./hooks/Context/ContextAPI";
import Login from "./Auth/Login";
import MyDrive from "./Components/MyDrive";

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
            <BastaStoreDashboard/>
          </BastaStorageProvider>
        }
      />
    </Routes>
  );
}

export default App;
