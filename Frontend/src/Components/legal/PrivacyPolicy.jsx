import {
    Lock, ShieldCheck, Database, Share2, CreditCard, Trash2, 
    UserCheck, AlertCircle, Cookie, Globe, RefreshCw, Eye, Cloud
} from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="sticky top-0 z-50 flex bg-white/80 backdrop-blur-md items-center justify-between px-6 md:px-16 py-4 border-b border-slate-100">
                <Link to="/home" className="flex items-center">
                    <img src="/bst logo.png" className="w-10 h-10 object-contain " alt="logo" />
                    <span className="ml-3 font-black text-xl tracking-tight text-slate-900">BastaStorage</span>
                </Link>
                <Link to="/login" className="px-6 py-2 rounded-full text-sm font-bold bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-md">
                    Login
                </Link>
            </header>

            <main className="max-w-4xl mx-auto p-6 md:p-16">
                <header className="mb-12 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase mb-4 tracking-widest">
                        Legal Documentation
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-slate-500 font-medium ">Last updated: January 2026 </p>
                </header>

                <div className="space-y-12 text-slate-700">
                    {/* 1. Information Collection & Infrastructure */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4">
                            <Database className="text-blue-600 w-6 h-6" /> Information Collection & Storage
                        </h2>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                            <p className="text-sm leading-relaxed">
                                BastaStorage utilizes industry-standard cloud infrastructure to manage your data securely:
                            </p>
                            <ul className="list-disc pl-5 text-sm space-y-3">
                                <li><strong>Account Identity:</strong> We collect your name, email, and profile picture through direct signup or OAuth providers (Google/GitHub).</li>
                                <li><strong>Cloud Storage (AWS S3):</strong> All user-uploaded files, including user profile images, are securely stored on <strong>Amazon Web Services (AWS) S3</strong> buckets.</li>
                                <li><strong>No Tracking Policy:</strong> We <u>do not</u> store, log, or track user IP addresses or precise geographic locations.</li>
                                <li><strong>Metadata Management:</strong> File names, extensions,Type sizes and Folder structures are stored in our secured database to provide your dashboard view.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 2. Google Drive Integration (Critical for OAuth) */}
                    <section className="p-8 bg-blue-900 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/10">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-4"><Globe className="text-blue-300 w-6 h-6" /> Google Drive & Data Migration</h2>
                        <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                            Our application complies with the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="underline font-bold" target="_blank" rel="noreferrer">Google API Service: User Data Policy</a>.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                                <h4 className="font-bold mb-2 flex items-center gap-2"><Cloud className="w-4 h-4" /> S3 Migration</h4>
                                <p className="text-blue-100/80">When importing files from Google Drive, the file metadata and content are migrated to our AWS S3 storage to ensure consistent access via your BastaStorage dashboard.</p>
                            </div>
                            <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                                <h4 className="font-bold mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> File Previews</h4>
                                <p className="text-blue-100/80">We store unique file-key metadata to generate secure previews. This allows you to view your documents without continuous re-authentication with Google APIs.</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Data Usage & Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4"><UserCheck className="text-blue-600" /> How We Use Your Data</h2>
                        <p className="text-sm leading-relaxed">
                            Your data is used strictly to provide storage services, manage your cloud quota, and facilitate secure file sharing. BastaStorage does not sell your personal information or metadata to third-party advertisers.
                        </p>
                    </section>

                    {/* 4. Ownership & Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4"><Eye className="text-blue-600" /> File Privacy & Ownership</h2>
                        <p className="text-sm leading-relaxed">
                            Users retain <strong>100% ownership</strong> of all files stored on our S3 buckets. We do not access, scan, or monitor private content unless explicitly requested by the user for support or if required by a valid legal court order.
                        </p>
                    </section>

                    {/* 5. Payments & Billing */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-4"><CreditCard className="text-blue-600" /> Payments & Billing</h2>
                        <p className="text-sm leading-relaxed">
                            Payment processing is handled securely by <strong>Razorpay</strong>. BastaStorage does not store or process sensitive credit card or banking information on its own servers.
                        </p>
                    </section>

                    {/* 6. Account Deletion (Soft & Hard Delete) */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-6"><Trash2 className="text-red-600" /> Account Deletion Policy</h2>
                        <div className="space-y-4">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                <h4 className="font-bold text-sm text-slate-800 mb-1 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-blue-500" /> Soft Delete (Recoverable)</h4>
                                <p className="text-xs text-slate-500">Accounts and files are marked for deletion but remain in a recovery state. Users can restore their data through the account management interface.</p>
                            </div>
                            <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                                <h4 className="font-bold text-sm text-red-800 mb-1 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" /> Hard Delete (Permanent)</h4>
                                <p className="text-xs text-red-600 font-bold tracking-wide">
                                    Initiated by a User or Administrator. This action results in the <u>immediate and permanent</u> removal of all files from AWS S3 and metadata from our databases. Recovery is not possible once a Hard Delete is executed.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 7. Cookies, Security & Legal */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3"><Cookie className="text-blue-600 w-5 h-5" /> Cookies</h2>
                            <p className="text-xs leading-relaxed">We use essential session cookies to manage login states. No third-party tracking cookies are utilized.</p>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3"><Lock className="text-blue-600 w-5 h-5" /> Security</h2>
                            <p className="text-xs leading-relaxed">Your Passwords are encrypted. Files are stored in secured AWS S3 environments with restricted access controls.</p>
                        </section>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-3"><ShieldCheck className="text-blue-600 w-5 h-5" /> Legal Compliance</h2>
                        <p className="text-xs leading-relaxed">
                            BastaStorage operates under the jurisdiction of India 🇮🇳 and complies with the Information Technology Act, 2000. Data disclosure may occur only if mandated by law.
                        </p>
                    </section>
                </div>

                <footer className="mt-24 pt-10 border-t border-slate-200 text-center text-sm text-gray-400">
                    © 2026 BastaStorage Systems • Infrastructure powered by AWS <br />
                    Contact: <a href="mailto:privacy@bastastorage.com" className="text-blue-600 font-bold">privacy@bastastorage.com</a>
                </footer>
            </main>
        </div>
    );
};

export default PrivacyPolicy;