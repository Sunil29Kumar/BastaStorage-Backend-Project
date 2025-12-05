export default function PlanCard({ plan, onSelect, currentSubscription, handlePauseSubscription,handleResumeSubscription }) {
    const isCurrent = plan.id === currentSubscription?.planId && currentSubscription?.status === "active";
    const isPaused = plan.id === currentSubscription?.planId && currentSubscription?.status === "paused";

    return (
        <div
            className={`relative flex flex-col rounded-3xl border p-6 shadow-sm bg-white/70 
            backdrop-blur-xl transition-all duration-300 
            hover:shadow-xl hover:-translate-y-1
            
            ${plan.popular
                    ? "border-blue-500 shadow-blue-200 ring-2 ring-blue-400/30"
                    : "border-slate-200"
                }`}
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="absolute -top-3 right-4 bg-blue-600 text-white text-xs px-3 py-1 font-medium rounded-full shadow">
                    ⭐ Best Value
                </div>
            )}

            {/* Current Plan Badge */}
            {currentSubscription?.planId === plan.id && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xl px-4 py-1 font-semibold rounded-full shadow">
                    ✔ Current Plan
                </div>
            )}

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.tagline}</p>
                </div>

                <span className="rounded-full border px-3 py-1 text-xs bg-white/90 border-slate-300 text-slate-700 font-medium">
                    {plan.storage}
                </span>
            </div>

            {/* Price */}
            <div className="mb-6">
                <div className="flex items-end gap-1">
                    <span className="text-lg font-semibold text-slate-700">₹</span>
                    <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                        {plan.price}
                    </span>
                    <span className="mb-2 text-sm text-slate-500">{plan.period}</span>
                </div>
            </div>

            {/* Features */}
            <ul className="flex-1 mb-6 space-y-3 text-sm text-slate-700">
                {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <svg
                            className="h-5 w-5 text-blue-600"
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
                        <span className="leading-tight">{f}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            {isCurrent || isPaused ? (
                isPaused ? <div className="flex gap-3">
                    <button
                        onClick={() => handleResumeSubscription(currentSubscription?.razorpaySubscriptionId)}
                        className="w-1/2 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition">
                        Resume
                    </button>
                </div>
                    :
                    <div className="flex gap-3">
                        <button
                            onClick={() => handlePauseSubscription(currentSubscription?.razorpaySubscriptionId)}
                            className="w-1/2 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition">
                            Pause
                        </button>
                        <button className="w-1/2 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                            Cancel
                        </button>
                    </div>
            ) : (
                <button
                    onClick={() => onSelect(plan)}
                    className={`mt-auto w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all
                    ${plan.popular
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                >
                    {plan.cta}
                </button>
            )}
        </div>
    );
}
