require("dotenv").config();

task("tx", "Run a transaction against the contract ABI")
    .addParam("functionName", "The contract function to call here")
    .addParam("functionArgs", "The contract function arguments to be run here")
    .addParam("contractName", "Name of the contract your calling the function for here")
    .addOptionalParam("gasLimit", "The gas limit set for the transaction")
    .setAction(async (taskArgs) => {
      const Contract = await ethers.getContractFactory(taskArgs.contractName);

      if (process.env.GOERLI_EIP_1014_CONTRACT == null) {
        console.error("Contract has not been deployed, please deploy first using hardhat.");
        return
      }

      var deploymentAddress = '0x' + ethers.utils.keccak256(ethers.utils.hexConcat([
        '0xff',
        process.env.GOERLI_EIP_1014_CONTRACT,
        ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32),
        ethers.utils.keccak256(Contract.bytecode)
      ])).slice(-40);

      const contract = await Contract.attach(deploymentAddress);

      if (taskArgs.hasOwnProperty('gasLimit')) {
        var result = await contract[taskArgs.functionName](...JSON.parse(taskArgs.functionArgs),{gasLimit : taskArgs.gasLimit});
      } else {
        var result = await contract[taskArgs.functionName](...JSON.parse(taskArgs.functionArgs));
      }

      console.log(result);
})

module.exports = {}
