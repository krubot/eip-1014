require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("./tasks")

let hardhat = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: JSON.parse(process.env.PRIVATE_KEYS)
    }
  },
  defaultNetwork: "goerli",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts"
  }
};

if (process.env.ETHERSCAN_API_KEY != null) {
  hardhat.etherscan = {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY
    }
  };
}

module.exports = hardhat;
