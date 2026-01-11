import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import Subscription from '../../../Backend/models/subscriptionModel';

export default function SubscriptionController() {
    const {
        isDarkMode, // Assuming this comes from your context
        PLAN_CATALOG,
        fetchCurrentSubscription,
        handlePauseSubscription,
        handleResumeSubscription,
        subscriptionMessage,
        currentSubscription,
        handleCancelSubscription,
        BASE_URL
    } = useContext(BastaStorageContext);

    const [invoiceUrls, setInvoiceUrls] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentSubscription();
    }, []);

    const monthlyPlans = PLAN_CATALOG["monthly"] || [];
    const yearlyPlans = PLAN_CATALOG["yearly"] || [];
    const currentPlan = monthlyPlans.find(plan => plan.id === currentSubscription?.planId) ||
        yearlyPlans.find(plan => plan.id === currentSubscription?.planId);

    const isPaused = currentSubscription?.status === "paused";
    const isCancelled = currentSubscription?.status === "cancelled";
    const isExpired = currentSubscription?.status === "expired";

    const formatDate = (isoDate) => {
        if (!isoDate) return "N/A";
        return new Date(isoDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    const handleInvoiceDownload = async (subscriptionId) => {
        if (!subscriptionId) return;
        try {
            const response = await fetch(`${BASE_URL}/subscription/invoice/${subscriptionId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await response.json();
            setInvoiceUrls(data.invoices || []);
        } catch (error) {
            console.error("Invoice fetch error", error);
        }
    }

    useEffect(() => {
        if (currentSubscription?.razorpaySubscriptionId) {
            handleInvoiceDownload(currentSubscription.razorpaySubscriptionId);
        }
    }, [currentSubscription]);

    return (
        <div className={`min-h-screen transition-colors duration-500 p-4 sm:p-10 ${isDarkMode ? "bg-[#0b0c0d] text-white" : "bg-slate-50 text-slate-900"}`}>

            {/* TOP NAVIGATION */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className={`flex items-center justify-between backdrop-blur-2xl rounded-[2.5rem] px-8 py-5 border ${isDarkMode ? "bg-white/5 border-white/10 shadow-2xl shadow-black" : "bg-white/80 border-slate-200 shadow-xl shadow-blue-500/5"}`}>
                    <Link to="/" className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest hover:opacity-70 transition">
                        <i className="ri-arrow-left-line text-lg"></i> Dashboard
                    </Link>
                    <h1 className="text-xl font-black tracking-tight">Billing Center</h1>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN - PLAN INFO */}
                <div className="lg:col-span-8 space-y-8">

                    {/* CURRENT PLAN CARD */}
                    <div className={`relative overflow-hidden rounded-[3rem] p-10 border-4 ${isDarkMode ? "bg-[#111315] border-blue-500/20 shadow-black" : "bg-white border-blue-500/10 shadow-blue-500/5"} shadow-2xl`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <i className="ri- vip-crown-fill text-9xl text-blue-500"></i>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${currentSubscription?.status === "active" ? "bg-green-500/20 text-green-500 border border-green-500/30" :
                                    currentSubscription?.status === "paused" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                                        "bg-red-500/20 text-red-500 border border-red-500/30"
                                    }`}>
                                    {currentSubscription?.status || "No Active Plan"}
                                </span>
                            </div>

                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{currentPlan?.tagline || "Free Tier"}</h2>
                            <h3 className="text-5xl font-black mb-6">{currentPlan?.name || "Basta Storage Free Plan"}</h3>

                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-black tracking-tighter">₹{currentPlan?.price || 0}</span>
                                <span className="text-xl font-bold opacity-30">{currentPlan?.period || "month"}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentPlan?.features.map((f) => (
                                    <div key={f} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <i className="ri-check-line text-blue-500 font-bold"></i>
                                        </div>
                                        <span className="text-sm font-bold opacity-70">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BILLING TIMELINE */}

                    <div className={`rounded-[2.5rem] p-8 border ${isDarkMode ? "bg-[#111315] border-white/5" : "bg-white border-slate-100 shadow-lg shadow-blue-500/5"}`}>
                        <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                            <i className="ri-history-line text-blue-500"></i> Payment History
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"}`}>
                                <p className="text-[10px] uppercase font-black opacity-40 mb-1">Next Charge</p>
                                <p className="text-xl font-black text-blue-500">{formatDate(currentSubscription?.chargeAt)}</p>
                            </div>
                            <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"}`}>
                                <p className="text-[10px] uppercase font-black opacity-40 mb-1">Last Payment</p>
                                <p className="text-xl font-black">₹{currentSubscription?.payment?.paymentAmount || 0}</p>
                            </div>
                        </div>
                    </div>

                </div>



                {/* RIGHT COLUMN - CONTROLS & INVOICES */}


                <div className="lg:col-span-4 space-y-8">

                    {/* CONTROLS */}
                    {/* {!isCancelled && ( */}
                    <div className={`rounded-[2.5rem] p-8 border ${isDarkMode ? "bg-[#111315] border-white/5" : "bg-white border-slate-100 shadow-xl shadow-blue-500/5"}`}>
                        <h4 className="text-lg font-black mb-6 tracking-tight">Actions</h4>
                        <div className="space-y-4">
                            {(!isPaused || isExpired) && (
                                <button
                                    onClick={() => navigate('/plans')}
                                    disabled={isPaused}
                                    className={`w-full py-4 rounded-2xl  ${isPaused ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 cursor-pointer"} text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all`}>
                                    {isCancelled ? "Change My Plan" : currentSubscription?.status === "expired" ? "Renew My Plan" : "Upgrade / Change My Plan"}
                                </button>
                            )}


                            {/* {currentSubscription && (
                                    <> */}

                            {currentSubscription?.status && (

                                <>
                                    {(!isExpired && !isCancelled && !isExpired) && (
                                        <button onClick={() => isPaused ? handleResumeSubscription(currentSubscription.razorpaySubscriptionId) : handlePauseSubscription(currentSubscription.razorpaySubscriptionId)}
                                            className={`w-full py-4 rounded-2xl cursor-pointer font-black text-xs uppercase tracking-widest transition-all border-2 ${isPaused ? "bg-yellow-500 border-yellow-500 text-white" : "border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                                }`}>
                                            {isPaused ? "Resume Now" : "Pause Billing"}
                                        </button>

                                    )}
                                    {(!isPaused && !isCancelled && !isExpired && (
                                        <button onClick={() => handleCancelSubscription(currentSubscription.razorpaySubscriptionId)}
                                            className="w-full py-4 rounded-2xl border-2 cursor-pointer border-red-500/50 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                            End Subscription
                                        </button>)
                                    )}
                                </>


                            )}


                            {/* </>
                                )} */}
                        </div>
                    </div>
                    {/* )} */}



                    {/* INVOICE LIST */}

                    <div className={`rounded-[2.5rem] p-8 border max-h-[400px] overflow-y-auto custom-scrollbar ${isDarkMode ? "bg-[#111315] border-white/5" : "bg-white border-slate-100 shadow-xl shadow-blue-500/5"}`}>
                        <h4 className="text-lg font-black mb-6 tracking-tight">Receipts</h4>
                        <div className="space-y-3">
                            {invoiceUrls.length > 0 ? invoiceUrls.map((inv, index) => (
                                <a key={index} href={inv.short_url} target="_blank" rel="noreferrer"
                                    className={`flex items-center justify-between p-4 cursor-pointer rounded-2xl border transition-all ${isDarkMode ? "bg-white/5 border-white/5 hover:border-blue-500/50" : "bg-slate-50 border-slate-100 hover:border-blue-500 hover:bg-white"}`}>
                                    <div>
                                        <p className="font-black text-[13px]">Invoice #{index + 1}</p>
                                        <p className="text-[10px] opacity-40 font-bold uppercase">{formatDate(inv.billingDate * 1000)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-blue-500 text-sm">₹{inv.amountPaid / 100}</p>
                                        <i className="ri-download-cloud-line opacity-30"></i>
                                    </div>
                                </a>
                            )) : (
                                <p className="text-center text-xs opacity-40 py-10 font-bold">No invoices found</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>

            {/* FLOATING NOTIFICATION */}
            {
                subscriptionMessage && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 duration-300">
                        <div className="bg-blue-600 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 border border-white/20 backdrop-blur-xl">
                            {subscriptionMessage}
                        </div>
                    </div>
                )
            }
        </div >
    );
}