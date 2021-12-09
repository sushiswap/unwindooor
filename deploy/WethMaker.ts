import "dotenv/config";
import { DeployFunction } from "hardhat-deploy/types";
import { FACTORY_ADDRESS, WETH9_ADDRESS } from "@sushiswap/core-sdk";
import { HardhatRuntimeEnvironment } from "hardhat/types";
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

  const { address } = await deploy("WethMaker", {
    from: deployer,
    args: [owner, user, factory, weth],
  });

  console.log(`Weth maker deployed to ${address}`);
  console.log(`Run: npx hardhat verify --network xxxx ${address} ${owner} ${user} ${factory} ${weth}`);
};

deployFunction.skip = ({ getChainId }: HardhatRuntimeEnvironment) =>
  new Promise((resolve) => {
    getChainId().then(chainId => {
      return resolve(chainId === "1") // skip if on mainnet
    })
  });

export default deployFunction;