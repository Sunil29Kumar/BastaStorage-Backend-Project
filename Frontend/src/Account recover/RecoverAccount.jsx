import { Link, useSearchParams } from "react-router-dom";
import { useContext, useState } from "react";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";

function RecoverAccount() {
    const { sendRecoverAccount, recoverAccountMessage, isDarkMode } = useContext(BastaStorageContext);

    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen px-4 transition-colors duration-300 ${isDarkMode ? "bg-[#0f1113]" : "bg-gray-50 bg-gradient-to-br from-blue-50 to-gray-100"
            }`}>
            <div className={`w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 border transition-all ${isDarkMode ? "bg-[#1c1f23] border-white/5 shadow-black/50" : "bg-white border-gray-100 shadow-gray-200/50"
                }`}>

                {/* Header / Logo */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 flex items-center justify-center mb-6 drop-shadow-xl hover:scale-110 transition-transform">
                        <img src="/basta logo.png" className="w-full h-full object-contain" alt="Logo" />
                    </div>
                    <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        Final <span className="text-blue-500">Step</span>
                    </h2>
                    <p className={`text-center text-[11px] font-bold uppercase tracking-[0.2em] mt-3 opacity-50`}>
                        Confirm your account recovery
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="mt-8">
                    {!recoverAccountMessage.message && (
                        <div className="space-y-6">
                            <p className={`text-sm text-center font-medium leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Regain access to your files and workspace by clicking the confirmation button below.
                            </p>

                            <button
                                onClick={() => {
                                    sendRecoverAccount(token);
                                    setLoading(true);
                                }}
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer ${loading ? "opacity-60 bg-blue-600/50" : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Finalizing...
                                    </>
                                ) : (
                                    "Confirm Recovery"
                                )}
                            </button>
                        </div>
                    )}

                    {/* Success State */}
                    {recoverAccountMessage.message && (
                        <div className="animate-in fade-in zoom-in duration-300 text-center ">
                            <div className={`p-5 rounded-2xl border-l-4 border-green-500 ${isDarkMode ? "bg-green-500/10" : "bg-green-50"
                                }`}>
                                <p className={`text-sm font-black uppercase tracking-tight ${isDarkMode ? "text-green-400" : "text-green-700"
                                    }`}>
                                  {recoverAccountMessage.message}
                                </p>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/login" className={`flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? "bg-white/5 hover:bg-white/10 text-blue-400" : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                                    }`}>
                                    Back to Login
                                </Link>
                                <Link to="/register" className={`flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? "bg-white/5 hover:bg-white/10 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                    }`}>
                                    Join New
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {recoverAccountMessage.error && (
                        <div className={`mt-6 p-4 rounded-2xl border-l-4 border-red-500 animate-shake ${isDarkMode ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-700"
                            }`}>
                            <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <i className="ri-error-warning-fill text-lg"></i>
                                {recoverAccountMessage.error}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {!recoverAccountMessage.message && (
                    <div className="mt-10 pt-6 border-t border-gray-500/10">
                        <p className={`text-[10px] font-bold text-center uppercase tracking-widest opacity-40 leading-loose`}>
                            Security Notice: If you didn’t request this recovery,
                            <span className="block">please ignore this link immediately.</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecoverAccount;