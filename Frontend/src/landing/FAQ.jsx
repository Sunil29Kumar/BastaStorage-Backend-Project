import React, { useState } from 'react';

const FAQ = () => {
    const [active, setActive] = useState(null);

    const faqs = [
        {
            q: "How secure is my data with BastaStorage?",
            a: "Security is built into every layer. We use industry-standard encryption to protect your account credentials. Your files are stored in highly secure AWS S3 buckets and accessed via 'Signed URLs,' ensuring that your data is never public and is only accessible through secure, time-limited authorized sessions. Combined with Google OAuth 2.0, we ensure your data stays private and under your control."
        },
        {
            q: "Can I cancel my subscription at any time?",
            a: "Yes! You have full control. You can cancel your subscription with just one click from your dashboard settings. You will continue to have access to your premium features until the end of your current billing cycle."
        },
        {
            q: "Do you offer refunds?",
            a: "Currently, we do not offer refunds once a subscription is active. However, you can cancel at any time to prevent future charges. We recommend trying our Free Plan to explore all features before upgrading to a paid tier."
        },
        {
            q: "Why do you need Google Drive permissions?",
            a: "We only use the 'Read-Only' permission to let you select and import your documents into BastaStorage. This process uses Google's secure Picker API, ensuring we don't have access to your entire drive."
        }
    ];

    const toggle = (i) => {
        if (active === i) return setActive(null);
        setActive(i);
    };

    return (
        <section id="faq" className="py-24 bg-gray-50/50">
            <div className="max-w-3xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">Questions?</h2>
                    <h3 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h3>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
                    {faqs.map((item, i) => (
                        <div
                            key={i}
                            className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${active === i ? 'border-blue-400 shadow-lg' : 'border-slate-200'}`}
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className={`font-bold text-lg ${active === i ? 'text-blue-600' : 'text-slate-800'}`}>
                                    {item.q}
                                </span>
                                <i className={`${active === i ? 'ri-subtract-line rotate-180' : 'ri-add-line'} text-2xl transition-all duration-300 text-slate-400`}></i>
                            </button>

                            <div className={`transition-all duration-300 ease-in-out ${active === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                <p className="px-6 pb-6 text-slate-500 leading-relaxed font-medium">
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Support Call-out */}
                {/* <div className="mt-12 text-center p-8 rounded-3xl bg-blue-600 text-white shadow-xl">
                    <h4 className="text-xl font-bold mb-2">Still have questions?</h4>
                    <p className="opacity-90 mb-6 text-sm">We're here to help you 24/7 with any storage or security concerns.</p>
                    <a href="mailto:support@bastastorage.me" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
                        Contact Support
                    </a>
                </div> */}
            </div>
        </section>
    );
};

export default FAQ;