/**
 * This file is responsible for connecting to the Ethereum blockchain,
 *loading the deployed smart contracts, and exporting them for use in the application.
 */

// Importing ethers.js library to interact with Ethereum blockchain
import { ethers } from 'ethers';

// Importing compiled contract ABIs (from src/abis/... json files)
import RealEstate from '../abis/RealEstate.json';
import Escrow from '../abis/Escrow.json';

// Importing contract addresses based on network
import config from '../config.json';

/**
 * Connects to the Ethereum provider (MetaMask),
 * loads deployed contract instances with their ABIs and addresses,
 * and returns key contract-related objects.
 */
const loadBlockchainData = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  console.log('🔌 Network ID:', network.chainId);

  // Get the signer (user's MetaMask wallet)
  const signer = provider.getSigner();

  // Initialize the RealEstate contract with signer for transaction execution
  const realEstate = new ethers.Contract(
    config[network.chainId].realEstate.address,
    RealEstate.abi,
    signer,
  );

  // Initialize the Escrow contract with signer
  const escrow = new ethers.Contract(
    config[network.chainId].escrow.address,
    Escrow.abi,
    signer,
  );

  // Log loaded contract addresses for debugging
  console.log('🏠 RealEstate Address:', realEstate.address);
  console.log('📜 Escrow Address:', escrow.address);

  return {
    provider,
    signer,
    realEstateContract: realEstate,
    escrowContract: escrow,
  };
};

// Export the function so it can be used in App.js
export { loadBlockchainData };
