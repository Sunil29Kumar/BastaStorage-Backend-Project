import {
    Lock,
    ShieldCheck,
    Database,
    Share2,
    CreditCard,
    Trash2,
    UserCheck,
    AlertCircle,
    Cookie,
} from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc]">

            {/* Top Header */}
            <header className="sticky top-0 z-50 flex bg-[#f8fafc]  items-center justify-between px-6 md:px-16 py-4 ">
                <Link to="/" className="h-[10vh] flex items-center   ">
                    <img
                        src="/bst logo.png"
                        className="w-[4vw] cursor-pointer bg-black "
                        alt="logo"
                    />
                </Link>

                <Link
                    to="/login"
                    className="px-6 py-2 rounded-full text-sm font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-md"
                >
                    Login
                </Link>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto p-6 md:p-16">
                <header className="mb-12">
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase mb-4">
                        Legal Documentation
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500">
                        Last updated: January 2026
                    </p>
                </header>

                <div className="space-y-12">

                    {/* 1. Information Collection */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <Database className="text-blue-500" />
                            Information We Collect
                        </h2>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Account information (name, email, phone)</li>
                            <li>Uploaded files and folder metadata</li>
                            <li>Device & login activity</li>
                            <li>Payment identifiers (not card details)</li>
                        </ul>
                    </section>

                    {/* 2. How We Use Data */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <UserCheck className="text-blue-500" />
                            How We Use Your Data
                        </h2>
                        <p className="text-slate-600">
                            We use your data strictly to provide, maintain, secure,
                            and improve BastaStorage services.
                        </p>
                    </section>

                    {/* 3. File Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <Lock className="text-blue-500" />
                            File Privacy & Ownership
                        </h2>
                        <p className="text-slate-600">
                            You retain full ownership of your files. We do not access,
                            view, or analyze private content unless required by law.
                        </p>
                    </section>

                    {/* 4. Sharing */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <Share2 className="text-blue-500" />
                            File Sharing
                        </h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                            <AlertCircle className="inline mr-2" />
                            Files shared via public links may be accessed by anyone
                            with the link. You are responsible for link sharing.
                        </div>
                    </section>

                    {/* 5. Payments */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <CreditCard className="text-blue-500" />
                            Payments & Billing
                        </h2>
                        <p className="text-slate-600">
                            Payments are securely processed by Razorpay.
                            BastaStorage does not store card or banking details.
                        </p>
                    </section>

                    {/* 6. Data Retention */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <Trash2 className="text-blue-500" />
                            Data Retention & Deletion
                        </h2>
                        <p className="text-slate-600">
                            Deleted files may be permanently removed.
                            Upon account termination, data may be erased after
                            applicable grace periods.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <Cookie className="text-blue-500" />
                            Cookies & Tracking
                        </h2>
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                            <p className="text-slate-600 text-sm leading-relaxed">
                                BastaStorage uses "Essential Cookies" to manage your login session.
                                We store a unique **Session ID** in your browser to keep you logged in.
                                This cookie does not track your personal activity outside our platform
                                and is deleted when you clear your browser data.
                            </p>
                        </div>
                    </section>

                    {/* 7. Legal Compliance */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <ShieldCheck className="text-blue-500" />
                            Legal Compliance
                        </h2>
                        <p className="text-slate-600">
                            We comply with applicable laws of Bharat 🇮🇳 and may
                            disclose data when required by law or court order.
                        </p>
                    </section>

                    {/* 8. Security */}
                    <section>
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                            <Lock className="text-blue-500" />
                            Security Measures
                        </h2>
                        <p className="text-slate-600">
                            We use encryption, access controls, and monitoring
                            to protect your data, but no system is 100% secure.
                        </p>
                    </section>

                </div>

                <footer className="mt-20 text-center text-sm text-gray-400">
                    © 2026 BastaStorage. All rights reserved. <br />
                    Contact: privacy@bastastorage.com
                </footer>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
