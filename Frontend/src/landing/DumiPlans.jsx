import React, { useState } from 'react';

const DumiPlans = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const PLAN_CATALOG = {
        monthly: [
            {
                id: "free_plan",
                name: "Free",
                tagline: "Basic storage for personal use",
                storage: "500 MB",
                price: 0,
                period: "/forever",
                cta: "Current Plan",
                features: [
                    "500 MB Secure Cloud Storage",
                    "Personal Folder Limit (20 max)",
                    "Basic File Sharing (20 max)",
                    "GD Import (Max 50MB per file)",
                    "Single File/Folder Deletion",
                    "Access on 1 Device only",
                ],
                popular: false,
            },
            {
                id: "plan_Rlq3ab5HeGgjyG",
                name: "Starter",
                tagline: "Perfect for basic personal backup",
                storage: "1 TB",
                price: 149,
                period: "/mo",
                cta: "Start with 1 TB",
                features: [
                    "1 TB Secure Storage",
                    "Expanded Folders (Up to 100)",
                    "Enhanced Sharing (Up to 100 files)",
                    "Smart GD Sync (Max 1GB per file)",
                    "Bulk File & Folder Import (GD)",
                    "Multi-file Actions & Deletion",
                    "Access on 2 Devices",
                    "GST Invoice & Email Support",
                ],
                popular: true,
            },
            {
                id: "plan_Rlq7hitgvaDl8S",
                name: "Pro",
                tagline: "For creators & professionals",
                storage: "5 TB",
                price: 349,
                period: "/mo",
                cta: "Upgrade to 5 TB",
                features: [
                    "5 TB High-speed Storage",
                    "Advanced Folder Management (500 max)",
                    "Unlimited File Sharing links",
                    "Pro GD Sync (No file size limit)",
                    "Full Folder Structure Import (GD)",
                    "Advanced Multi-file Batch Actions",
                    "Access on 4 Devices",
                    "Priority Chat & Email Support",
                ],
                popular: false,
            },
            {
                id: "plan_Rlq9w3xcX5Dzqd",
                name: "Ultimate",
                tagline: "Power tools for teams & power users",
                storage: "10 TB",
                price: 799,
                period: "/mo",
                cta: "Go Unlimited",
                features: [
                    "10 TB Enterprise-Grade Storage",
                    "Unlimited Folders & Projects",
                    "Unlimited Sharing & Imports",
                    "Advanced Versioning & Recovery",
                    "Enterprise GD Sync (All-in-one)",
                    "Mass Delete & Data Management",
                    "Access on 8 Devices",
                    "Full Admin Controls & 24/7 Support",
                ],
                popular: false,
            },
        ],

        yearly: [
            {
                id: "free_plan",
                name: "Free",
                tagline: "Basic storage for personal use",
                storage: "500 MB",
                price: 0,
                period: "/forever",
                cta: "Current Plan",
                features: [
                    "500 MB Secure Cloud Storage",
                    "Personal Folder Limit (20 max)",
                    "Basic File Sharing (20 max)",
                    "GD Import (Max 50MB per file)",
                    "Single File/Folder Deletion",
                    "Access on 1 Device only",
                ],
                popular: false,
            },
            {
                id: "plan_Rlq6UhmQHI5dOm",
                name: "Starter",
                tagline: "Great value for yearly backup",
                storage: "1 TB",
                price: 1499,
                period: "/yr",
                cta: "Start with 1 TB",
                features: [
                    "1 TB Secure Storage",
                    "Expanded Folders (Up to 100)",
                    "Enhanced Sharing (Up to 100 files)",
                    "Smart GD Sync (Max 1GB per file)",
                    "Bulk File & Folder Import (GD)",
                    "Multi-file Actions & Deletion",
                    "Access on 2 Devices",
                    "GST Invoice & Email Support",
                ],
                popular: true,
            },
            {
                id: "plan_Rlq8ww0f2qVHFb",
                name: "Pro",
                tagline: "Best for professional long-term storage",
                storage: "5 TB",
                price: 3499,
                period: "/yr",
                cta: "Upgrade to 5 TB",
                features: [
                    "5 TB High-speed Storage",
                    "Advanced Folder Management (500 max)",
                    "Unlimited File Sharing links",
                    "Pro GD Sync (No file size limit)",
                    "Full Folder Structure Import (GD)",
                    "Advanced Multi-file Batch Actions",
                    "Access on 4 Devices",
                    "Priority Chat & Email Support",
                ],
                popular: false,
            },
            {
                id: "plan_RlqB5gOigJ0THa",
                name: "Ultimate",
                tagline: "Full enterprise power at scale",
                storage: "10 TB",
                price: 7999,
                period: "/yr",
                cta: "Go Unlimited",
                features: [
                    "10 TB Enterprise-Grade Storage",
                    "Unlimited Folders & Projects",
                    "Unlimited Sharing & Imports",
                    "Advanced Versioning & Recovery",
                    "Enterprise GD Sync (All-in-one)",
                    "Mass Delete & Data Management",
                    "Access on 8 Devices",
                    "Full Admin Controls & 24/7 Support",
                ],
                popular: false,
            },
        ],
    };


    const currentPlans = PLAN_CATALOG[billingCycle];

    return (
        <section id="demoPlans" className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 text-center">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Pricing</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Pick the perfect plan for your <span className="text-blue-600">Storage Needs</span>
                    </h3>
                </div>

                {/* Billing Toggle Switch */}
                <div className="flex justify-center items-center gap-4 mb-16">
                    <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-14 h-7 bg-slate-200 rounded-full relative p-1 transition-colors hover:bg-slate-300"
                    >
                        <div className={`w-5 h-5 bg-blue-600 rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>
                    <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                        Yearly <span className="text-green-500 text-[10px] bg-green-100 px-2 py-0.5 rounded-full ml-1 font-black">SAVE 15%</span>
                    </span>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentPlans.map((plan, i) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col p-8 rounded-[2.5rem] bg-white border-2 transition-all duration-300 hover:shadow-2xl ${plan.popular ? 'border-blue-600 shadow-xl scale-105 z-10' : 'border-slate-100 hover:border-blue-200'}`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                                    Most Popular
                                </span>
                            )}

                            <div className="mb-8">
                                <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{plan.name}</h4>
                                <p className="text-xs text-slate-500 font-medium h-8">{plan.tagline}</p>
                                <div className="mt-6 flex items-baseline justify-center gap-1 text-slate-900">
                                    <span className="text-4xl font-[1000]">₹{plan.price}</span>
                                    <span className="text-slate-400 font-bold text-sm">{plan.period}</span>
                                </div>
                                <div className="mt-2 text-blue-600 font-black text-lg uppercase tracking-tighter">
                                    {plan.storage} Storage
                                </div>
                            </div>

                            {/* Features List */}
                            <ul className="text-left space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 font-medium leading-tight">
                                        <i className="ri-checkbox-circle-fill text-blue-500 text-lg flex-shrink-0"></i>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${plan.popular ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 shadow-xl' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DumiPlans;