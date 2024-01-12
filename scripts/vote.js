const fs = require("fs");
const {
  proposalsFile,
  developmentChains,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");
const { ethers } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const index = 0;

async function main(proposalIndex) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf-8"));
  const proposalId = proposals[network.config.chainId][proposalIndex];
  // 0= Against , 1= For, 2= Abstain
  const voteWay = 1;
  const governor = await ethers.getContract("GovernorContract");
  const reason = "I am Akshat";
  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  await voteTxResponse.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  console.log("Voted! Ready to go!");
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
