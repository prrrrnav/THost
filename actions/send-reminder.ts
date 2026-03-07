"use server";

export async function sendTestRentReminder() {
    try {
        // 2. Hardcode a mock "Tenant" object
        const today = new Date();
        const dueDateObj = new Date(today);
        dueDateObj.setDate(today.getDate() + 3);

        const formattedDueDate = dueDateObj.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        const tenant = {
            rentAmount: 1, // ₹1
            dueDate: formattedDueDate,
            // REPLACE with your registered test WhatsApp number (including country code, e.g., "919876543210")
            phoneNumber: "919335594828",
            // REPLACE with your actual UPI ID (e.g., "9876543210@paytm")
            pgOwnerUpiId: "9335594828@superyes",
            pgOwnerName: "THost Testing"
        };

        // 3. Generate UPI Link
        // Format: upi://pay?pa=<upi_id>&pn=<payee_name>&am=<amount>&cu=INR
        const upiLink = `upi://pay?pa=${tenant.pgOwnerUpiId}&pn=${encodeURIComponent(
            tenant.pgOwnerName
        )}&am=${tenant.rentAmount}&cu=INR`;

        // 4. Generate QR Code URL via QuickChart
        const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
            upiLink
        )}&size=300`;

        // 5. Send via WhatsApp Cloud API
        const whatsappToken = process.env.WHATSAPP_TEST_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!whatsappToken || !phoneNumberId) {
            throw new Error(
                "WhatsApp environment variables are missing. Please check your .env.local file."
            );
        }

        const apiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

        // Using an image message payload, which allows us to send the QuickChart QR as media
        // and the requested text as the caption.
        const messageCaption = `Hi, your rent of ₹${tenant.rentAmount} is due in 3 days (${tenant.dueDate}). Pay via this link: ${upiLink}`;

        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: tenant.phoneNumber,
            type: "image",
            image: {
                link: qrCodeUrl,
                caption: messageCaption,
            },
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${whatsappToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("WhatsApp Cloud API Error:", data);
            return {
                success: false,
                error: data.error?.message || "Failed to send WhatsApp message"
            };
        }

        return { success: true, messageId: data.messages?.[0]?.id, data };
    } catch (error: any) {
        console.error("Error sending test reminder:", error);
        return { success: false, error: error.message };
    }
}
