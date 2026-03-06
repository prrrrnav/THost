import React from 'react';

export const metadata = {
    title: 'Cancellation & Refund Policy | THost',
    description: 'Cancellation and Refund Policy for THost PG Management System',
};

export default function RefundsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 selection:bg-zinc-800 selection:text-zinc-100">
            <div className="max-w-4xl mx-auto">
                <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-8 tracking-tight">Cancellation &amp; Refund Policy</h1>

                    <div className="space-y-8 text-zinc-300 leading-relaxed">
                        <section>
                            <p className="text-sm text-zinc-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                            <p>
                                At THost, we strive to ensure a transparent and fair payment experience for both our SaaS subscribers (PG Owners) and the end-users (Tenants). This policy outlines the conditions under which cancellations and refunds are processed.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">1. SaaS Subscription Refunds (For PG Owners)</h2>
                            <p>
                                THost offers SaaS plans to PG Owners for managing their accommodations. Our policy regarding subscription payments is as follows:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong className="text-zinc-200">7-Day Refund Window:</strong> If you are a new subscriber, you may request a full refund within the first 7 days of your initial subscription purchase if you find the platform unsuitable for your needs.
                                </li>
                                <li>
                                    <strong className="text-zinc-200">Post 7-Day Cancellations:</strong> After the initial 7-day period, all subscription charges are strictly non-refundable. You may cancel your subscription at any time to prevent future billing, and you will retain access to the platform until the end of your current billing cycle.
                                </li>
                            </ul>
                            <p>
                                To request a subscription refund within the eligible window, please contact our billing support at billing@thost.com.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">2. Tenant Rent and Deposit Refunds (Important)</h2>
                            <p>
                                THost strictly acts as an intermediary technology platform and payment facilitator for collecting rent, security deposits, and maintenance fees on behalf of the PG Owners.
                            </p>
                            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl space-y-3 mt-4">
                                <p className="text-zinc-200 font-medium">
                                    Disclaimer of Liability for Tenant Payments
                                </p>
                                <p>
                                    Any payments made by a Tenant (including UPI, Cards, Netbanking) through the THost platform are directly settled into the respective PG Owner&apos;s linked bank account. Therefore, THost is not liable for refunding rent payments, security deposits, or any other tenant fees.
                                </p>
                            </div>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>
                                    <strong className="text-zinc-200">Dispute Resolution:</strong> All disputes regarding refunds for rent, early move-outs, property maintenance issues, or security deposit settlements must be resolved directly between the Tenant and the PG Owner.
                                </li>
                                <li>
                                    <strong className="text-zinc-200">Chargebacks:</strong> If a payment fails or is marked as a chargeback, our payment gateway partner will investigate the issue. However, THost cannot initiate a refund on behalf of the PG owner without their explicit authorization.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">3. Failed Transactions</h2>
                            <p>
                                In the event of a failed transaction where the amount has been deducted from the user&apos;s bank account but not credited to the THost platform or the PG Owner&apos;s account, the amount will typically be auto-refunded by the user&apos;s bank or the payment gateway within 5 to 7 business days.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-white/10 mt-12">
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">4. Contact Us</h2>
                            <p>
                                For any payment-related queries or SaaS subscription matters, please reach out to our team:
                            </p>
                            <ul className="list-none space-y-1 mt-2">
                                <li>Email: support@thost.com</li>
                                <li>Phone: +91 XXXXXXXXXX</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
