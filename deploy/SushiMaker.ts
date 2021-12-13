import "dotenv/config";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BAR_ADDRESS, FACTORY_ADDRESS, SUSHI_ADDRESS, WETH9_ADDRESS } from "@sushiswap/core-sdk";
import { utils } from "ethers";

const deployFunction: DeployFunction = async ({
  deployments,
  getNamedAccounts,
  getChainId
}: HardhatRuntimeEnvironment) => {

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = parseInt(await getChainId());

  const owner = utils.getAddress(process.env.OWNER as string);
  const user = utils.getAddress(process.env.TRUSTEE as string);
  const factory = FACTORY_ADDRESS[chainId];
  const weth = WETH9_ADDRESS[chainId];
  const sushi = SUSHI_ADDRESS[chainId];
  const xSushi = BAR_ADDRESS[chainId];

  const { address } = await deploy("SushiMaker", {
    from: deployer,
    args: [owner, user, factory, weth, sushi, xSushi],
  });

  console.log(`Sushi maker deployed to ${address}`);
  console.log(`Run: npx hardhat verify --network mainnet ${address} ${owner} ${user} ${factory} ${weth} ${sushi} ${xSushi}`);
};

deployFunction.skip = ({ getChainId }: HardhatRuntimeEnvironment) =>
  new Promise((resolve) => {
    getChainId().then(chainId => {
      return resolve(chainId !== "1" && chainId !== "42") // only run on mainnet & kovan
    })
  });

export default deployFunction;