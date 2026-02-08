const DashboardImage = () => {
  return (
    <section  className="relative py-20 px-6 flex justify-center bg-white">
      {/* Glow Effect behind the image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-blue-600/10 blur-[120px] -z-10 rounded-full"></div>

      <div className="relative group max-w-6xl w-full">
        {/* Browser Header Mockup */}
        <div className="bg-slate-900 rounded-t-2xl px-4 py-3 flex items-center gap-2 border-b border-slate-800 shadow-2xl">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="mx-auto bg-slate-800 text-[10px] text-slate-400 px-12 py-1 rounded-md border border-slate-700 font-mono">
            bastastorage.me/home
          </div>
        </div>

        {/* Image Container with 3D Effect */}
        <div className="relative overflow-hidden rounded-b-2xl border-x border-b border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] transition-all duration-700 group-hover:shadow-[0_70px_120px_-20px_rgba(37,99,235,0.2)]">
          <img
            src="/home-page.png" 
            alt="BastaStorage Dashboard Preview"
            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
          />
          
          {/* Subtle Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
};

export default DashboardImage;