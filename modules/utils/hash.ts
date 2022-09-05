import crypto from "crypto-js";

const pbkdf2Salt: string = "ECUITextTaggingNewHITNLP2022";
const pbkdf2KeySize: number = 256 / 32;
const pbkdf2Iterations: number = 5000;

export function pbkdf2Hash(orig: string): string{
    return crypto.PBKDF2(orig,
        pbkdf2Salt, {
        keySize: pbkdf2KeySize,
        iterations: pbkdf2Iterations
    }).toString(crypto.enc.Base64);
}