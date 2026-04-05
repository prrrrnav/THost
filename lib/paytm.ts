import PaytmChecksum from "paytmchecksum";

export const PAYTM_MID = process.env.PAYTM_MID || "";
export const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY || "";
export const PAYTM_ENV = process.env.PAYTM_ENV || "staging";

export const PAYTM_BASE_URL =
    PAYTM_ENV === "production"
        ? "https://securegw.paytm.in"
        : "https://securegw-stage.paytm.in";

export async function generateSignature(body: any, key: string = PAYTM_MERCHANT_KEY) {
    return PaytmChecksum.generateSignature(JSON.stringify(body), key);
}

export async function verifySignature(body: any, signature: string, key: string = PAYTM_MERCHANT_KEY) {
    return PaytmChecksum.verifySignature(body, key, signature);
}
