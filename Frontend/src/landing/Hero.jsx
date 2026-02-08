import { Link } from "react-router-dom";

const Hero = () => (
  <header className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
    {/* Background Decorative Blobs */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-100/50 blur-[100px] rounded-full"></div>
    </div>

    {/* Verified Badge */}
    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold mb-8 animate-fade-in">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
      </span>
      Google Drive Verified Integration 🚀
    </div>

    {/* Main Heading */}
    <h2 className="text-5xl md:text-7xl font-[1000] text-slate-900 mb-8 leading-[1.1] tracking-tight">
      Stop Searching. <br />
      <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
        Start Organizing.
      </span>
    </h2>

    {/* Catchy Description */}
    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
      BastaStorage isn't just another cloud. It's your personal digital vault. 
      <span className="hidden md:inline"> Import from Google Drive in seconds, secure your assets with 256-bit encryption, and access everything from any device.</span>
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
      <Link 
        to="/Register"
        className="group relative w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all hover:bg-blue-600 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-95 overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Create Free Account <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
        </span>
      </Link>
      
      <button className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-slate-200 bg-white px-10 py-4 rounded-2xl text-lg font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/50 transition-all active:scale-95">
        <i className="ri-play-fill text-2xl text-blue-600"></i> See How it Works
      </button>
    </div>

    {/* Trust Signals (Micro Copy) */}
    <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
       <div className="flex items-center gap-2 font-bold text-slate-800">
         <i className="ri-shield-user-fill text-xl text-blue-600"></i> Secure OAuth 2.0
       </div>
       <div className="flex items-center gap-2 font-bold text-slate-800">
         <i className="ri-flashlight-fill text-xl text-yellow-500"></i> Blazing Fast
       </div>
       <div className="flex items-center gap-2 font-bold text-slate-800">
         <i className="ri-google-fill text-xl text-red-500"></i> Drive Native
       </div>
    </div>
  </header>
);

export default Hero;