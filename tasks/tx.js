require("dotenv").config();

task("tx", "Run a transaction against the contract ABI")
    .addParam("functionName", "The contract function to call here")
    .addParam("functionArgs", "The contract function arguments to be run here")
    .addParam("contractName", "Name of the contract your calling the function for here")
    .addParam("address", "Name of the adddress of the where the contract has been deployed")
    .addOptionalParam("gasLimit", "The gas limit set for the transaction")
    .setAction(async (taskArgs) => {
      const Contract = await ethers.getContractFactory(taskArgs.contractName);

      if (process.env.GOERLI_EIP_1014_CONTRACT == null) {
        console.error("Contract has not been deployed, please deploy first using hardhat.");
        return
      }

      const contract = await Contract.attach(taskArgs.address);

      if (taskArgs.hasOwnProperty('gasLimit')) {
        var result = await contract[taskArgs.functionName](...JSON.parse(taskArgs.functionArgs),{gasLimit : taskArgs.gasLimit});
      } else {
        var result = await contract[taskArgs.functionName](...JSON.parse(taskArgs.functionArgs));
      }

      console.log(result);
})

module.exports = {}
