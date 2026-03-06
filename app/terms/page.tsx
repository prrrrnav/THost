import React from 'react';

export const metadata = {
    title: 'Terms and Conditions | THost',
    description: 'Terms and Conditions for THost PG Management System',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8 selection:bg-zinc-800 selection:text-zinc-100">
            <div className="max-w-4xl mx-auto">
                <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-8 tracking-tight">Terms and Conditions</h1>

                    <div className="space-y-8 text-zinc-300 leading-relaxed">
                        <section>
                            <p className="text-sm text-zinc-400 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
                            <p>
                                Welcome to THost. These Terms and Conditions govern your access to and use of the THost website, platform, and related services. By accessing or using our platform, you agree to be bound by these terms.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">1. Nature of the Platform</h2>
                            <p>
                                THost acts strictly as a technology platform and Software-as-a-Service (SaaS) provider. We provide management tools, payment facilitation, and operational software for Paying Guest (PG) accommodations, hostels, and co-living spaces.
                            </p>
                            <p className="font-medium text-zinc-200">
                                Important: THost is not a landlord, property manager, or real estate broker. We do not own, operate, or manage the physical PG properties listed or managed through our platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">2. Responsibilities of PG Owners</h2>
                            <p>
                                If you are a PG Owner or operator using THost to manage your property, you acknowledge and agree that:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>You are solely responsible for the physical maintenance, safety, and security of your property.</li>
                                <li>You are responsible for resolving any disputes directly with your tenants.</li>
                                <li>You must ensure full compliance with all local laws, municipal regulations, police verifications, and KYC requirements for your tenants in India.</li>
                                <li>THost takes no liability for the actions, behavior, or defaults of the tenants you board.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">3. Platform Access and Acceptable Use</h2>
                            <p>
                                You agree not to misuse the THost platform. Misuse includes, but is not limited to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Using the platform for fraudulent transactions or money laundering.</li>
                                <li>Attempting to breach, test, or circumvent the platform&apos;s security measures.</li>
                                <li>Uploading malicious code or exploiting vulnerabilities in the SaaS infrastructure.</li>
                            </ul>
                            <p>
                                We reserve the right to suspend or terminate your access to the platform immediately, without prior notice, if we suspect any breach of these Terms of Service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">4. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by Indian law, THost shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business goodwill, resulting from your use of the platform or the actions of third parties (including tenants or PG owners).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-100">5. Governing Law and Jurisdiction</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in India.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-white/10 mt-12">
                            <h2 className="text-xl font-semibold text-zinc-100 mb-4">6. Contact Information</h2>
                            <p>
                                If you have any questions or concerns regarding these Terms and Conditions, please contact us at legal@thost.com.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
