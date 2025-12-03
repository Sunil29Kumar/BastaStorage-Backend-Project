import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


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
            popular: false,
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
            popular: true, // MOST POPULAR
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
            popular: false,
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
            popular: true,
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





function Price({ value }) {
    return (
        <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-slate-700">₹</span>
            <span className="text-4xl font-bold tracking-tight text-slate-900">
                {value}
            </span>
        </div>
    );
}

function PlanCard({ plan, onSelect }) {
    return (
        <div
            className={`relative flex flex-col rounded-2xl border backdrop-blur-xl bg-white/60 p-6 shadow-lg transition hover:scale-[1.02] ${plan.popular
                ? "border-blue-600 shadow-blue-200 ring-2 ring-blue-400/30"
                : "border-slate-200"
                }`}
        >
            {plan.popular && (
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                    Most Popular
                </div>
            )}

            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.tagline}</p>
                </div>
                <span className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs text-slate-700">
                    {plan.storage}
                </span>
            </div>

            <div className="mb-4 flex items-end gap-2">
                <Price value={plan.price} />
                <span className="mb-2 text-sm text-slate-500">{plan.period}</span>
            </div>

            <ul className="mb-5 space-y-3 text-sm text-slate-600">
                {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <svg
                            className="mt-0.5 h-4 w-4 text-blue-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                        >
                            <path
                                d="M5 13l4 4L19 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>{f}</span>
                    </li>
                ))}
            </ul>

            <button
                // onClick={() => onSelect?.(plan)}
                onClick={() => onSelect(plan)}
                className={`mt-auto w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
            >
                {plan.cta}
            </button>
        </div>
    );
}

export default function Plans() {
    const [mode, setMode] = useState("monthly");
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
                console.log("Payment successful:", response);
            },
            notes: {
                plan_id: planId,
            },
            theme: {
                color: "#3399cc",
            },
        });
        rzp.open();
    }


    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            {/* Hero Section */}
            <div className="text-center mb-10">
                <Link to="/" className="text-blue-600 font-bold text-md mb-4 inline-block">Back to Home</Link>
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
                    />
                ))}
            </div>

            <p className="mt-10 text-xs text-slate-500 text-center">
                This is a demo. Integrate with Razorpay Subscriptions to enable billing.
            </p>
        </div>
    );
}
