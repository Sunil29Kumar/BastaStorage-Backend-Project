import { Link } from 'react-router-dom';
import { useContext } from 'react'
import { BastaStorageContext } from '../../hooks/Context/ContextAPI.jsx';

function TermsPrivacyFooter() {
    const { isDarkMode } = useContext(BastaStorageContext);
    return (
        <>
            <div className={`mt-6 pt-5 border-t ${isDarkMode ? "border-white/10" : "border-gray-100"} flex flex-col items-center gap-2`}>

                {/* Links Row */}
                <div className="flex items-center justify-center gap-3">
                    <Link
                        to="/privacy-policy"
                        className={`text-[11px] font-bold tracking-wider uppercase transition-all duration-200 hover:text-blue-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                    >
                        Privacy
                    </Link>

                    {/* Divider Dot */}
                    <div className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>

                    <Link
                        to="/terms"
                        className={`text-[11px] font-bold tracking-wider uppercase transition-all duration-200 hover:text-blue-500 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                    >
                        Terms
                    </Link>
                </div>

                {/* Brand Copyright (Optional but professional) */}
                <p className={`text-[9px] font-medium tracking-[0.1em] opacity-40 uppercase`}>
                    © 2026 BastaStorage Inc.         
                </p>
            </div>
        </>

    )
}

export default TermsPrivacyFooter