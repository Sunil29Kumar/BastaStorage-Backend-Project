import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-16 px-3 border-t border-slate-800">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <img src="/bst logo.png" className="h-8 object-contain" alt="logo" />
            <span className="text-xl font-bold text-white tracking-tight">BastaStorage</span>
          </div>
          <p className="text-sm leading-relaxed opacity-80 font-medium">
            Next-generation cloud management. Simple, secure, and built for productivity.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="text-white font-bold mb-6 italic">Product</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
            <li><a href="#demoPlans" className="hover:text-blue-400 transition">Pricing Plans</a></li>
            <li><a href="#faq" className="hover:text-blue-400 transition">FAQs</a></li>
          </ul>
        </div>

        {/* Legal Links (Google ke liye Sabse Zaroori) */}
        <div>
          <h4 className="text-white font-bold mb-6 italic">Legal</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/privacy-policy" className="hover:text-blue-400 transition text-blue-400/80">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-400 transition">Terms of Service</Link></li>
          </ul>
        </div>

       
      </div>

      <div className=" flex justify-center items-end  border-t border-slate-800  text-xs font-bold tracking-widest opacity-50">
        <p>© 2026 BASTASTORAGE. ALL RIGHTS RESERVED.</p>
       
      </div>
    </div>
  </footer>
);

export default Footer;