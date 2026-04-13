# solana-web3-to-kit

Deterministic AST codemod that migrates Solana TypeScript code from the legacy `@solana/web3.js` SDK to the modern `@solana/kit` standard.

Built with the [Codemod JSSG](https://docs.codemod.com/jssg/intro) engine (JS ast-grep).

## What it transforms

| Pattern | Before (`@solana/web3.js`) | After (`@solana/kit`) |
|---------|---------------------------|----------------------|
| **Import path** | `from "@solana/web3.js"` | `from "@solana/kit"` |
| **Connection** | `new Connection(url)` | `createSolanaRpc(url)` |
| **PublicKey** | `new PublicKey(str)` | `address(str)` |
| **Keypair** | `Keypair.generate()` | `await generateKeyPair()` |
| **Lamports constant** | `LAMPORTS_PER_SOL` | `lamports(1_000_000_000n)` |

Import specifiers are automatically renamed to match the new API names.

### Before

```typescript
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const pubkey = new PublicKey("So11111111111111111111111111111111111111112");
const wallet = Keypair.generate();
const amount = 2 * LAMPORTS_PER_SOL;
```

### After

```typescript
import { createSolanaRpc, address, generateKeyPair, lamports } from "@solana/kit";

const connection = createSolanaRpc("https://api.mainnet-beta.solana.com");
const pubkey = address("So11111111111111111111111111111111111111112");
const wallet = await generateKeyPair();
const amount = 2 * lamports(1_000_000_000n);
```

## Installation & Usage

```bash
# Run from the Codemod Registry (once published)
npx codemod solana-web3-to-kit

# Run the workflow locally
npx codemod workflow run -w ./codemod/solana-web3-to-kit/

# Quick-test the JSSG transform directly
npx codemod jssg run ./scripts/codemod.ts ./your-src-dir --language typescript
```

## Development

```bash
# Run fixture tests
npx codemod jssg test ./scripts/codemod.ts --language typescript

# Validate the workflow definition
npx codemod workflow validate -w workflow.yaml

# Type-check the transform
npm run check-types
```

## Test fixtures

Tests live in `tests/`. Each subdirectory contains an `input.ts` and `expected.ts` file:

```
tests/
├── basic/          # Core transforms (Connection, PublicKey, Keypair, imports)
├── keypair/        # Keypair.generate() → generateKeyPair()
├── lamports/       # LAMPORTS_PER_SOL → lamports()
├── multi-import/   # Mixed imports with non-Solana packages
└── no-op/          # Files without @solana/web3.js (should pass unchanged)
```

## Publishing

```bash
# Login to Codemod Registry
npx codemod login

# Publish
npx codemod publish
```

## Part of SolSweep

This codemod is the AST engine behind [SolSweep](https://github.com/edycutjong/solsweep), an autonomous migration tool that pairs these deterministic transforms with a compiler-in-the-loop AI to achieve zero false-positive Solana migrations.

## License

MIT