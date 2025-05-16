import {useContext} from "react";
import {Link} from "react-router-dom";
import {BastaStorageContext} from "../hooks/Context/ContextAPI";

function Register() {
  const {
    registerData,
    setRegisterData,
    handleRegister,
    errorRegister,
    setErrorRegister,
  } = useContext(BastaStorageContext);

  const handleChange = (e) => {
    setRegisterData({...registerData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text"
            name="name"
            placeholder="Name"
            value={registerData.name}
            onChange={handleChange}
            pattern=".{3,255}"
            title="Name Must contain minimun 3 character"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorRegister.errorFieldName === "name" && (
            <p className=" text-center text-red-500 ">
              {errorRegister.errorDescription}
            </p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registerData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorRegister.errorFieldName === "email" && (
            <p className=" text-center text-red-500 ">
              {errorRegister.errorDescription}
            </p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={registerData.password}
            onChange={handleChange}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&]).{6,}$"
            title="Password must have 8+ characters with uppercase, lowercase, number and special character"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errorRegister.errorFieldName === "password" && (
            <p className=" text-center text-red-500 ">
              {errorRegister.errorDescription}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
