import { Link, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function RecoverAccount() {
    const { sendRecoverAccount, recoverAccountMessage } = useContext(BastaStorageContext);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">

                {/* Header */}
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a9 9 0 0116 0v4a9 9 0 01-16 0V6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15h8m-4 4v-4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Recover Account</h2>
                    <p className="text-gray-600 text-center text-sm mt-2">
                        Confirm your recovery request to regain access to your account.
                    </p>
                </div>


                {/* Action Button */}
                {!recoverAccountMessage.message && (
                    <button
                        onClick={() => sendRecoverAccount(token)}
                        className={`mt-6 w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition cursor-pointer `}
                    >
                        Recover My Account
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
