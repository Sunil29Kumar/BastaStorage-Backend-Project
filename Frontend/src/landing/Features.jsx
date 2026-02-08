const Features = () => {
  const features = [
    { 
        icon: "ri-google-fill", 
        title: "Google Drive Sync", 
        desc: "Seamlessly import your documents using official Google Picker API. Safe, fast, and 100% official.",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    { 
        icon: "ri-folder-shield-2-line", 
        title: "Smart Organization", 
        desc: "Create folders, rename assets, and manage your cloud vault with a familiar, easy-to-use interface.",
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    { 
        icon: "ri-share-forward-box-line", 
        title: "Secure Sharing", 
        desc: "Generate private or public shareable links for your files with full control over who sees what.",
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    { 
        icon: "ri-shield-flash-line", 
        title: "OAuth 2.0 Security", 
        desc: "Your passwords stay with Google. We use token-based auth to ensure your credentials are never stored.",
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    { 
        icon: "ri-search-eye-line", 
        title: "Read-Only Privacy", 
        desc: "Strictly follows Google's limited-use policy. We only access files you explicitly select to import.",
        color: "text-orange-600",
        bg: "bg-orange-50"
    },
    { 
        icon: "ri-dashboard-3-line", 
        title: "Storage Analytics", 
        desc: "Monitor your storage usage with detailed insights. Know exactly what's taking up space.",
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Core Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 ">
            Everything you need to <br /> 
            <span className="text-blue-600 not-italic">Rule your Cloud.</span>
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            BastaStorage brings all your digital assets under one roof with military-grade security and blazing-fast performance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col items-start"
            >
              <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <i className={`${f.icon} ${f.color} text-3xl`}></i>
              </div>
              
              <h4 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                {f.title}
              </h4>
              
              <p className="text-slate-500 leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;