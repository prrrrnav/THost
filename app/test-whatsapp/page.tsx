"use client";

import { useState } from "react";
import { sendTestRentReminder } from "@/actions/send-reminder";

export default function TestWhatsappPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleTest = async () => {
        setLoading(true);
        setResult(null);
        try {
            const response = await sendTestRentReminder();
            setResult(response);
            console.log("WhatsApp Test Response:", response);
        } catch (error) {
            console.error("Client Error:", error);
            setResult({ success: false, error: String(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 gap-6 font-sans">
            <div className="max-w-md w-full space-y-6 text-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Test WhatsApp Reminder</h1>
                    <p className="text-zinc-400 text-sm mt-2">
                        Click the button below to fire the <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">sendTestRentReminder</code> Server Action.
                    </p>
                </div>

                <button
                    onClick={handleTest}
                    disabled={loading}
                    className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-2.5 rounded-md transition-all active:scale-[0.98]"
                >
                    {loading ? "Sending Message..." : "Send Test Reminder"}
                </button>

                {result && (
                    <div className={`mt-6 p-4 rounded-md text-left text-sm overflow-auto transition-all ${result.success
                            ? "bg-emerald-950/30 text-emerald-300 border border-emerald-900"
                            : "bg-red-950/30 text-red-300 border border-red-900"
                        }`}>
                        <h3 className="font-semibold mb-2">
                            {result.success ? "✅ Message Sent Successfully" : "❌ Failed to Send"}
                        </h3>
                        <pre className="whitespace-pre-wrap break-words text-xs font-mono">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
