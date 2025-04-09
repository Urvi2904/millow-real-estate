// Import the compiled Escrow smart contract
const Escrow = artifacts.require('Escrow');

// Truffle will call this function when running `truffle migrate`
module.exports = async function (deployer) {
  // Deploy the Escrow contract to the blockchain
  await deployer.deploy(Escrow);
};
