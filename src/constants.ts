import getContract from "./lib/get-contract";
import Token from "./types/token";

export const tokens: { [id: string]: Token } = {
  "weth": {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "WETH",
    decimals: 18,
    image: "https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332"
  },
  "usdc": {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    decimals: 6,
    image: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694"
  },
  "usdt": {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimals: 6,
    image: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661"
  }
}

export const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
export const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const QUOTER = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"

export const ROUTER_CONTRACT = getContract({ address: ROUTER });
export const FACTORY_CONTRACT = getContract({ address: FACTORY });
export const QUOTER_CONTRACT = getContract({ address: QUOTER });
