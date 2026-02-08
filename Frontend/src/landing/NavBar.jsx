import { Link } from "react-router-dom";

const Navbar = () => (
    <nav className="flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100/50">
        {/* Left Side: Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-xl transition-transform group-hover:scale-105 active:scale-95">
                <img
                    src="/bst logo.png"
                    className="h-10 w-auto object-contain"
                    alt="BastaStorage Logo"
                />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                BastaStorage
            </h1>
        </Link>

        {/* Right Side: Navigation Links */}
        <div className="flex items-center gap-8">

            <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>  

            <div className="flex items-center gap-4">
                <Link 
                    to="/Login" 
                    className="text-gray-600 hover:text-blue-600 font-bold text-sm transition px-2"
                >
                    Login
                </Link>
                <Link 
                    to="/Register" 
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_25px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-700 transition-all active:scale-95"
                >
                    Get Started
                </Link>
            </div>
        </div>
    </nav>
);

export default Navbar;