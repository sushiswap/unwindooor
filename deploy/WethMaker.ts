// import {  } from "hardhat-deploy";
import { DeployFunction } from "hardhat-deploy/types";
import { FACTORY_ADDRESS, WETH9_ADDRESS } from "@sushiswap/core-sdk";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFunction: DeployFunction = async ({
  deployments,
  getNamedAccounts,
  getChainId
}: HardhatRuntimeEnvironment) => {

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = parseInt(await getChainId());

  const owner = deployer;
  const user = deployer;
  const factory = FACTORY_ADDRESS[chainId];
  const weth = WETH9_ADDRESS[chainId];

  const { address } = await deploy("WethMaker", {
    from: deployer,
    args: [owner, user, factory, weth],
  });

  console.log(`Weth maker deployed to ${address}`);
};

deployFunction.skip = ({ getChainId }: HardhatRuntimeEnvironment) =>
  new Promise((resolve) => {
    getChainId().then(chainId => {
      return resolve(chainId === "1") // skip if on mainnet
    })
  });

export default deployFunction;