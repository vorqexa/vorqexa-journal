// Minimal injected-wallet (EIP-1193) connection. Read-only: we only ask for the
// account address and never request a signature or a transaction.
type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: "accountsChanged", handler: (accounts: string[]) => void) => void;
  removeListener?: (event: "accountsChanged", handler: (accounts: string[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export const hasWallet = () => typeof window !== "undefined" && !!window.ethereum;

export async function connectWallet(): Promise<string> {
  const eth = window.ethereum;
  if (!eth) throw new Error("No browser wallet found. Install one (e.g. MetaMask) or paste an address instead.");
  try {
    const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
    if (!accounts?.length) throw new Error("No account was shared by the wallet.");
    return accounts[0];
  } catch (err) {
    const e = err as { code?: number; message?: string };
    if (e.code === 4001) throw new Error("Connection request was rejected in the wallet.");
    throw new Error(e.message ?? "Could not connect to the wallet.");
  }
}

export function onAccountsChanged(cb: (address: string | null) => void): () => void {
  const eth = window.ethereum;
  if (!eth?.on) return () => {};
  const handler = (accounts: string[]) => cb(accounts[0] ?? null);
  eth.on("accountsChanged", handler);
  return () => eth.removeListener?.("accountsChanged", handler);
}
