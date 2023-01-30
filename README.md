# Hardhat implementation of eip-1014

This repo deploys an implementation of the eip-1014 standard in the form of a deterministic proxy for learning. It uses hardhat package to run deployments on ethereum goerli network. Please read up on the eip-1014 standard [here](https://eips.ethereum.org/EIPS/eip-1014) to get further information.

## Deterministic proxy

We deploy what is called a factory contract at an address and this factory contract uses the `CREATE2` opcode to deterministically create a new contract with the address derivable using a call method to the factory before deployment. This means no change to the deployment contract code will not deploy a new contract which differs from normal deployments as equal bytecode will always deploy to new contract address without deterministic proxy.

## Compile and deploy

To compile this solidity code you'll need to run hardhat cli using `npx` like the following:

```
npx hardhat compile
```

Now you should be able to deploy your contract to goerli. To do this run the following:

```
npx hardhat run scripts/deploy.js
```

Depending on if you have specified a constructor in the contract section you might need to add a arguments file as input. The following output assumes you have uncommented the constructor and use our given `scripts/arguments.js` file but the run without constructor will not need any input so in that case you can press enter to continue:

```
Compiling contracts/eip-1014.yul...
Arguments file for deployment: scripts/arguments.js
(node:122370) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Transaction hash of the factory deployment:  0x6f81d847441f9f93365b6d002a5bae27101c0c3824fb6dd8b0b10c1f07f5a127
Factory contract has been deployed at:  0xF92972D03927e31EF0179faC71d0a3405466FDA6
Deployment address of contract from factory is:  0xd8b5bd81ac22ddabb8417db9cd93f5bc605f91cc
Deployment of contract from factory transaction:  0xd878c70a525a7cc3e627fe848d79a5aaa8a4c8e2909cd8fc0bd257cfe8d38a13
Deployment of contract from factory is complete
```

## Verify on etherscan

Now that this contract has been deployed it makes sense to verify the contracts code via etherscan. This means that you'll be able to view the contract and its solidity code on etherscan and also be able to interact with its functions via a web wallet. This is a key part of users being able to trust your code, after a deploy its possible for users to view the EVM opcodes and grasp an understanding of whats going on here but solidity is much clearer and commonly understood language and so translates the ideas better.

To run this verify on the deployed contract you run the following:

```
npx hardhat verify <contract-address> --constructor-args <constructor-arguments-file>
```

You can find the contract address from where it says `Contract has been deployed at:` and the constructor arguments file should be the same one you used as input to the `Arguments file for deployment:` section. You can see an example of this with the constructor defined bellow and after it will output the goerli etherscan page:

```
(node:122454) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nothing to compile
Compiling contracts/eip-1014.yul...
Successfully submitted source code for contract
contracts/storage.sol:Storage at 0xd8b5bd81ac22ddabb8417db9cd93f5bc605f91cc
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Storage on Etherscan.
https://goerli.etherscan.io/address/0xd8b5bd81ac22ddabb8417db9cd93f5bc605f91cc#code
```

## Run a transaction

You might like to quickly run a transaction call against the deployed contract, this can be used for testing. The following is an example of function call on `name` with a deployed contract that has been setup with a constructor:

```
npx hardhat tx --contract-name "Storage" --address 0xd8b5bd81ac22ddabb8417db9cd93f5bc605f91cc --function-name "retrieve" --function-args [""]
```

Your out should look like the following:

```
(node:69382) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
52
```


## Cancel transactions

Sometimes you might have long running pending transactions that need to be canceled. This can be because you've set the gas price too low or maybe nodes for other reasons don't want to build that transaction into a new block. You can cancel any pending transaction by deploying a new one with the same nonce as that transaction will no data. This is all automated by running a hardhat cancel task as follows:

```
npx hardhat cancel
```

An example output of this command has been run bellow:

```
(node:2714002) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Nonce of the transactions to cancel is:  248
Submitted tx hash is:  0x6d97fc975a89262ecaabf2ec24ba60413e079a0b55dc75d39c75612758ab99ef
Transactions have now been cancelled
```
