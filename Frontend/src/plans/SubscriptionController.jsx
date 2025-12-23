import React, { useContext, useEffect } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import { use } from 'react';
import { useState } from 'react';


export default function SubscriptionController() {
    const { PLAN_CATALOG, fetchCurrentSubscription, handlePauseSubscription, handleResumeSubscription, subscriptionMessage, currentSubscription, handleCancelSubscription } = useContext(BastaStorageContext)

    const [invoiceUrls, setInvoiceUrls] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        fetchCurrentSubscription();
    }, []);


    const monthlyPlans = PLAN_CATALOG["monthly"];
    const yearlyPlans = PLAN_CATALOG["yearly"];
    const currentPlan = monthlyPlans.find(plan => plan.id === currentSubscription?.planId) || yearlyPlans.find(plan => plan.id === currentSubscription?.planId);

    const isPaused = currentPlan?.id === currentSubscription?.planId && currentSubscription?.status === "paused";
    const isCancelled = currentPlan?.id === currentSubscription?.planId && currentSubscription?.status === "cancelled";

    // format date
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    // fetch invoice 
    const handleInvoiceDownload = async (subscriptionId) => {
        const response = await fetch(`http://localhost:2000/subscription/invoice/${subscriptionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        setInvoiceUrls(data.invoices);
    }

    useEffect(() => {
        handleInvoiceDownload(currentSubscription?.razorpaySubscriptionId);
    }, [currentSubscription]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-4 sm:p-8">

            {/* TOP NAVBAR */}
            <div className="max-w-5xl mx-auto mb-10">
                <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl shadow-lg border border-slate-200 rounded-3xl px-6 py-4">

                    {/* HOME BUTTON */}
                    <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-md  cursor-pointer transition transform hover:scale-105">
                        🏡Back To Home
                    </Link>

                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Subscription Panel
                    </h1>

                    {/* EMPTY BLOCK FOR ALIGNMENT */}
                    <div className="w-14" />
                </div>
            </div>


            {/* MAIN CONTENT */}
            <div className="max-w-5xl mx-auto space-y-10">

                {/* HEADER CARD */}
                <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-8 shadow-2xl border border-blue-200/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900">Your Subscription</h2>
                            <p className="text-slate-500 mt-1 text-sm">
                                Manage billing, invoices and your plan settings.
                            </p>
                        </div>

                        {currentSubscription && currentSubscription.status &&
                            <span className={`mt-4 sm:mt-0 px-4 py-1 rounded-full ${currentSubscription?.status === "active" ? "bg-green-500 text-white" : currentSubscription?.status === "paused" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"} text-sm font-bold shadow-md`}>

                                {currentSubscription?.status}
                                
                            </span>
                        }
                    </div>
                </div>


                {/* PLAN DETAILS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT CARD – PLAN INFO (Enhanced with Blue Border) */}
                    <div className="lg:col-span-2 rounded-3xl p-8 bg-white/90 backdrop-blur-xl shadow-2xl border-4 border-blue-500/50 hover:shadow-2xl transition-all relative overflow-hidden">

                        {/* Corner Decorative Element */}
                        <div className="absolute top-0 right-0 h-20 w-20 bg-blue-600/10 rounded-bl-3xl"></div>


                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            {/* Star Icon */}
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.84 2.064a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.84-2.064a1 1 0 00-1.175 0l-2.84 2.064c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.01 8.72c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Current Plan
                        </h3>

                        <p className="text-4xl font-extrabold text-slate-900">{currentPlan?.name}</p>
                        <p className="text-blue-500 text-sm mb-4 font-medium">{currentPlan?.tagline}</p>

                        <p className="text-5xl font-extrabold text-slate-900">
                            ₹{currentPlan?.price} <span className="text-slate-500 text-lg font-medium">{currentPlan?.period}</span>
                        </p>

                        {/* FEATURES */}
                        <div className="mt-8 space-y-3">
                            {currentPlan?.features.map((f) => (
                                <div key={f} className="flex items-center gap-2 text-slate-700">
                                    <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-base">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* RIGHT CARD – ACTIONS (Improved Buttons) */}
                    <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl shadow-lg border hover:shadow-2xl transition-all flex flex-col justify-between">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Subscription Controls</h3>

                        <div className="space-y-4">
                            {/* Primary Action (New: Upgrade/Change Plan) */}
                            <button
                                onClick={() => navigate('/plans')}
                                className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition transform hover:scale-[1.01]">
                                Upgrade / Change Plan
                            </button>

                            {/* Caution Action */}


                            {!isCancelled && (
                                <>

                                    {isPaused ?
                                        <button
                                            onClick={() => handleResumeSubscription(currentSubscription.razorpaySubscriptionId)}
                                            className="w-full px-4 py-3 rounded-xl bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition cursor-pointer">
                                            Resume Subscription
                                        </button> :
                                        <button
                                            onClick={() => handlePauseSubscription(currentSubscription.razorpaySubscriptionId)}
                                            className="w-full px-4 py-3 rounded-xl bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition cursor-pointer">

                                            Pause Subscription
                                        </button>
                                    }

                                    <button
                                        onClick={() => handleCancelSubscription(currentSubscription.razorpaySubscriptionId)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-red-600 text-red-600 font-semibold hover:bg-red-50 transition hover:text-red-700 cursor-pointer">
                                        Cancel Subscription
                                    </button>
                                </>

                            )}

                        </div>
                    </div>
                </div>


                {/* BILLING */}
                <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl shadow-lg border hover:shadow-2xl transition-all">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        {/* Billing Icon */}
                        <svg className="h-6 w-6 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Billing Details
                    </h3>

                    <div className="space-y-3 text-slate-700 text-base">
                        <p>Next Billing on: <span className="font-extrabold text-blue-600">{formatDate(currentSubscription?.chargeAt)}</span></p>
                        <p>Last Payment: <span className="font-semibold text-slate-900">₹{currentSubscription?.paymentAmount}</span> on <span className="text-slate-500">{formatDate(currentSubscription?.createdAt)}</span></p>
                    </div>
                </div>


                {/* INVOICE SECTION (Enhanced) */}
                <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl shadow-lg border hover:shadow-2xl transition-all">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Past Invoices</h3>

                    <div className="space-y-3">
                        {invoiceUrls && invoiceUrls.map((invoice) => (
                            <Link to={invoice.short_url}
                                key={invoice.short_url}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-5 rounded-2xl shadow border border-slate-100 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                            >
                                <div className='  w-full '>
                                    <div className="flex items-end justify-between gap-2">
                                        <p className="font-bold text-slate-900 text-xl">Invoice </p>
                                        <p className="text-slate-500 text-sm">{formatDate(invoice.billingDate * 1000)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-700 mt-2">₹{invoice.amountPaid / 100}</p>
                                    </div>
                                </div>


                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div >
    );
}