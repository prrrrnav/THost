"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IndianRupee, Loader2 } from "lucide-react";
import { initiatePaytmTransaction } from "@/actions/paytm-actions";
import { toast } from "sonner";
import Script from "next/script";

interface PaytmCheckoutButtonProps {
    paymentId: string;
    amount: number;
}

export function PaytmCheckoutButton({ paymentId, amount }: PaytmCheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [paytmState, setPaytmState] = useState<{ mid?: string; orderId?: string; txnToken?: string }>({});

    const handlePay = async () => {
        try {
            setLoading(true);

            // 1. Initiate Transaction on the Server
            const result = await initiatePaytmTransaction(paymentId);

            if (!result.success) {
                toast.error("Failed to initiate payment", {
                    description: result.error || "Please try again later.",
                });
                setLoading(false);
                return;
            }

            setPaytmState({
                mid: result.mid,
                orderId: result.orderId,
                txnToken: result.txnToken,
            });

            // If script is already loaded, invoke immediately
            if (scriptLoaded && window.Paytm && window.Paytm.CheckoutJS) {
                initializePaytmFlow(result.txnToken!, result.orderId!, result.mid!, amount);
            }

        } catch (error) {
            console.error("Payment initiation error:", error);
            toast.error("Something went wrong");
            setLoading(false);
        }
    };

    const initializePaytmFlow = (txnToken: string, orderId: string, mid: string, amount: number) => {
        const config = {
            root: "",
            flow: "DEFAULT",
            data: {
                orderId: orderId,
                token: txnToken,
                tokenType: "TXN_TOKEN",
                amount: String(amount),
            },
            handler: {
                notifyMerchant: function (eventName: string, data: any) {
                    console.log("notifyMerchant handler function called");
                    console.log("eventName => ", eventName);
                    console.log("data => ", data);
                },
                transactionStatus: function (data: any) {
                    console.log("payment status => ", data);
                    window.Paytm.CheckoutJS.close();

                    if (data.STATUS === "TXN_SUCCESS") {
                        toast.success("Payment Successful!", {
                            description: "Your rent has been paid successfully.",
                        });
                        // Force a reload or router.refresh() to update the table status locally
                        window.location.reload();
                    } else {
                        toast.error("Payment Failed", {
                            description: data.RESPMSG || "Transaction was not successful.",
                        });
                        setLoading(false);
                    }
                }
            }
        };

        if (window.Paytm && window.Paytm.CheckoutJS) {
            window.Paytm.CheckoutJS.init(config)
                .then(function onSuccess() {
                    window.Paytm.CheckoutJS.invoke();
                })
                .catch(function onError(error: any) {
                    console.error("error => ", error);
                    toast.error("Failed to load payment gateway. Please disable adblockers or try again.");
                    setLoading(false);
                });
        } else {
            toast.error("Payment gateway failed to initialize.");
            setLoading(false);
        }
    };

    return (
        <>
            {/* We load the exact environment script. Assuming staging for now. Update to securegw.paytm.in for production. */}
            {paytmState.mid && (
                <Script
                    id="paytm-checkout-js"
                    type="application/javascript"
                    src={`https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${paytmState.mid}.js`}
                    onLoad={() => {
                        setScriptLoaded(true);
                        if (paytmState.txnToken && paytmState.orderId) {
                            initializePaytmFlow(paytmState.txnToken, paytmState.orderId, paytmState.mid!, amount);
                        }
                    }}
                />
            )}

            <Button
                onClick={handlePay}
                disabled={loading}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                )}
                Pay Rent
            </Button>
        </>
    );
}

// Add global types for Paytm JS Library
declare global {
    interface Window {
        Paytm: any;
    }
}
