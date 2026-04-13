import { createSolanaRpc, address, generateKeyPair } from "@solana/kit";

const connection = createSolanaRpc("https://api.mainnet-beta.solana.com");
const pubkey = address("So11111111111111111111111111111111111111112");
const wallet = await generateKeyPair();
