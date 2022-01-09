import { ChainId } from "@sushiswap/core-sdk";

export const Pairs = {
  [ChainId.MATIC]: [
    "0x9803c7ae526049210a1725f7487af26fe2c24614", // BCT-KLIMA
    "0x1e67124681b402064cd0abe8ed1b5c79d2e02f64", // USDC-BCT
    "0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e", // WMATIC-WETH
    "0xe62ec2e799305e0d367b0cc3ee2cda135bf89816", // WBTC-WETH
    "0x34965ba0ac2451a34a0471f04cca3f990b8dea27", // USDC-WETH
    "0x2813d43463c374a680f235c428fb1d7f08de0b69", // WETH-AAVE
    "0xcd353f79d9fade311fc3119b841e1f456b54e858", // WMATIC-USDC
    "0x941eb28e750c441aef465a89e43ddfec2561830b", // ICE-WETH
    "0x6ff62bfb8c12109e8000935a6de54dad83a4f39f", // WETH-DAI
    "0x2e7d6490526c7d7e2fdea5c6ec4b0d1b9f8b25b7", // WMATIC-RAIDER
  ],
  [ChainId.ETHEREUM]: [
    "0x055475920a8c93cffb64d039a8205f7acc7722d3", // OHM_DAI
    "0x06da0fd433c1a5d7a4faa01111c044910a184553", // WETH_USDT
  ]
} as { [chainId in ChainId]: string[] }