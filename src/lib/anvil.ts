import { defineChain } from "thirdweb"

export default defineChain({
    id: 31337,
    name: "Anvil",
    rpc: "http://localhost:8545",
    testnet: true,
    nativeCurrency: {
        name: "Anvil Ether",
        symbol: "ETH",
        decimals: 18,
    },
});
