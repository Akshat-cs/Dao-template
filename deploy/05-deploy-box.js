const { network } = require("hardhat");
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------");
  log("Deploying box contract...");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContract("Box");

  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);
  log("You done it!!");

  // verify on Etherscan
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("verifying...");
    verify(box.address, []);
  }
};
