import { BigNumber, providers } from "ethers";
import { task, types } from "hardhat/config";
import { WethMaker } from "./typechain/WethMaker";
import { SushiMaker } from "./typechain/SushiMaker";
import { WethMaker as WethMakerSdk } from "unwindooor-sdk";
import { CurrencyAmount, FACTORY_ADDRESS, Pair, SUSHI_ADDRESS, Token, WETH9_ADDRESS } from "@sushiswap/core-sdk";

// run `npx hardhat unwindPair --network matic --pair-address 0x9803c7ae526049210a1725f7487af26fe2c24614 --share 25`
// to unwind 25% of BCT-KLIMA lp token

task("unwindPair", "Unwind pair")
  .addParam("pairAddress", "Pair Address")
  .addParam("share", "Share", 100, types.int)
  .addParam("maker", "Maker", "WethMaker", types.string)
  .setAction(async function ({ pairAddress, share, maker }, { ethers, getChainId }) {

    if (share > 100 || share < 1) throw Error("Share should be between 1 and 100");

    const chainId = parseInt(await getChainId());

    const signer = (new ethers.Wallet(process.env.TRUSTEE_PK as string, ethers.provider as providers.Provider));

    const wethMaker = (await ethers.getContract(maker)).connect(signer as any) as WethMaker;

    const wethAddress = WETH9_ADDRESS[chainId];
    const sushiAddress = SUSHI_ADDRESS[chainId];
    const factoryAddress = FACTORY_ADDRESS[chainId];

    const wethMakerSdk = new WethMakerSdk({
      wethMakerAddress: wethMaker.address,
      preferTokens: [wethAddress],
      provider: ethers.provider as providers.Provider,
      maxPriceImpact: BigNumber.from(6),
      priceSlippage: BigNumber.from(1),
      wethAddress,
      sushiAddress,
      factoryAddress
    })

    const { amount, minimumOut, tokenA, tokenB } = await wethMakerSdk.unwindPair(pairAddress, BigNumber.from(share));

    // console.log((await wethMaker.unwindPairs([pairAddress], [amount], [minimumOut], [keepToken0], { gasLimit: 1e7 })).hash);

  });

// run `npx hardhat sellToken --network matic --token 0x2f800db0fdb5223b3c3f354886d907a671414a7f --share 25`
// To sell 25% of BCT balance to its bridge token (USDC)

// run `npx hardhat sellToken --network matic --token 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 --share 50`
// To sell 50% of USDC to weth

task("sellToken", "Unwind pair")
  .addParam("token", "Token")
  .addParam("share", "Share", 100, types.int)
  .addParam("maker", "Maker", "WethMaker", types.string)
  .addOptionalParam("gasPrice", "Gas price")
  .setAction(async function ({ token, share, maker, gasPrice }, { ethers, getChainId }) {

    if (share > 100 || share < 1) throw Error("Share should be between 1 and 100");

    const chainId = parseInt(await getChainId());
    const signer = (new ethers.Wallet(process.env.TRUSTEE_PK as string, ethers.provider as providers.Provider));
    const wethMaker = (await ethers.getContract(maker)).connect(signer as any) as WethMaker;

    const wethAddress = WETH9_ADDRESS[chainId];
    const sushiAddress = SUSHI_ADDRESS[chainId];
    const factoryAddress = FACTORY_ADDRESS[chainId];

    const wethMakerSdk = new WethMakerSdk({
      wethMakerAddress: wethMaker.address,
      preferTokens: [wethAddress],
      provider: ethers.provider as providers.Provider,
      maxPriceImpact: BigNumber.from(7),
      priceSlippage: BigNumber.from(1),
      wethAddress,
      sushiAddress,
      factoryAddress
    })

    const { amountIn, minimumOut } = await wethMakerSdk.sellToken(token, BigNumber.from(share));
    console.log((await wethMaker.buyWeth([token], [amountIn], [minimumOut], { gasPrice })).hash);

  });

task("buySushi", "Unwind pair")
  .addParam("share", "Share", 100, types.int)
  .addOptionalParam("nonce")
  .addOptionalParam("maxFeePerGas")
  .setAction(async function ({ share, nonce, maxFeePerGas }, { ethers, getChainId }) {

    if (share > 100 || share < 1) throw Error("Share should be between 1 and 100");

    const chainId = parseInt(await getChainId());

    const signer = (new ethers.Wallet(process.env.TRUSTEE_PK as string, ethers.provider as providers.Provider));

    const wethMaker = (await ethers.getContract("SushiMaker")).connect(signer as any) as SushiMaker;

    const wethAddress = WETH9_ADDRESS[chainId];
    const sushiAddress = SUSHI_ADDRESS[chainId];
    const factoryAddress = FACTORY_ADDRESS[chainId];

    const wethMakerSdk = new WethMakerSdk({
      wethMakerAddress: wethMaker.address,
      preferTokens: [wethAddress],
      provider: ethers.provider as providers.Provider,
      maxPriceImpact: BigNumber.from(6),
      priceSlippage: BigNumber.from(1),
      wethAddress,
      sushiAddress,
      factoryAddress
    });

    const { amountIn, minimumOut } = await wethMakerSdk.sellToken(wethAddress, BigNumber.from(share));

    console.log((await wethMaker.buySushi(amountIn, minimumOut, { nonce, gasPrice: (await ethers.provider.getGasPrice()).mul(12).div(10) })).hash);

  });
