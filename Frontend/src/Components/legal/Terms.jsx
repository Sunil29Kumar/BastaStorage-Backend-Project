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
} from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:p-16">
        <header className="mb-12">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase mb-4">
            Legal Documentation
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-500">
            Last updated: January 2026
          </p>
        </header>

        <div className="space-y-12">

          {/* 1. Acceptance */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <FileText className="text-blue-500" />
              Acceptance of Terms
            </h2>
            <p className="text-slate-600">
              By creating an account or using BastaStorage, you agree to comply
              with these Terms. If you do not agree, please discontinue use.
            </p>
          </section>

          {/* 2. Privacy & Ownership */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <EyeOff className="text-blue-500" />
              Privacy & File Ownership
            </h2>
            <p className="text-slate-600">
              Your files belong to you. BastaStorage does not claim ownership
              and does not manually monitor private user content.
            </p>
          </section>

          {/* 3. Data & Security (ORIGINAL) */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Lock className="text-blue-500" />
              Data & Security
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <h4 className="font-bold mb-1">Privacy First</h4>
                <p className="text-sm text-gray-500">
                  Files are encrypted in transit and at rest.
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <h4 className="font-bold mb-1">User Responsibility</h4>
                <p className="text-sm text-gray-500">
                  You are responsible for account security and passwords.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Prohibited Content (NEW – VERY IMPORTANT) */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-red-600">
              <AlertTriangle />
              Prohibited Content
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <ul className="list-disc pl-6 space-y-2 text-sm text-slate-700">
                <li>Pornographic or sexually explicit content</li>
                <li>Child sexual abuse material (zero tolerance)</li>
                <li>Copyrighted content without permission</li>
                <li>Malware, viruses, or harmful software</li>
                <li>Illegal, violent, or hateful material</li>
              </ul>

              <p className="mt-4 text-sm">
                BastaStorage may remove content, suspend accounts, and cooperate
                with legal authorities when required.
              </p>
            </div>
          </section>



          {/* 5. Subscriptions & Billing (ORIGINAL) */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <CreditCard className="text-blue-500" />
              Subscriptions & Billing
            </h2>

            <div className="bg-slate-900 text-white p-6 rounded-3xl">
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <CheckCircle size={16} />
                  Monthly and Yearly plans are billed in advance
                </li>
                <li className="flex gap-2">
                  <CheckCircle size={16} />
                  Downgrades may restrict access or delete excess files
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Public Sharing (ORIGINAL) */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Share2 className="text-blue-500" />
              Public Sharing
            </h2>

            <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex gap-4">
              <AlertCircle />
              <p>
                Public links can be accessed by anyone. BastaStorage is not
                responsible for exposure caused by user sharing.
              </p>
            </div>
          </section>

          {/* 7. Account Suspension */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Shield className="text-blue-500" />
              Account Suspension
            </h2>
            <p className="text-slate-600">
              We may suspend or terminate accounts that violate these Terms
              or pose legal or security risks.
            </p>
          </section>
        </div>

        <footer className="mt-20 text-center text-sm text-gray-400">
          © 2026 BastaStorage. All rights reserved.<br />
          Support: support@bastastorage.com
        </footer>
      </main>
    </div>
  );
};

export default Terms;
