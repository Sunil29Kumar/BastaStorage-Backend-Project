import { Link, useSearchParams } from "react-router-dom";
import { useContext, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function RecoverAccount() {
    const { sendRecoverAccount, recoverAccountMessage } = useContext(BastaStorageContext);

    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">

                {/* Header */}
                <div className="flex flex-col items-center">
                    <div className=" w-[10vw] flex items-center justify-center mb-5">
                        <img src="/bs copy.png" className=" w-full h-full object-contain " />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Recover Account</h2>
                    <p className="text-gray-600 text-center text-sm mt-2">
                        Confirm your recovery request to regain access to your account.
                    </p>
                </div>


                {/* Action Button */}
                {!recoverAccountMessage.message && (
                    <button
                        onClick={() => {
                            sendRecoverAccount(token);
                            setLoading(true);
                        }}
                        disabled={loading}
                        className={`mt-6 w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition cursor-pointer `}
                    >
                        {loading ? "Processing..." : "Confirm Recovery"}
                    </button>
                )}

                {/* Recovery Message */}
                {recoverAccountMessage.message && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <p className="text-green-700 font-medium">{recoverAccountMessage.message}</p>

                        <div className="mt-4 flex justify-center gap-6">
                            <Link to="/login" className="text-blue-600 hover:underline text-sm">
                                Back to Login
                            </Link>
                            <Link to="/register" className="text-blue-600 hover:underline text-sm">
                                Register New Account
                            </Link>
                        </div>
                    </div>
                )}

                {recoverAccountMessage.error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                        <p className="text-red-700 font-medium">{recoverAccountMessage.error}</p>
                    </div>
                )}

                {/* Footer */}
                {!recoverAccountMessage.message && (
                    <p className="text-xs text-gray-500 text-center mt-6">
                        If you didn’t request this recovery, please ignore this message.
                    </p>
                )}
            </div>
        </div >
    );
}

export default RecoverAccount;
