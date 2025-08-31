import { useContext, useEffect, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { Link } from "react-router-dom";

function RecoverRequest() {
  const { googleLoginError, sendRecoverRequest, recoveryRequestMessage } =
    useContext(BastaStorageContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(googleLoginError);
  }, [googleLoginError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await sendRecoverRequest(email); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Recover Your Account
        </h2>

        {/* Error message if any */}
        {googleLoginError && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md mb-4 text-center">
            {googleLoginError}
          </div>
        )}

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email and we’ll send you a recovery link.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          {!recoveryRequestMessage.message && (
            <button
              type="submit"
              disabled={loading} // ⬅️ disable button while sending
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Recovery Link"}
            </button>
          )}
        </form>

        {recoveryRequestMessage.error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-md text-center">
            {recoveryRequestMessage.error}
          </div>
        )}

        {/* Footer text */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          Don’t have an account?{" "}
          <Link to="/Register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>

        {recoveryRequestMessage.message && (
          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-md text-center">
            {recoveryRequestMessage.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecoverRequest;
