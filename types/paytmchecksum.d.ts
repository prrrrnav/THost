declare module "paytmchecksum" {
    export function generateSignature(body: string, key: string): Promise<string>;
    export function verifySignature(body: string | Record<string, any>, key: string, signature: string): boolean;
}
