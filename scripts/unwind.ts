import { BigNumber, providers } from "ethers";
import { WethMaker } from "../typechain/WethMaker";
import { WethMaker as WethMakerSdk } from "unwindooor-sdk";
import { ChainId, FACTORY_ADDRESS, SUSHI_ADDRESS, WETH9_ADDRESS } from "@sushiswap/core-sdk";
import { preferTokens } from "./preferTokens";
import { Pairs } from "./pairs";

export const unwindPairs = async function ({ gasPrice, nonce }: any, { ethers, getChainId }: any) {

  const _getUnwindPairData = async (pairAddress: string, share = 100): Promise<{
    amount: BigNumber, minimumOut: BigNumber, tokenA: string, tokenB: string, share: number
  }> => {
    if (share < 10) throw Error(`Share too low, unwind manually: ${pairAddress}`);
    try {
      return { ...(await wethMakerSdk.unwindPair(pairAddress, BigNumber.from(share))), share };
    } catch (e) {
      return _getUnwindPairData(pairAddress, Math.round(share / 2));
    }
  }

  const chainId = parseInt(await getChainId()) as ChainId;
  const signer = (new ethers.Wallet(process.env.TRUSTEE_PK as string, ethers.provider as providers.Provider)) as any;
  const wethMaker = (await ethers.getContract(chainId == ChainId.ETHEREUM ? "SushiMaker" : "WethMaker")).connect(signer) as WethMaker;

  const wethMakerSdk = new WethMakerSdk({
    wethMakerAddress: wethMaker.address,
    preferTokens: preferTokens[chainId],
    provider: ethers.provider as providers.Provider,
    maxPriceImpact: BigNumber.from(6),
    priceSlippage: BigNumber.from(1),
    wethAddress: WETH9_ADDRESS[chainId],
    sushiAddress: SUSHI_ADDRESS[chainId],
    factoryAddress: FACTORY_ADDRESS[chainId]
  });

  const pairs = Pairs[chainId];
  const tokensA: string[] = [];
  const tokensB: string[] = [];
  const minimumOuts: BigNumber[] = [];
  const amounts: BigNumber[] = [];
  const shares: number[] = [];

  await Promise.all(pairs.map(async (pairAddress, i) => {

    const { amount, minimumOut, tokenA, tokenB, share } = await _getUnwindPairData(pairAddress);
    if (amount.gt(0)) {
      const i = tokensA.length;
      tokensA[i] = tokenA;
      tokensB[i] = tokenB;
      amounts[i] = amount;
      minimumOuts[i] = minimumOut;
      shares[i] = share;
    }

  }));

  console.log((await wethMaker.unwindPairs(tokensA, tokensB, amounts, minimumOuts, { nonce, gasPrice })).hash);

}

export const buyWeth = async function ({ gasPrice, nonce }: any, { ethers, getChainId }: any) {

  const _getbuyWethData = async (tokenAddress: string, part = 1): Promise<{
    amountIn: BigNumber, minimumOut: BigNumber, part: number
  }> => {
    if (part > 10) throw Error(`Share too low, unwind manually: ${tokenAddress}`);
    try {
      return { ...(await wethMakerSdk.sellToken(tokenAddress, BigNumber.from(Math.round(100 / part)))), part };
    } catch (e) {
      return _getbuyWethData(tokenAddress, ++part);
    }
  }

  const chainId = parseInt(await getChainId()) as ChainId;
  const signer = (new ethers.Wallet(process.env.TRUSTEE_PK as string, ethers.provider as providers.Provider)) as any;
  const wethMaker = (await ethers.getContract("WethMaker")).connect(signer) as WethMaker;
  const weth9 = WETH9_ADDRESS[chainId].toLowerCase();

  const wethMakerSdk = new WethMakerSdk({
    wethMakerAddress: wethMaker.address,
    preferTokens: preferTokens[chainId],
    provider: ethers.provider as providers.Provider,
    maxPriceImpact: BigNumber.from(6),
    priceSlippage: BigNumber.from(1),
    wethAddress: weth9,
    sushiAddress: SUSHI_ADDRESS[chainId],
    factoryAddress: FACTORY_ADDRESS[chainId]
  });

  const _tokens = preferTokens[chainId].filter(token => token.toLowerCase() != weth9);
  const tokens: string[] = [];
  const minimumOuts: BigNumber[] = [];
  const amounts: BigNumber[] = [];

  await Promise.all(_tokens.map(async tokenAddress => {

    const { amountIn, minimumOut, part } = await _getbuyWethData(tokenAddress);
    if (amountIn.gt(0)) {
      const i = tokens.length;
      tokens[i] = tokenAddress;
      minimumOuts[i] = minimumOut;
      amounts[i] = amountIn;
    }
  }));

  console.log((await wethMaker.buyWeth(tokens, amounts, minimumOuts, { nonce, gasLimit: 1e7, gasPrice })).hash);

}