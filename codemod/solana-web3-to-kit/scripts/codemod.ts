import type { Transform } from "codemod:ast-grep";
import type JS from "codemod:ast-grep/langs/javascript";
import type TS from "codemod:ast-grep/langs/typescript";
import type TSX from "codemod:ast-grep/langs/tsx";

const transform: Transform<TS | TSX | JS> = async (root) => {
  const rootNode = root.root();

  // Rule 1: new Connection(...) -> createSolanaRpc(...)
  const connections = rootNode.findAll({
    rule: { pattern: "new Connection($URL)" },
  });
  const editsConnection = connections.map((node) => {
    const url = node.getMatch("URL")?.text() || "";
    return node.replace(`createSolanaRpc(${url})`);
  });

  // Rule 2: new PublicKey(...) -> address(...)
  const publicKeys = rootNode.findAll({
    rule: { pattern: "new PublicKey($KEY)" },
  });
  const editsPublicKey = publicKeys.map((node) => {
    const key = node.getMatch("KEY")?.text() || "";
    return node.replace(`address(${key})`);
  });

  // Rule 3: Keypair.generate() -> await generateKeyPair()
  const keypairs = rootNode.findAll({
    rule: { pattern: "Keypair.generate()" },
  });
  const editsKeypair = keypairs.map((node) => {
    return node.replace("await generateKeyPair()");
  });

  // Rule 4: LAMPORTS_PER_SOL -> lamports(1_000_000_000n)
  // Only match standalone identifiers, not inside import declarations
  const lamportsRefs = rootNode.findAll({
    rule: {
      pattern: "LAMPORTS_PER_SOL",
      kind: "identifier",
      not: {
        inside: { kind: "import_specifier" },
      },
    },
  });
  const editsLamports = lamportsRefs.map((node) => {
    return node.replace("lamports(1_000_000_000n)");
  });

  // Rule 5: update imports from "@solana/web3.js"
  const imports = rootNode.findAll({
    rule: { pattern: 'import { $$$IMPORTS } from "@solana/web3.js"' },
  });

  const editsImports = imports.map((node) => {
    let text = node.text();
    text = text.replace(/\bConnection\b/g, "createSolanaRpc");
    text = text.replace(/\bPublicKey\b/g, "address");
    text = text.replace(/\bKeypair\b/g, "generateKeyPair");
    text = text.replace(/\bLAMPORTS_PER_SOL\b/g, "lamports");
    text = text.replace(/@solana\/web3\.js/g, "@solana/kit");
    return node.replace(text);
  });

  const allEdits = [
    ...editsConnection,
    ...editsPublicKey,
    ...editsKeypair,
    ...editsLamports,
    ...editsImports,
  ];

  if (allEdits.length === 0) {
    return null;
  }

  const newSource = rootNode.commitEdits(allEdits);
  return newSource;
};

export default transform;
