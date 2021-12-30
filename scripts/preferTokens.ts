import { ChainId } from "@sushiswap/core-sdk";

export const preferTokens = {
  [ChainId.ETHEREUM]: [
    "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", // SUSHI
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"  // WBTC
  ],
  [ChainId.MATIC]: [
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // WETH
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // WMATIC
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // USDT
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
    "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", // WBTC
    "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89", // FRAX
    "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a", // SUSHI
    "0x2f800db0fdb5223b3c3f354886d907a671414a7f", // BCT
  ]
} as { [chainId in ChainId]: string[] }