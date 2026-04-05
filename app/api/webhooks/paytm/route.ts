import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySignature, PAYTM_MID, PAYTM_MERCHANT_KEY, PAYTM_BASE_URL, generateSignature } from "@/lib/paytm";

// We need a Service Role client to bypass RLS in the webhook
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function sendWhatsAppReceipt(phoneNumber: string, amount: number, txnId: string, month: string) {
    const whatsappToken = process.env.WHATSAPP_TEST_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !phoneNumberId) return;

    const apiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const messageText = `✅ Payment Successful!\n\nYour rent payment of ₹${amount} for ${month} was received successfully.\nTransaction ID: ${txnId}\n\nThank you for choosing THost!`;

    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "text",
        text: { body: messageText },
    };

    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${whatsappToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("WhatsApp Receipt Error:", error);
    }
}

export async function POST(req: Request) {
    try {
        // Paytm sends data as application/x-www-form-urlencoded typically
        const contentType = req.headers.get("content-type") || "";
        let bodyObj: Record<string, any> = {};

        if (contentType.includes("application/json")) {
            bodyObj = await req.json();
        } else {
            const formData = await req.formData();
            formData.forEach((value, key) => {
                bodyObj[key] = value.toString();
            });
        }

        // 1. Verify Checksum
        const paytmChecksum = bodyObj.CHECKSUMHASH;
        delete bodyObj.CHECKSUMHASH;

        // Sort keys and format as expected by verifySignature (Paytm requires string verification)
        const isVerifySignature = await verifySignature(bodyObj, paytmChecksum, PAYTM_MERCHANT_KEY);

        if (!isVerifySignature) {
            console.error("Checksum Mismatch");
            return NextResponse.json({ success: false, error: "Checksum Mismatch" }, { status: 400 });
        }

        const orderId = bodyObj.ORDERID;

        // 2. Validate with Transaction Status API (Anti-Spoofing)
        const statusParams = {
            body: {
                mid: PAYTM_MID,
                orderId: orderId,
            },
            head: {
                signature: "",
            }
        };

        statusParams.head.signature = await generateSignature(statusParams.body, PAYTM_MERCHANT_KEY);

        const statusUrl = `${PAYTM_BASE_URL}/v3/order/status`;
        const statusRes = await fetch(statusUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(statusParams),
        });

        const statusData = await statusRes.json();
        const resultInfo = statusData.body.resultInfo;

        // 3. Update Database based on the true Status
        if (resultInfo.resultStatus === "TXN_SUCCESS") {
            const { data: payment, error: fetchError } = await supabase
                .from("payments")
                .select("*, tenants (phone)")
                .eq("paytm_order_id", orderId)
                .single();

            if (!fetchError && payment && payment.status !== "PAID") {
                await supabase
                    .from("payments")
                    .update({
                        status: "PAID",
                        paytm_txn_id: statusData.body.txnId,
                        payment_method: statusData.body.paymentMode || "UPI",
                        amount_paid: statusData.body.txnAmount,
                        payment_date: new Date().toISOString()
                    })
                    .eq("id", payment.id);

                // 4. Send WhatsApp Receipt
                if (payment.tenants?.phone) {
                    await sendWhatsAppReceipt(
                        payment.tenants.phone,
                        statusData.body.txnAmount,
                        statusData.body.txnId,
                        payment.month_year || payment.month || "the month"
                    );
                }
            }
        } else if (resultInfo.resultStatus === "TXN_FAILURE") {
            await supabase
                .from("payments")
                .update({ status: "FAILED" })
                .eq("paytm_order_id", orderId);
        }

        // 5. Acknowledge Receipt to Paytm
        return NextResponse.json({ success: true, message: "Webhook processed" }, { status: 200 });
    } catch (error) {
        console.error("Paytm Webhook Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
