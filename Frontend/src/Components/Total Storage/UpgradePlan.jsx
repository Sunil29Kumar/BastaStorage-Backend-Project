import { Link } from "react-router-dom";
import { BastaStorageContext } from "../../hooks/Context/ContextAPI";
import { useContext } from "react";

function UpgradePlanCard() {
    const { isNavMinimized } =
        useContext(BastaStorageContext);

    return (
        <Link
            to="/plans"
            className={`
        flex gap-4 overflow-hidden
        rounded-xl ${!isNavMinimized ? "py-3 px-2" : "py-2 px-1"}
        bg-gradient-to-br from-blue-50 to-indigo-50
        border border-blue-100
        shadow-sm
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5
      `}
        >

            {/* Icon */}
            <div className={`${!isNavMinimized ? "w-12 h-12":"w-10 h-10"} rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md`}>
                <i className="ri-folder-cloud-line text-xl text-white"></i>
            </div>

            {/* Content */}
            {!isNavMinimized && (
                <div className="">
                    <h3 className="text-sm font-semibold text-gray-800">
                        Upgrade to{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                            PRO
                        </span>
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Unlock unlimited storage.
                    </p>

                    {/* CTA */}
                    <Link
                        to="/plans"
                        className="
              inline-flex items-center justify-between w-full  rounded-lg mt-2 text-sm font-medium transition-all duration-300  hover:text-blue-400 group"
                    >
                        Upgrade Now
                        <i className="ri-arrow-right-s-fill text-lg transition-transform group-hover:translate-x-1"></i>
                    </Link>
                </div>
            )}
        </Link>
    );
}

export default UpgradePlanCard;
