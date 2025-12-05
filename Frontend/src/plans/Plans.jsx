import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { BastaStorageContext } from "../hooks/Context/ContextAPI";
import PlanCard from "./PlanCard.jsx";


const PLAN_CATALOG = {
    monthly: [
        {
            id: "plan_Rlq3ab5HeGgjyG",
            name: "Starter",
            tagline: "Perfect for basic personal backup",
            storage: "1 TB",
            price: 149,
            period: "/mo",
            cta: "Start with 1 TB",
            features: [
                "Secure cloud storage",
                "Basic link sharing",
                "Standard download speed",
            ],
            popular: true,
        },
        {
            id: "plan_Rlq7hitgvaDl8S",
            name: "Pro",
            tagline: "Best for creators & professionals",
            storage: "5 TB",
            price: 349,
            period: "/mo",
            cta: "Upgrade to 5 TB",
            features: [
                "Everything in Starter",
                "Faster uploads",
                "Email + Chat support",
                "Password-protected links",
            ],
            popular: false,
        },
        {
            id: "plan_Rlq9w3xcX5Dzqd",
            name: "Ultimate",
            tagline: "For teams & advanced users",
            storage: "10 TB",
            price: 799,
            period: "/mo",
            cta: "Go Unlimited",
            features: [
                "Everything in Pro",
                "Version history (30 days)",
                "Priority support",
                "Team management tools",
            ],
            popular: false,
        },
    ],

    yearly: [
        {
            id: "plan_Rlq6UhmQHI5dOm",
            name: "Starter",
            tagline: "Basic storage for individuals",
            storage: "1 TB",
            price: 1499,
            period: "/yr",
            cta: "Start with 1 TB",
            features: [
                "Secure cloud storage",
                "Basic link sharing",
                "Standard download speed",
            ],
            popular: true,
        },
        {
            id: "plan_Rlq8ww0f2qVHFb",
            name: "Pro",
            tagline: "Ideal for creators & devs",
            storage: "5 TB",
            price: 3499,
            period: "/yr",
            cta: "Upgrade to 5 TB",
            features: [
                "Everything in Starter",
                "Fast uploads",
                "Email + Chat support",
                "Password-protected links",
            ],
            popular: false,
        },
        {
            id: "plan_RlqB5gOigJ0THa",
            name: "Ultimate",
            tagline: "Teams & advanced users",
            storage: "10 TB",
            price: 7999,
            period: "/yr",
            cta: "Go Unlimited",
            features: [
                "Everything in Pro",
                "Version history (30 days)",
                "Priority support",
                "Team management tools",
            ],
            popular: false,
        },
    ],
};



export default function Plans() {
    const [mode, setMode] = useState("monthly");
    const plans = PLAN_CATALOG[mode];
    const [checking, setChecking] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    const navigate = useNavigate();
    const { getDirectoryItems } = useContext(BastaStorageContext)


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


    // handle create subscription
    async function handleCreateSubscription(planId) {
        // step 1: create subscription on backend
        const respone = await fetch("http://localhost:2000/subscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ planId }),
        });

        const data = await respone.json();
        console.log("Subscription created:", data);



        // step 2: open Razorpay checkout
        const rzp = new Razorpay({
            key: "rzp_test_Rlt6OLxXwUqVXj",
            subscription_id: data.subscriptionId,
            name: "BastaStorage",
            description: "Subscription Payment",
            handler: function (response) {
                if (response.razorpay_payment_id) {
                    setChecking(true);
                    startPolling(data.subscriptionId);
                }
            },
            notes: {
                plan_id: planId,
            }
        });
        rzp.open();
    }


    // Polling function to check subscription status
    function startPolling(subId) {
        const interval = setInterval(async () => {
            const res = await fetch(
                `http://localhost:2000/subscription/status/${subId}`,
                { credentials: "include" }
            );

            const data = await res.json();

            if (data.status === "active") {
                clearInterval(interval);
                setChecking(false);
                navigate("/");
                getDirectoryItems();
            }
        }, 3000);  // every 3 seconds
    }


    // get current subscription
    async function fetchCurrentSubscription() {
        const res = await fetch("http://localhost:2000/subscription/current", {
            credentials: "include",
        });
        const data = await res.json();
        // console.log(data);
        setCurrentSubscription(data.subscription);
    }

    useEffect(() => {
        fetchCurrentSubscription();
    }, []);


    // pause subscription
    async function handlePauseSubscription(subscriptionId) {
        const response = await fetch(`http://localhost:2000/subscription/pause/${subscriptionId}`, {
            method: "POST",
            credentials: "include",
        });
        const data = await response.json();
        console.log("Subscription paused:", data);
        fetchCurrentSubscription();
    }


    // Resume subscripition
    async function handleResumeSubscription(subscriptionId) {
        const response = await fetch(`http://localhost:2000/subscription/resume/${subscriptionId}`, {
            method: "POST",
            credentials: "include",
        });
        const data = await response.json();
        console.log("Subscription resumed:", data);
        fetchCurrentSubscription();
    }


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
                        onSelect={(p) => handleCreateSubscription(p.id)}
                        currentSubscription={currentSubscription}
                        handlePauseSubscription={handlePauseSubscription}
                        handleResumeSubscription={handleResumeSubscription}
                    />
                ))}
            </div>

            <p className="mt-10 text-xs text-slate-500 text-center">
                This is a demo. Integrate with Razorpay Subscriptions to enable billing.
            </p>


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
