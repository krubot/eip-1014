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
(node:67879) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Transaction hash of the factory deployment:  0xf3efb560f9f273a1d53ca3ebc5a56f4314930dab117dba4c4e7b90fa07097b51
Factory contract has been deployed at:  0x726b55278FA97665Cd01505333E1e61dE7C3e4c1
Deployment address of contract from factory is:  0xe7b517168899f89d0dbc13a75fb7c4aaee0a19d8
Deployment of contract from factory transaction:  0x810c8656b95ce05af175d687611ccabf587b2773bba2165a2a4b4281ab3cf854
Deployment of contract from factory is complete
```

## Run a transaction

You might like to quickly run a transaction call against the deployed contract, this can be used for testing. The following is an example of function call on `name` with a deployed contract that has been setup with a constructor:

```
npx hardhat tx --contract-name "Storage" --function-name "test" --function-args [""]
```

Your out should look like the following:

```
(node:69382) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
42
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
