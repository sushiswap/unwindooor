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
  [ChainId.ETHEREUM]: [ // check https://vision.sushi.com/account/0x5ad6211CD3fdE39A9cECB5df6f380b8263d1e277 or https://sushibackup.vercel.app/sushimaker
    // "0x055475920a8c93cffb64d039a8205f7acc7722d3", // OHM_DAI
    // "0xe9ab8038ee6dd4fcc7612997fe28d4e22019c4b4", // OHM_BTRFLY
    "0x69b81152c5a8d35a67b32a4d3772795d96cae4da", // OHM_WETH
    "0x06da0fd433c1a5d7a4faa01111c044910a184553", // WETH_USDT
    // "0x6a091a3406e0073c3cd6340122143009adac0eda", // ILV_WETH
    // "0x0e26a21013f2f8c0362cfae608b4e69a249d5efc", // FTM_WETH
    // "0x58dc5a51fe44589beb22e8ce67720b5bc5378009", // WETH_CRV
    "0x397ff1542f962076d0bfe58ea045ffa2d347aca0", // USDC_WETH
    // "0xd4e7a6e2d03e4e48dfc27dd3f46df1c176647e38", // TOKE_WETH
    // "0xb5de0c3753b6e1b4dba616db82767f17513e6d4e", // SPELL_WETH
    // "0xc3f279090a47e80990fe3a9c30d24cb117ef91a8", // WETH_ALCX
    "0x05767d9ef41dc40689678ffca0608878fb3de906", // CVX_WETH
    "0xaf988aff99d3d0cb870812c325c588d8d8cb7de8", // K3PR_WETH
    // "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f", // DAI_WETH
    "0x4a86c01d67965f8cb3d0aaa2c655705e64097c31", // SYN_WETH
    "0xe12af1218b4e9272e9628d7c7dc6354d137d024e", // BIT_WETH
  ]
} as { [chainId in ChainId]: string[] }