/**
 * App.js file
 *
 * Main entry point for the React application.
 * Manages routes, user sessions, property data, blockchain contract loading,
 * and role-based views (admin/user).
 *
 * Core responsibilities:
 * - Loads blockchain data (RealEstate + Escrow contracts)
 * - Handles login/logout via MetaMask and localStorage
 * - Fetches + enriches property data with blockchain info
 * - Controls navigation and role-based page rendering (admin vs user)
 * - Manages popup toggles for home details
 */

/* eslint-disable react-hooks/exhaustive-deps */

//Import libraries
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { loadBlockchainData } from './services/contracts';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

//Import components
import Login from './components/Login';
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';
import Sell from './components/Sell';
import MyProperties from './components/myProperties';
import InspectionPanel from './components/InspectionPanel';

function App() {
  //Wallet and Role state
  const [account, setAccount] = useState(null); // Current wallet address
  const [userRole, setUserRole] = useState(null); // "admin" or "user"
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state

  //Property listing state
  const [homes, setHomes] = useState([]); // All properties loaded from backend
  const [home, setHome] = useState(null); // Currently selected property (for popup)
  const [toggle, setToggle] = useState(false); // Toggle popup/modal visibility
  const [filter, setFilter] = useState('buy'); // "buy" or "rent"
  const [searchQuery, setSearchQuery] = useState(''); // Search bar query
  const [loading, setLoading] = useState(true); // Property list loading state
  const [selectedHomeId, setSelectedHomeId] = useState(null); // Currently selected home ID

  //Blockchain smart contract state
  const [provider, setProvider] = useState(null); // Ethereum provider (e.g., MetaMask)
  const [realEstateContract, setRealEstateContract] = useState(null); // NFT contract instance
  const [escrowContract, setEscrowContract] = useState(null); // Escrow contract instance
  const [contractsLoaded, setContractsLoaded] = useState(false); // Track if contracts are ready

  // Load wallet information from localStorage
  useEffect(() => {
    const wallet = localStorage.getItem('walletAddress');
    const role = localStorage.getItem('userRole');

    if (wallet && (role === 'admin' || role === 'user')) {
      setAccount(wallet);
      setUserRole(role);
      setIsLoggedIn(true);
    }
  }, []);

  // Load blockchain smart contracts once user is logged in
  useEffect(() => {
    const tryLoad = async () => {
      if (isLoggedIn) {
        await loadContracts();
      }
    };
    tryLoad();
  }, [isLoggedIn]);

  // Load properties once contracts are ready
  useEffect(() => {
    const loadData = async () => {
      if (isLoggedIn && contractsLoaded && homes.length === 0) {
        await loadBackendData();
      }
    };
    loadData();
  }, [isLoggedIn, contractsLoaded]);

  // Connect to contracts using ethers.js
  const loadContracts = async () => {
    try {
      const { provider, realEstateContract, escrowContract } =
        await loadBlockchainData();
      setProvider(provider);
      setRealEstateContract(realEstateContract);
      setEscrowContract(escrowContract);
      setContractsLoaded(true);
    } catch (err) {
      console.error('❌ Failed to load contracts:', err);
    }
  };

  // Load property data from backend and enrich with blockchain status (buyer, admin)
  useEffect(() => {
    loadBackendData();
  }, []);

  const loadBackendData = async () => {
    if (!escrowContract) {
      console.warn('⏳ Escrow contract not ready yet.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/properties');
      const data = await response.json();

      //Enrich each property with blockchain information
      const enriched = await Promise.all(
        data.map(async (home) => {
          let buyer = null;
          let inspectionPassed = false;

          if (home.tokenId) {
            try {
              const tokenId = ethers.BigNumber.from(home.tokenId);
              buyer = await escrowContract.buyer(tokenId);
              inspectionPassed = await escrowContract.inspectionPassed(tokenId);
            } catch (err) {
              console.warn(
                `⚠️ Failed to fetch status for token ${home.tokenId}`,
                err,
              );
            }
          }

          return { ...home, buyer, inspectionPassed };
        }),
      );

      setHomes(enriched);
    } catch (error) {
      console.error('❌ Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle login/logout actions from Login.js
  const handleLogin = () => {
    const wallet = localStorage.getItem('walletAddress');
    const role = localStorage.getItem('userRole');

    if (
      wallet &&
      (role === 'admin' || role === 'user') &&
      (wallet !== account || role !== userRole)
    ) {
      setAccount(wallet);
      setUserRole(role);
      setIsLoggedIn(true);
    }
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.clear();
    setAccount(null);
    setUserRole(null);
    setIsLoggedIn(false);
    setHomes([]);
    setProvider(null);
    setRealEstateContract(null);
    setEscrowContract(null);
    setContractsLoaded(false);
  };

  //Reset selected property
  const resetSelection = () => {
    setSelectedHomeId(null);
    setHome(null);
  };
  //Open/close property popup
  const togglePop = (home = null) => {
    setToggle(!!home);
    setHome(home);
    setSelectedHomeId(home ? String(home.id) : null);
  };
  // (JSX return) main routing based on login + role
  return (
    <Router>
      <Routes>
        {/* Not logged in : shoe login */}
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : userRole === 'admin' ? (
          //admin routes
          <>
            {/* Admin Sell Page - for listing properties */}
            <Route
              path="/sell"
              element={
                <>
                  <Navigation
                    account={account}
                    onLogout={handleLogout}
                    isAdmin={true}
                  />

                  {/* Render Sell component only after contracts are loaded */}
                  {contractsLoaded ? (
                    <Sell
                      account={account}
                      provider={provider}
                      realEstate={realEstateContract}
                      escrow={escrowContract}
                      reloadHomes={loadBackendData}
                      resetSelection={resetSelection}
                    />
                  ) : (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                      🔄 <strong>Connecting to contracts...</strong>
                    </p>
                  )}
                </>
              }
            />

            {/* Admin Inspections Panel - for approving inspections */}
            <Route
              path="/inspections"
              element={
                <>
                  <Navigation
                    account={account}
                    onLogout={handleLogout}
                    isAdmin={true}
                  />
                  {contractsLoaded ? (
                    <InspectionPanel
                      account={account}
                      escrow={escrowContract}
                    />
                  ) : (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                      🔄 <strong>Loading inspection data...</strong>
                    </p>
                  )}
                </>
              }
            />

            {/* Redirect any other route to the Sell page as default for admin */}
            <Route path="*" element={<Navigate to="/sell" replace />} />
          </>
        ) : (
          //User routes
          <>
            {/* Homepage - shows filtered listings */}
            <Route
              path="/"
              element={
                <>
                  <Navigation
                    account={account}
                    setFilter={setFilter}
                    activeFilter={filter}
                    onLogout={handleLogout}
                    isAdmin={false}
                  />

                  {/* Search bar for filtering properties */}
                  <Search setSearchQuery={setSearchQuery} />

                  {/* Property cards section */}
                  <div className="cards__section">
                    <h3>Homes For You</h3>
                    <hr />
                    {loading ? (
                      <p>Loading properties...</p>
                    ) : (
                      (() => {
                        // Filter homes by type + search
                        const filteredHomes = homes.filter((home) => {
                          const type = home.attributes
                            ?.find((attr) => attr.trait_type === 'Listing Type')
                            ?.value?.toLowerCase();
                          const isTypeMatch = filter
                            ? type === filter.toLowerCase()
                            : true;
                          const matchesSearch = home.address
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());
                          const isBuy = type === 'buy';
                          const inspectionPassed =
                            home.inspectionPassed === true;

                          // Don't show homes that are already sold
                          return (
                            isTypeMatch &&
                            matchesSearch &&
                            !(isBuy && inspectionPassed)
                          );
                        });

                        // If no homes match the criteria, show a message
                        return filteredHomes.length === 0 ? (
                          <p className="no-results">
                            😕 No homes match your criteria.
                          </p>
                        ) : (
                          // Render the filtered homes
                          <div className="cards">
                            {filteredHomes.map((home, index) => (
                              <div
                                className={`card ${selectedHomeId === String(home.id) ? 'active' : ''}`}
                                key={index}
                                role="button"
                                tabIndex={0}
                                onClick={() => togglePop(home)}
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && togglePop(home)
                                }
                              >
                                {/* Property image */}
                                <div className="card__image">
                                  <img
                                    src={
                                      home.image?.startsWith('http')
                                        ? home.image
                                        : `http://localhost:5000${home.image}`
                                    }
                                    alt="Home"
                                  />
                                </div>

                                {/* Property info block */}
                                <div className="card__info">
                                  <h4>
                                    {home.attributes?.[0]?.value || '?'} ETH
                                  </h4>
                                  <p>{home.address}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    )}
                  </div>

                  {/* Property details popup/modal */}
                  {toggle && home && contractsLoaded && (
                    <Home
                      home={home}
                      provider={provider}
                      account={account}
                      escrow={escrowContract}
                      togglePop={togglePop}
                    />
                  )}
                </>
              }
            />

            {/* My Properties - shows properties owned by the user */}
            <Route
              path="/my-properties"
              element={
                <>
                  {/* Top Navigation bar for users */}
                  <Navigation
                    account={account}
                    onLogout={handleLogout}
                    isAdmin={false}
                  />

                  {/* Load component only if contracts are ready */}
                  {contractsLoaded ? (
                    <MyProperties account={account} escrow={escrowContract} />
                  ) : (
                    // Loading state while waiting for contracts load
                    <p style={{ textAlign: 'center', padding: '2rem' }}>
                      🔄 <strong>Loading properties...</strong>
                    </p>
                  )}
                </>
              }
            />

            {/* Catch-all fallback route for users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
