// Import the compiled RealEstate smart contract
const RealEstate = artifacts.require('RealEstate');

// Truffle will call this function when running `truffle migrate`
module.exports = async function (deployer) {
  // Deploy the RealEstate contract to the blockchain
  await deployer.deploy(RealEstate);
};
