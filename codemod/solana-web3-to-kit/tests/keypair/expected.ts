import { generateKeyPair } from "@solana/kit";

const wallet = await generateKeyPair();
const backup = await generateKeyPair();
