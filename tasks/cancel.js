task("cancel", "Cancel any currently pending transactions within that first account", async () => {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0].address;

  var gasPrice = await accounts[0].getGasPrice();

  var nonce = await ethers.provider.getTransactionCount(deployer);

  console.log("Nonce of the transactions to cancel is: ", nonce);

  const tx = await accounts[0].sendTransaction({
    from: deployer,
    to: deployer,
    gasPrice: gasPrice,
    value: 0,
    nonce: nonce,
  });

  console.log("Submitted tx hash is: ",tx.hash);

  const receipt = await tx.wait();

  console.log("Transactions have now been cancelled");
})

module.exports = {}
