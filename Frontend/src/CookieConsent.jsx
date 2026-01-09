import React, { useState, useEffect, useContext } from 'react';
import { Cookie, X } from 'lucide-react';
import { BastaStorageContext } from './hooks/Context/ContextAPI';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const { isDarkMode } = useContext(BastaStorageContext);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('basta_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('basta_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        // Responsive Wrapper: Mobile par bottom-4, desktop par bottom-8 right-8
        <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-[400px] z-[1000] animate-in slide-in-from-bottom-5 duration-500">

            <div className={`relative overflow-hidden rounded-[2rem] p-5 md:p-6 shadow-2xl border transition-colors duration-300 ${isDarkMode
                    ? 'bg-slate-900/95 border-slate-700 backdrop-blur-md text-white'
                    : 'bg-white/95 border-slate-200 backdrop-blur-md text-slate-900'
                }`}>

                {/* Decorative Gradient Blur */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-start gap-4 relative z-10">
                    {/* Icon: Mobile par thoda chhota */}
                    <div className={`shrink-0 p-2.5 md:p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                        <Cookie className="w-5 h-5 md:w-6 md:h-6" />
                    </div>

                    <div className="flex-1 pr-6">
                        <h3 className="text-xs md:text-sm font-black uppercase tracking-widest mb-1 opacity-90">
                            Cookie Notice
                        </h3>
                        <p className={`text-[11px] md:text-xs leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                            We use session cookies to keep you logged in to <b>BastaStorage</b>. By continuing, you agree to our essential data policy.
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-0 right-0 p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Action Row: Mobile par full width buttons ki tarah behave karega */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 relative z-10">
                    <button
                        onClick={handleAccept}
                        className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                        I Accept
                    </button>

                    <Link
                        to="/privacy-policy"
                        className={`w-full sm:w-auto text-center py-2 text-[10px] font-bold uppercase tracking-widest transition-colors px-4 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-blue-600'
                            }`}
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;