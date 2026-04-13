import { Connection, PublicKey } from "@solana/web3.js";
import { useState } from "react";

const connection = new Connection("https://api.devnet.solana.com");
const key = new PublicKey("ABC123");
const [state, setState] = useState(null);
