"use client";

import { useState } from "react";
import { sendTestRentReminder } from "@/actions/send-reminder";
import { MessageCircle } from "lucide-react";

export function TestWhatsappButton() {
    const [loading, setLoading] = useState(false);

    const handleTest = async () => {
        setLoading(true);
        try {
            const response = await sendTestRentReminder();
            console.log("WhatsApp Test Response:", response);
            if (response.success) {
                alert("✅ Message Sent Successfully! Check console for details.");
            } else {
                alert("❌ Failed to Send:\n\n" + JSON.stringify(response.error, null, 2));
            }
        } catch (error) {
            console.error("Client Error:", error);
            alert("❌ Error: " + String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleTest}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 h-9 px-4 py-2 ${loading ? "opacity-70 cursor-wait" : ""
                }`}
        >
            <MessageCircle className="h-4 w-4" />
            {loading ? "Sending..." : "Test WhatsApp"}
        </button>
    );
}
