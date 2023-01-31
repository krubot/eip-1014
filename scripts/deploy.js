require("dotenv").config();

const { writeFileSync } = require("fs");
const { ethers, artifacts } = require("hardhat");
const readlinePromises = require('readline');

const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question('Arguments file for deployment: ', (constructorArgsFile) => {
  if (constructorArgsFile != "") {
    var argModule = require(process.cwd() + "/" + constructorArgsFile);
  } else {
    var argModule = "";
  }

  deploy(argModule).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  rl.close();
});

async function deploy(deployArgs) {
  const accounts = await ethers.getSigners();

  const abiCoder = new ethers.utils.AbiCoder();

  if (process.env.GOERLI_EIP_1014_CONTRACT == null) {
    const EIP1014 = await ethers.getContractFactory("EIP1014");

    var eip1014 = await EIP1014.deploy();

    console.log("Transaction hash of the factory deployment: ", eip1014.deployTransaction.hash);

    await eip1014.deployed();

    console.log("Factory contract has been deployed at: ", eip1014.address);

    writeFileSync('.env','GOERLI_EIP_1014_CONTRACT=\"' + eip1014.address + '\"\n',{flag:'a+'});
  } else {
    const EIP1014 = await ethers.getContractFactory("EIP1014");

    var eip1014 = await EIP1014.attach(process.env.GOERLI_EIP_1014_CONTRACT);

    console.log("Factory contract has already been deployed at: ", process.env.GOERLI_EIP_1014_CONTRACT);
  }

  const Storage = await ethers.getContractFactory("Storage");

  const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(0),32);

  var deploymentAddress = await eip1014.getAddress(ethers.utils.hexConcat([
    Storage.bytecode,
    abiCoder.encode(['uint256'],deployArgs),
  ]),salt);

  console.log("Deployment address of contract from factory is: ",deploymentAddress);

  if ((await ethers.provider.getCode(deploymentAddress)) == '0x') {
    var codeDeploy = await eip1014.deploy(ethers.utils.hexConcat([
      Storage.bytecode,
      abiCoder.encode(['uint256'],deployArgs),
    ]),salt);

    console.log("Deployment of contract from factory transaction: ",codeDeploy.hash);

    await codeDeploy.wait();

    console.log("Deployment of contract from factory is complete");
  } else {
    console.log("Deployment of contract from factory has already been deployed");
  }
}
