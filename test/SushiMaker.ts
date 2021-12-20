
import { BAR_ADDRESS, FACTORY_ADDRESS, MASTERCHEF_ADDRESS, SUSHI_ADDRESS, WETH9_ADDRESS } from "@sushiswap/core-sdk";
import { expect } from "chai";
import { BigNumber, Signer, utils } from "ethers";
import { network, ethers } from "hardhat";
import { WethMaker, SushiMaker, MockERC20, WethMaker__factory, SushiMaker__factory, MockERC20__factory } from "../typechain";

export function customError(errorName: string): string {
  return `VM Exception while processing transaction: reverted with custom error '${errorName}()'`;
}

describe("SushiMaker", async function () {

  let owner: Signer;
  let _owner: string;
  let trustee: Signer;
  let _trustee: string;
  let bob: Signer;
  let _bob: string;
  let sushiMaker: SushiMaker;
  let wethMaker: WethMaker;
  let sushi: MockERC20;
  let xSushi: MockERC20;
  let weth: MockERC20;
  let usdc: MockERC20;
  let dai: MockERC20;
  let ohm: MockERC20;
  let wbtc: MockERC20;
  let usdc_eth: MockERC20;
  let ohm_dai: MockERC20;
  let dai_eth: MockERC20;
  let sushi_eth: MockERC20;
  let wbtc_badger: MockERC20;
  let usdc_eth_balance: BigNumber;
  let ohm_dai_balance: BigNumber;
  let sushi_eth_balance: BigNumber;
  let wbtc_badger_balance: BigNumber;

  before(async () => {

    const signers = await ethers.getNamedSigners();
    owner = signers.deployer as any as Signer;
    trustee = signers.alice as any as Signer;
    bob = signers.bob as any as Signer;
    _owner = await owner.getAddress();
    _trustee = await trustee.getAddress();
    _bob = await bob.getAddress();

    const sushiMakerFactory = (await ethers.getContractFactory("SushiMaker")) as SushiMaker__factory;
    const wethMakerFactory = (await ethers.getContractFactory("WethMaker")) as WethMaker__factory;
    const erc20Factory = (await ethers.getContractFactory("MockERC20")) as MockERC20__factory;

    const factoryAddress = FACTORY_ADDRESS[1];
    const wethAddress = WETH9_ADDRESS[1];
    const sushiAddress = SUSHI_ADDRESS[1];
    const xSushiAddress = BAR_ADDRESS[1];
    const masterChefAddress = MASTERCHEF_ADDRESS[1];

    sushiMaker = (await sushiMakerFactory.deploy(_owner, _trustee, factoryAddress, wethAddress, sushiAddress, xSushiAddress)) as SushiMaker;
    wethMaker = (await wethMakerFactory.deploy(_owner, _trustee, factoryAddress, wethAddress)) as WethMaker;

    [sushi, xSushi, weth, dai, ohm, wbtc, usdc] = await Promise.all([
      await erc20Factory.attach(sushiAddress),
      await erc20Factory.attach(xSushiAddress),
      await erc20Factory.attach(wethAddress),
      await erc20Factory.attach("0x6b175474e89094c44da98b954eedeac495271d0f"),
      await erc20Factory.attach("0x383518188c0c6d7730d91b2c03a03c837814a899"),
      await erc20Factory.attach("0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"),
      await erc20Factory.attach("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")]);

    await network.provider.request({ method: "hardhat_impersonateAccount", params: [masterChefAddress], });
    const mcSigner = await ethers.getSigner(masterChefAddress) as any;
    await network.provider.send("hardhat_setBalance", [masterChefAddress, "0x1000000000000000000"]);

    usdc_eth = (await erc20Factory.attach("0x397FF1542f962076d0BFE58eA045FfA2d347ACa0")).connect(mcSigner);
    ohm_dai = (await erc20Factory.attach("0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c")).connect(mcSigner);
    dai_eth = (await erc20Factory.attach("0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f")).connect(mcSigner);
    sushi_eth = (await erc20Factory.attach("0x795065dCc9f64b5614C407a6EFDC400DA6221FB0")).connect(mcSigner);
    wbtc_badger = (await erc20Factory.attach("0x110492b31c59716AC47337E616804E3E3AdC0b4a")).connect(mcSigner);

    [usdc_eth_balance, ohm_dai_balance, sushi_eth_balance, wbtc_badger_balance] = (await Promise.all([
      usdc_eth.balanceOf(masterChefAddress),
      ohm_dai.balanceOf(masterChefAddress),
      sushi_eth.balanceOf(masterChefAddress),
      wbtc_badger.balanceOf(masterChefAddress)
    ])).map(balance => balance.div(10000));

    await Promise.all([
      usdc_eth.transfer(sushiMaker.address, usdc_eth_balance),
      usdc_eth.sync(),
      ohm_dai.transfer(sushiMaker.address, ohm_dai_balance),
      ohm_dai.sync(),
      sushi_eth.transfer(sushiMaker.address, sushi_eth_balance),
      sushi_eth.sync(),
      wbtc_badger.transfer(sushiMaker.address, wbtc_badger_balance),
      wbtc_badger.sync()
    ]);

  })

  it("Should restrict actions", async () => {
    await expect(wethMaker.connect(trustee).withdraw(ohm.address, ohm.address, "1")).to.be.revertedWith(customError("OnlyOwner"));
    await expect(sushiMaker.connect(owner).withdraw(ohm.address, ohm.address, "1")).to.be.reverted;
    await expect(sushiMaker.connect(bob).buyWeth([], [], [])).to.be.revertedWith(customError("OnlyTrusted"));
    await expect(sushiMaker.connect(bob).unwindPairs([], [], [], [])).to.be.revertedWith(customError("OnlyTrusted"));
    await expect(sushiMaker.connect(bob).sweep(0)).to.be.revertedWith(customError("OnlyTrusted"));
    await expect(sushiMaker.connect(owner).buySushi(0, 0)).to.be.revertedWith(customError("OnlyTrusted"));
    await expect(sushiMaker.connect(bob).setBridge(ohm.address, dai.address)).to.be.revertedWith(customError("OnlyOwner"));
    await expect(sushiMaker.connect(trustee).setBridge(ohm.address, dai.address)).to.be.revertedWith(customError("OnlyOwner"));
    await expect(sushiMaker.connect(trustee).buySushi(0, 0)).to.be.revertedWith("UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT"); // means sender is authorised
    expect(await sushiMaker.connect(owner).setTrusted(_trustee, false));
    await expect(sushiMaker.connect(trustee).buySushi(0, 0)).to.be.revertedWith(customError("OnlyTrusted"));
    expect(await sushiMaker.connect(owner).setTrusted(_trustee, true));
    expect(await sushiMaker.connect(owner).setTrusted(_owner, true));
  })

  it("Should unwind lp tokens for weth", async () => {

    sushiMaker = sushiMaker.connect(owner);

    await (expect(sushiMaker.unwindPairs(
      [usdc.address],
      [weth.address],
      [usdc_eth_balance.div(2)],
      ["0xfffffffffffffffffffff"]
    )).to.be.revertedWith(customError("SlippageProtection")));

    const reservesStart = await usdc_eth.getReserves();

    await sushiMaker.unwindPairs(
      [weth.address, usdc.address,],
      [usdc.address, weth.address,],
      [usdc_eth_balance.div(2), usdc_eth_balance.div(2)],
      [0, 0],
    );

    const reservesEnd = await usdc_eth.getReserves();
    const reserve0diff = reservesStart.reserve0.sub(reservesEnd.reserve0);
    const reserve1diff = reservesStart.reserve1.sub(reservesEnd.reserve1);

    expect(await usdc.balanceOf(sushiMaker.address)).to.be.eq(reserve0diff, "didn't receive all 0 tokens");
    expect(await weth.balanceOf(sushiMaker.address)).to.be.eq(reserve1diff, "didn't receive all the tokens");

    const ohmDaiReserves = await ohm_dai.getReserves();
    const unwindTx = await sushiMaker.unwindPairs(
      [ohm.address],
      [dai.address],
      [ohm_dai_balance.div(2)],
      [0],
    );

    const burnLog = (await unwindTx.wait()).logs.find(log => log.topics[0] === "0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496")
    const [ohmBurnAmount, daiBurnAmount] = utils.defaultAbiCoder.decode(["uint256", "uint256"], burnLog.data);
    const ohmReserve = ohmDaiReserves.reserve0.sub(ohmBurnAmount);
    const daiReserve = ohmDaiReserves.reserve1.sub(daiBurnAmount);
    const ohmExpected = getAmountOut(daiBurnAmount, daiReserve, ohmReserve).add(ohmBurnAmount);
    const ohmBalance = await ohm.balanceOf(sushiMaker.address);
    expect(ohmBalance.toString()).to.be.eq(ohmExpected.toString(), "didn't swap correctly");
  });

  it("should burn lp tokens", async () => {
    const reserves = await ohm_dai.getReserves();
    const totalSupply = await ohm_dai.totalSupply();
    const amount = (await ohm_dai.balanceOf(sushiMaker.address)).div(10);
    const amount0 = reserves.reserve0.mul(amount).div(totalSupply);
    const amount1 = reserves.reserve1.mul(amount).div(totalSupply);
    await expect(sushiMaker.burnPairs([ohm_dai.address], [amount], [amount0.add(1)], [amount1])).to.be.revertedWith(customError("SlippageProtection"));
    await expect(sushiMaker.burnPairs([ohm_dai.address], [amount], [amount0], [amount1.add(1)])).to.be.revertedWith(customError("SlippageProtection"));
    await sushiMaker.burnPairs([ohm_dai.address], [amount], [amount0.mul(99).div(100)], [amount1.mul(99).div(100)]);
  });

  it("Should buy weth (through bridge and directly)", async () => {
    await sushiMaker.setBridge(ohm.address, dai.address);
    const initialOhmBalance = await ohm.balanceOf(sushiMaker.address);
    const initialDaiBalance = await dai.balanceOf(sushiMaker.address);
    const poolReserves = await ohm_dai.getReserves();
    const expectedDai = getAmountOut(
      initialOhmBalance,
      poolReserves.reserve0,
      poolReserves.reserve1
    );

    await expect(sushiMaker.buyWeth(
      [ohm.address],
      [initialOhmBalance],
      [expectedDai.add(1)]
    )).to.be.revertedWith(customError("SlippageProtection"));

    await sushiMaker.buyWeth(
      [ohm.address],
      [initialOhmBalance],
      [expectedDai],
    );
    const daiBalance = await dai.balanceOf(sushiMaker.address);
    const ohmBalance = await ohm.balanceOf(sushiMaker.address);
    expect(daiBalance.toString()).to.be.eq(initialDaiBalance.add(expectedDai).toString(), "didn't buy dai");
    expect(ohmBalance.toString()).to.be.eq("0", "didn't sell all ohm");

    const oldWethBalance = await weth.balanceOf(sushiMaker.address);
    const daiEthPoolreserves = await dai_eth.getReserves();
    const expectedWeth0 = getAmountOut(daiBalance.div(3), daiEthPoolreserves.reserve0, daiEthPoolreserves.reserve1);
    const expectedWeth1 = getAmountOut(daiBalance.sub(daiBalance.div(3)), daiEthPoolreserves.reserve0.add(daiBalance.div(3)), daiEthPoolreserves.reserve1.sub(expectedWeth0));
    await sushiMaker.buyWeth(
      [dai.address, dai.address],
      [daiBalance.div(3), daiBalance.sub(daiBalance.div(3))],
      [expectedWeth0, expectedWeth1]
    );
    const wethBalance = await weth.balanceOf(sushiMaker.address);
    expect(wethBalance.sub(oldWethBalance).toString()).to.be.eq(expectedWeth0.add(expectedWeth1).toString(), "didn't get the weth");

  });

  it("Should serve the bar", async () => {
    const wethBalance = await weth.balanceOf(sushiMaker.address);
    const barBalance = await sushi.balanceOf(xSushi.address);
    const sushiWethReserves = await sushi_eth.getReserves();
    const expectedSushiOut = getAmountOut(wethBalance.div(10), sushiWethReserves.reserve1, sushiWethReserves.reserve0);
    await sushiMaker.buySushi(wethBalance.div(10), expectedSushiOut);
    const newBarBalance = await sushi.balanceOf(xSushi.address);
    expect(newBarBalance.sub(barBalance).toString()).to.be.eq(expectedSushiOut.toString(), "didn't buy exact amount of sushi");

    const lpBalance = await sushi_eth.balanceOf(sushiMaker.address);
    const sushiBalance = await sushi.balanceOf(sushiMaker.address);
    await sushiMaker.unwindPairs([sushi.address], [weth.address], [lpBalance], [0]);
    const newSushiBalance = await sushi.balanceOf(sushiMaker.address);
    expect(sushiBalance.lt(newSushiBalance)).to.be.true;
    await sushiMaker.sweep(newSushiBalance);
    expect((await sushi.balanceOf(sushiMaker.address)).toString()).to.be.eq("0", "didn't sweep");
    expect((await sushi.balanceOf(xSushi.address)).toString()).to.be.eq(newBarBalance.add(newSushiBalance).toString(), "didn't sweep");
  });

  it("should take care of native", async () => {
    const _amount = "1000000000000000000";
    const amount = "0x" + _amount;
    await network.provider.send("hardhat_setBalance", [_owner, amount]);
    await owner.sendTransaction({ from: _owner, to: wethMaker.address, value: "0x1" });
    await owner.sendTransaction({ from: _owner, to: sushiMaker.address, value: "0x1" });
    await network.provider.send("hardhat_setBalance", [wethMaker.address, amount]);
    await network.provider.send("hardhat_setBalance", [sushiMaker.address, amount]);

    let oldWethBalance = await weth.balanceOf(wethMaker.address);
    await wethMaker.withdraw(ethers.constants.AddressZero, weth.address, amount);
    let newWethBalance = await weth.balanceOf(wethMaker.address);
    expect(newWethBalance.toString()).to.be.eq(oldWethBalance.add(amount).toString(), "didn't wrap eth");

    oldWethBalance = await weth.balanceOf(_owner);
    await wethMaker.withdraw(weth.address, _owner, amount);
    newWethBalance = await weth.balanceOf(_owner);
    expect(newWethBalance.toString()).to.be.eq(oldWethBalance.add(amount), "didn't withdraw weth");

    oldWethBalance = await weth.balanceOf(sushiMaker.address);
    const ethBalance = await ethers.provider.getBalance(sushiMaker.address);
    await sushiMaker.wrapEth();
    newWethBalance = await weth.balanceOf(sushiMaker.address);
    expect(newWethBalance.toString()).to.be.eq(oldWethBalance.add(ethBalance).toString(), "didn't wrap all eth");
  });

});

function getAmountOut(amountIn: BigNumber, reserveIn: BigNumber, reserveOut: BigNumber): BigNumber {
  const amountInWithFee = amountIn.mul(997);
  const numberator = amountInWithFee.mul(reserveOut);
  const denominator = reserveIn.mul(1000).add(amountInWithFee);
  return numberator.div(denominator);
}