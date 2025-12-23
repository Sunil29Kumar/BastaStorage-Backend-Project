import { useContext, useEffect, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { Link } from "react-router-dom";

function RecoverRequest() {
  const { googleLoginError, sendRecoverRequest, recoveryRequestMessage } =
    useContext(BastaStorageContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center  px-4">
      {/* Card */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
            🔐
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Account Recovery
          </h2>
          <p className="text-gray-600 mt-1 text-sm">
            Enter your email to receive a recovery link
          </p>
        </div>

        {/* Error (Google / API) */}
        {
          googleLoginError && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-center">
              {googleLoginError}
            </div>
          )
        }




        {/* Form */}
        {!recoveryRequestMessage.message && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 cursor-pointer text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending...
                </>
              ) : (
                "Send Recovery Link"
              )}
            </button>
          </form>
        )}

        {/* Error message */}
        {recoveryRequestMessage.error && (
          <div className="mt-5 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-center">
            {recoveryRequestMessage.error}
          </div>
        )}

        {/* Success message */}
        {recoveryRequestMessage.message && (
          <div className="mt-5 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg px-4 py-3 text-center">
            ✅ {recoveryRequestMessage.message}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/Register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecoverRequest;
