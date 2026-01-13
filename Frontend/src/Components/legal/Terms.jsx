import {
  Shield,
  Lock,
  CreditCard,
  Share2,
  AlertCircle,
  FileText,
  CheckCircle,
  AlertTriangle,
  EyeOff,
  Cloud,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 flex bg-white/80 backdrop-blur-md items-center justify-between px-6 md:px-16 py-4 border-b border-slate-100">
        <Link to="/" className="flex items-center">
          <img
            src="/bst logo.png"
            className="w-10 h-10 object-contain "
            alt="logo"
          />
          <span className="ml-3 font-black text-xl tracking-tight text-slate-900">
            BastaStorage
          </span>
        </Link>

        <Link
          to="/login"
          className="px-6 py-2 rounded-full text-sm font-bold bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-md"
        >
          Login
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:p-16">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase mb-4 tracking-widest">
            Legal Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-500 font-medium">
            Effective Date: January 2026
          </p>
        </header>

        <div className="space-y-12 text-slate-700">
          {/* 1. Acceptance */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900">
              <FileText className="text-blue-600" />
              Acceptance of Terms
            </h2>
            <p className="text-sm leading-relaxed">
              By accessing BastaStorage, you agree to be bound by these Terms.
              Our service provides cloud storage and management via AWS S3
              infrastructure. If you do not agree to these terms, you must
              immediately cease using the platform.
            </p>
          </section>

          {/* 2. Infrastructure & Storage */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900">
              <Cloud className="text-blue-600" />
              Storage Infrastructure
            </h2>
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-sm leading-relaxed mb-4">
                BastaStorage acts as a bridge between your local files, Google
                Drive, and <strong>AWS S3 (Amazon Web Services)</strong>.
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>
                  Files migrated from Google Drive or uploaded locally are
                  stored on secure AWS S3 buckets.
                </li>
                <li>
                  BastaStorage manages the metadata and retrieval keys to
                  provide your dashboard functionality.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Privacy & File Ownership */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900">
              <EyeOff className="text-blue-600" />
              Privacy & File Ownership
            </h2>
            <p className="text-sm leading-relaxed">
              <strong>Your files belong to you.</strong> BastaStorage does not
              claim any ownership rights over the content you upload. We do not
              monitor, scan, or access your private S3-hosted files unless
              required for technical support or by law.
            </p>
          </section>

          {/* 4. Data Security */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900">
              <Lock className="text-blue-600" />
              Data & Security
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2">Encryption</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Data is encrypted during transit (TLS/SSL) and at rest within
                  the AWS S3 infrastructure.
                </p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-2">
                  Account Responsibility
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and Google/GitHub OAuth links.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Prohibited Content */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle />
              Prohibited Content
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
              <p className="text-sm font-bold text-red-800 mb-3">
                Users are strictly prohibited from storing:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-red-700 font-medium">
                <li>• Child Sexual Abuse Material (CSAM)</li>
                <li>• Copyrighted content without legal rights</li>
                <li>• Malicious software (Viruses/Malware)</li>
                <li>• Pornographic or sexually explicit material</li>
                <li>• Violent or hateful content</li>
              </ul>
              <p className="mt-4 text-xs italic text-red-600">
                Violation of these rules will lead to immediate Hard Deletion of the account and legal reporting.
              </p>
            </div>
          </section>

          {/* 6. Subscriptions, Billing & Refunds */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900">
              <CreditCard className="text-blue-600 w-6 h-6" />
              Subscriptions & Billing
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                <ul className="space-y-5 text-sm">
                  <li className="flex gap-4">
                    <CheckCircle className="text-blue-400 shrink-0 w-5 h-5" />
                    <div>
                      <span className="font-bold text-blue-300 block mb-1">Secure Payment Processing</span>
                      All transactions are processed via <strong>Razorpay</strong>. BastaStorage does not store your credit card, debit card, or UPI credentials. Payments are subject to the terms and conditions of Razorpay.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle className="text-blue-400 shrink-0 w-5 h-5" />
                    <div>
                      <span className="font-bold text-blue-300 block mb-1">Billing & Taxes</span>
                      Subscription fees are billed in advance on a monthly or yearly cycle. Prices are inclusive of applicable taxes unless stated otherwise.
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle className="text-blue-400 shrink-0 w-5 h-5" />
                    <div>
                      <span className="font-bold text-blue-300 block mb-1">Storage Quota & Downgrades</span>
                      If you downgrade your plan or your subscription expires, and your stored data exceeds the "Free Tier" limit, BastaStorage reserves the right to restrict file uploads and access. Continued non-payment may lead to data removal after a 30-day notice.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Refund Policy Sub-section */}
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  Refund & Cancellation Policy
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  You may cancel your subscription at any time. Refunds are typically processed only if the request is made within <strong>48 hours</strong> of the transaction and if the premium features/storage have not been substantially utilized. All refunds are at the sole discretion of BastaStorage and will be credited back to the original payment source via Razorpay.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Account Deletion Policy */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900">
              <Trash2 className="text-red-600" />
              Account Deletion
            </h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong>Soft Delete:</strong> Users may deactivate accounts,
                allowing a grace period for data recovery.
              </p>
              <p className="p-4 bg-orange-50 rounded-2xl border border-orange-100 font-medium">
                <strong>Hard Delete:</strong> If initiated by the user or an
                Admin for policy violations, all data on AWS S3 and database
                metadata will be <u>instantly and permanently erased</u>.
                BastaStorage cannot recover data after a Hard Delete.
              </p>
            </div>
          </section>

          {/* 8. Public Sharing */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900">
              <Share2 className="text-blue-600" />
              Public Sharing
            </h2>
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4 items-start">
              <AlertCircle className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Files shared via public links are accessible to anyone with the
                URL. BastaStorage is not liable for data exposure resulting
                from links shared by the user.
              </p>
            </div>
          </section>

          {/* 9. Account Suspension */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900">
              <Shield className="text-blue-600" />
              Suspension & Termination
            </h2>
            <p className="text-sm leading-relaxed">
              We reserve the right to suspend or terminate access to
              BastaStorage for accounts that violate these terms, engage in
              fraudulent activity, or pose a security risk to our AWS
              infrastructure.
            </p>
          </section>
        </div>

        <footer className="mt-24 pt-10 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm italic leading-relaxed">
            © 2026 BastaStorage Systems. All rights reserved. <br />
            Jurisdiction: India 🇮🇳 <br />
            Support:{" "}
            <a href="mailto:support@bastastorage.com" className="text-blue-600 font-bold">
              support@bastastorage.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Terms;