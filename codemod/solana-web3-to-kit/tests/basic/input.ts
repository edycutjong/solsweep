import { Connection, PublicKey, Keypair } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const pubkey = new PublicKey("So11111111111111111111111111111111111111112");
const wallet = Keypair.generate();
