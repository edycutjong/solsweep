import { createSolanaRpc, address } from "@solana/kit";
import { useState } from "react";

const connection = createSolanaRpc("https://api.devnet.solana.com");
const key = address("ABC123");
const [state, setState] = useState(null);
