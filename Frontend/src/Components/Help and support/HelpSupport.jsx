import React, { useContext } from 'react';
import { BastaStorageContext } from '../../hooks/Context/ContextAPI';
import { RiQuestionLine, RiMailSendLine, RiShieldUserLine, RiCustomerService2Line, RiBookOpenLine } from 'react-icons/ri';

const HelpSupport = () => {
    const { isDarkMode } = useContext(BastaStorageContext);

    const helpCards = [
        { title: "Getting Started", desc: "Learn how to upload and manage files.", icon: <RiBookOpenLine />, color: "text-blue-500" },
        { title: "Account & Security", desc: "Reset password and secure your cloud.", icon: <RiShieldUserLine />, color: "text-purple-500" },
        { title: "Billing & Plans", desc: "Manage your Basta Storage subscription.", icon: <RiCustomerService2Line />, color: "text-emerald-500" },
    ];

    return (
        <div className={`px-10 py-5 w-full overflow-auto space-y-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>

            {/* Header Area */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black italic tracking-tight">How can we help?</h1>
                <p className="opacity-60 max-w-lg mx-auto">Search our knowledge base or contact our support team to resolve your issues.</p>
                <div className="relative max-w-2xl mx-auto mt-6">
                    <input
                        type="text"
                        placeholder="Search for articles (e.g. 'How to delete file?')"
                        className={`w-full p-4 pl-12 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <RiQuestionLine className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40" />
                </div>
            </div>

            {/* Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {helpCards.map((card, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border transition-all hover:scale-105 ${isDarkMode ? 'bg-[#1c1f23] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className={`text-3xl mb-4 ${card.color}`}>{card.icon}</div>
                        <h3 className="text-lg font-black mb-2">{card.title}</h3>
                        <p className="text-sm opacity-50">{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* Contact Form & FAQs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* FAQ Style */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black italic">Popular Questions</h2>
                    {[
                        "How to increase my storage limit?",
                        "Is my data encrypted in Basta?",
                        "Can I recover deleted files?"
                    ].map((q, i) => (
                        <div key={i} className={`p-5 rounded-2xl border flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-white/5 border-white/5' : 'hover:bg-gray-50 border-gray-100'}`}>
                            <span className="text-sm font-bold">{q}</span>
                            <RiQuestionLine className="opacity-30" />
                        </div>
                    ))}
                </div>

                {/* Direct Support Form */}
                <div className={`p-8 rounded-[3rem] border ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                        <RiMailSendLine /> Send a Message
                    </h3>
                    <div className="space-y-4">
                        <input type="text" placeholder="Issue Subject" className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white border-gray-200'}`} />
                        <textarea rows="4" placeholder="Describe your problem..." className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white border-gray-200'}`}></textarea>
                        <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                            Submit Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;