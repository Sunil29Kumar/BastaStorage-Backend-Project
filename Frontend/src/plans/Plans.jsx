import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import PlanCard from "./PlanCard.jsx";

import TermsPrivacyFooter from "../Components/legal/TermsPrivacyFooter.jsx";




export default function Plans() {
    const [mode, setMode] = useState("monthly");


    const { PLAN_CATALOG, checking, isClickOnSubscribe, createSubscription, fetchCurrentSubscription, handlePauseSubscription, handleResumeSubscription, currentSubscription } = useContext(BastaStorageContext)

    const plans = PLAN_CATALOG[mode];


    // Load Razorpay script
    useEffect(() => {
        const existingScript = document.getElementById("razorpay-script");
        if (existingScript) return;
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.id = "razorpay-script";
        document.body.appendChild(script);
    }, []);


    useEffect(() => {
        fetchCurrentSubscription();
    }, []);


    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            {/* Hero Section */}
            <div className="text-center mb-10">
                <Link to="/" className="text-blue-600 font-bold text-md mb-4 inline-block">🏡 Back to Home</Link>
                <h1 className="text-4xl font-bold text-slate-900">BastaStorage Plans</h1>
                <h1 className="text-2xl  text-slate-500">Choose Your Plan</h1>

            </div>

            {/* Toggle Switch */}
            <div className="flex justify-center mb-10">
                <div className="flex items-center bg-slate-100 px-2 py-1 rounded-full shadow-inner">
                    <button
                        onClick={() => setMode("monthly")}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition ${mode === "monthly"
                            ? "bg-slate-900 text-white shadow"
                            : "text-slate-700"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setMode("yearly")}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition ${mode === "yearly"
                            ? "bg-blue-600 text-white shadow"
                            : "text-slate-700"
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <PlanCard
                        key={`${mode}-${plan.id}`}
                        plan={plan}
                        onSelect={(p) => createSubscription(p.id)}
                        currentSubscription={currentSubscription}
                        handlePauseSubscription={handlePauseSubscription}
                        handleResumeSubscription={handleResumeSubscription}
                        isClickOnSubscribe={isClickOnSubscribe}
                    />
                ))}
            </div>

            <p className="mt-10 text-xs text-slate-500 text-center">
                This is a demo. Integrate with Razorpay Subscriptions to enable billing.
            </p>

            {/* <PolicyFooter /> */}
            <TermsPrivacyFooter />


            {/* payment verification */}
            {checking && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center">
                    <div className="text-center text-white">
                        <div className="loader"></div>
                        <p className="mt-3 text-lg">
                            Verifying payment…
                            <br />
                            Please wait, don’t refresh or close this tab.
                        </p>
                    </div>
                </div>
            )}




        </div>
    );
}
