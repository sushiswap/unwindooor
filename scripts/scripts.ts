import { task } from "hardhat/config";
import { exportCsv } from "./misc/exportCsv";
import { buyWeth, unwindPairs } from "./unwind";

task("unwindPairs", "Unwind pairs").addOptionalParam("gasPrice").addOptionalParam("nonce").setAction(unwindPairs)
task("buyWeth", "Buying weth").addOptionalParam("gasPrice").addOptionalParam("nonce").setAction(buyWeth)

/* task("exportCsv")
  .addParam("from", "From", "0xcc159bcb6a466da442d254ad934125f05dab66b5")
  .setAction(exportCsv); */