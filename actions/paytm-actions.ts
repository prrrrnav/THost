"use server";

import { createClient } from "@/lib/supabase/server";
import { PAYTM_MID, PAYTM_MERCHANT_KEY, PAYTM_BASE_URL, generateSignature } from "@/lib/paytm";

export async function initiatePaytmTransaction(paymentId: string) {
    try {
        const supabase = await createClient();

        // 1. Get Payment Details
        const { data: payment, error: fetchError } = await supabase
            .from("payments")
            .select("*, tenants (id, name, phone, email)")
            .eq("id", paymentId)
            .single();

        if (fetchError || !payment) {
            throw new Error("Payment not found");
        }

        if (payment.status === "PAID") {
            throw new Error("Payment is already paid");
        }

        // 2. Generate a unique Order ID
        const orderId = `ORDER_${payment.id.replace(/-/g, "").substring(0, 10)}_${Date.now()}`;

        // 3. Construct Paytm Request Body
        const paytmParamsObj = {
            body: {
                requestType: "Payment",
                mid: PAYTM_MID,
                websiteName: "WEBSTAGING", // Change to "DEFAULT" or your website name for production
                orderId: orderId,
                callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paytm`,
                txnAmount: {
                    value: String(payment.amount),
                    currency: "INR",
                },
                userInfo: {
                    custId: payment.tenant_id,
                    mobile: payment.tenants?.phone || "",
                    email: payment.tenants?.email || "",
                },
            },
            head: {
                signature: "",
            },
        };

        // 4. Generate Signature
        const checksum = await generateSignature(paytmParamsObj.body, PAYTM_MERCHANT_KEY);
        paytmParamsObj.head.signature = checksum;

        // 5. Call Paytm API to get txnToken
        const initUrl = `${PAYTM_BASE_URL}/theia/api/v1/initiateTransaction?mid=${PAYTM_MID}&orderId=${orderId}`;

        const response = await fetch(initUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paytmParamsObj),
        });

        const data = await response.json();

        if (data.body.resultInfo.resultStatus === "S") {
            // 6. Update Database with the orderId
            const { error: updateError } = await supabase
                .from("payments")
                .update({
                    paytm_order_id: orderId,
                    status: "PROCESSING",
                })
                .eq("id", paymentId);

            if (updateError) {
                throw new Error("Failed to update payment order in database");
            }

            return {
                success: true,
                txnToken: data.body.txnToken,
                orderId,
                mid: PAYTM_MID,
                amount: payment.amount,
            };
        } else {
            throw new Error(data.body.resultInfo.resultMsg);
        }
    } catch (error: any) {
        console.error("Paytm Init Error:", error);
        return { success: false, error: error.message };
    }
}
