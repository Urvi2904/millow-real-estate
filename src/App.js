import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';
import Sell from './components/Sell';

import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [filter, setFilter] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedHomeId, setSelectedHomeId] = useState(null);

  const resetSelection = () => {
    setSelectedHomeId(null);
    setHome(null);
  };

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSettings = () => setShowSettings(!showSettings);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  const loadBackendData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/properties");
      const data = await response.json();
      setHomes(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load properties from backend:", error);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, []);

  // ✅ Fixed togglePop to handle both open and close cases
  const togglePop = (home = null) => {
    if (toggle) {
      // Closing modal
      setSelectedHomeId(null);
      setHome(null);
      setToggle(false);
    } else if (home) {
      // Opening modal
      setHome(home);
      setSelectedHomeId(String(home.id));
      setToggle(true);
    }
  };

  const filteredHomes = homes
    .filter(home => Array.isArray(home.attributes))
    .filter((home) => {
      const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
      const matchesCategory =
        filter === 'buy' ? listingType === 'buy' :
        filter === 'rent' ? listingType === 'rent' : true;

      const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

  return (
    <Router>
      <Navigation
        account={account}
        connectWallet={connectWallet}
        setFilter={setFilter}
        activeFilter={filter}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Search setSearchQuery={setSearchQuery} />

              <div className="settings-menu">
                <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
                {showSettings && (
                  <div className="settings-dropdown">
                    <button onClick={toggleTheme}>
                      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                  </div>
                )}
              </div>

              <div className='cards__section'>
                <h3>Homes For You</h3>
                <hr />

                {loading ? (
                  <p className="loading">Loading homes from the backend...</p>
                ) : (
                  <div className='cards'>
                    {filteredHomes.length === 0 ? (
                      <p className="no-results">😕 No homes match your criteria.</p>
                    ) : (
                      filteredHomes.map((home, index) => (
                        <div
                          className={`card ${
                            String(selectedHomeId) === String(home.id) ? 'active' : ''
                          }`}
                          key={index}
                          onClick={() => togglePop(home)}
                        >
                          {[4, 5].includes(Number(home.id)) && <span className="badge">New</span>}
                          <div className='card__image'>
                            <img
                              src={home.image?.startsWith('http') ? home.image : `http://localhost:5000${home.image}`}
                              alt="Home"
                            />
                          </div>
                          <div className='card__info'>
                            <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
                            <p>
                              <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
                              <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
                              <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
                            </p>
                            <p>{home.address}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {toggle && home && (
                <Home
                  home={home}
                  provider={provider}
                  account={account}
                  escrow={null}
                  togglePop={togglePop}
                />
              )}
            </>
          }
        />
        <Route
          path="/sell"
          element={
            <Sell
              account={account}
              reloadHomes={loadBackendData}
              resetSelection={resetSelection}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;



// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';
// import Sell from './components/Sell';

// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const [filter, setFilter] = useState('buy');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedHomeId, setSelectedHomeId] = useState(null);
//   // const resetSelection = () => setSelectedHomeId(null);
//   const resetSelection = () => {
//     setSelectedHomeId(null);
//     setHome(null);
//   };
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark' ||
//       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleSettings = () => setShowSettings(!showSettings);

//   const connectWallet = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = ethers.utils.getAddress(accounts[0]);
//     setAccount(account);
//   };

//   const loadBackendData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/properties");
//       const data = await response.json();
//       setHomes(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to load properties from backend:", error);
//     }
//   };

//   useEffect(() => {
//     loadBackendData();
//   }, []);

//   const togglePop = (home) => {
//     setHome(home);
//     setToggle(!toggle);
//     setSelectedHomeId(home.id);
//   };

//   const filteredHomes = homes
//     .filter(home => Array.isArray(home.attributes))
//     .filter((home) => {
//       const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
//       const matchesCategory =
//         filter === 'buy' ? listingType === 'buy' :
//         filter === 'rent' ? listingType === 'rent' : true;

//       const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());

//       return matchesCategory && matchesSearch;
//     });

//   return (
//     <Router>
//       <Navigation
//         account={account}
//         connectWallet={connectWallet}
//         setFilter={setFilter}
//         activeFilter={filter}
//       />

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <>
//               <Search setSearchQuery={setSearchQuery} />

//               <div className="settings-menu">
//                 <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
//                 {showSettings && (
//                   <div className="settings-dropdown">
//                     <button onClick={toggleTheme}>
//                       {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className='cards__section'>
//                 <h3>Homes For You</h3>
//                 <hr />

//                 {loading ? (
//                   <p className="loading">Loading homes from the backend...</p>
//                 ) : (
//                   <div className='cards'>
//                     {filteredHomes.length === 0 ? (
//                       <p className="no-results">😕 No homes match your criteria.</p>
//                     ) : (
//                       filteredHomes.map((home, index) => (
//                         // <div
//                         //   className={`card ${selectedHomeId === home.id ? 'active' : ''}`}
//                         //   key={index}
//                         //   onClick={() => togglePop(home)}
//                         // >
//                         <div
//                         className={`card ${String(selectedHomeId) === String(home.id) ? 'active' : ''}`}
//                         key={index}
//                         onClick={() => togglePop(home)}
//                         >

                        
//                           {[4, 5].includes(Number(home.id)) && <span className="badge">New</span>}
//                           <div className='card__image'>
//                             <img
//                               src={home.image?.startsWith('http') ? home.image : `http://localhost:5000${home.image}`}
//                               alt="Home"
//                             />
//                           </div>
//                           <div className='card__info'>
//                             <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
//                             <p>
//                               <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
//                               <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
//                               <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
//                             </p>
//                             <p>{home.address}</p>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>

//               {toggle && (
//                 <Home
//                   home={home}
//                   provider={provider}
//                   account={account}
//                   escrow={null}
//                   togglePop={togglePop}
//                 />
//               )}
//             </>
//           }
//         />
//         <Route path="/sell" 
//           element={
//           <Sell 
//           account={account} 
//           reloadHomes={loadBackendData}
//           resetSelection={resetSelection}
//           />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



//--------------------------2 april------------------------
// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';
// import Sell from './components/Sell';

// // Config
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const [filter, setFilter] = useState('buy');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedHomeId, setSelectedHomeId] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark' ||
//       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleSettings = () => setShowSettings(!showSettings);

//   const connectWallet = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = ethers.utils.getAddress(accounts[0]);
//     setAccount(account);
//   };

//   const loadBackendData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/properties");
//       const data = await response.json();
//       console.log("Fetched homes from backend:", data);
//       setHomes(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to load properties from backend:", error);
//     }
//   };

//   useEffect(() => {
//     loadBackendData();
//   }, []);

//   const togglePop = (home) => {
//     setHome(home);
//     setToggle(!toggle);
//     setSelectedHomeId(home.id);
//   };

//   // ✅ Safe filtering logic
//   // const filteredHomes = homes
//   //   .filter(home => Array.isArray(home.attributes))
//   //   .filter((home) => {
//   //     const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
//   //     const matchesCategory =
//   //       filter === 'buy' ? listingType === 'buy' :
//   //       filter === 'rent' ? listingType === 'rent' :
//   //       filter === 'sell' ? listingType === 'sell' : true;
//   //     const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());
//   //     return matchesCategory && matchesSearch;
//   //   });

//   const filteredHomes = homes
//   .filter(home => Array.isArray(home.attributes))
//   .filter((home) => {
//     const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
    
//     console.log(`🏷️ Home ID: ${home.id} | Listing Type: ${listingType} | Filter: ${filter}`);

//     const matchesCategory =
//       filter === 'buy' ? listingType === 'buy' :
//       filter === 'rent' ? listingType === 'rent' :
//       filter === 'sell' ? listingType === 'sell' : true;

//     const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());

//     console.log(`✅ Matches Category: ${matchesCategory}, 🔍 Matches Search: ${matchesSearch}`);

//     return matchesCategory && matchesSearch;
//   });


//   return (
//     <div>
//       <Navigation
//         account={account}
//         connectWallet={connectWallet}
//         setFilter={setFilter}
//         activeFilter={filter}
//       />
//       <Search setSearchQuery={setSearchQuery} />

//       <div className="settings-menu">
//         <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
//         {showSettings && (
//           <div className="settings-dropdown">
//             <button onClick={toggleTheme}>
//               {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//             </button>
//           </div>
//         )}
//       </div>

//       <div className='cards__section'>
//         <h3>Homes For You</h3>
//         <hr />

//         {loading ? (
//           <p className="loading">Loading homes from the backend...</p>
//         ) : (
//           <div className='cards'>
//             {filteredHomes.length === 0 ? (
//               <p className="no-results">😕 No homes match your criteria.</p>
//             ) : (
//               filteredHomes.map((home, index) => (
//                 <div
//                   className={`card ${selectedHomeId === home.id ? 'active' : ''}`}
//                   key={index}
//                   onClick={() => togglePop(home)}
//                 >
//                   {[4, 5].includes(Number(home.id)) && <span className="badge">New</span>}
//                   <div className='card__image'>
//                     {/* <img src={home.image} alt="Home" /> */}
//                     <img
//                      src={home.image?.startsWith('http') ? home.image : `http://localhost:5000${home.image}`}
//                      alt="Home"
//                     />

//                   </div>
//                   <div className='card__info'>
//                     <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
//                     <p>
//                       <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
//                       <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
//                       <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
//                     </p>
//                     <p>{home.address}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {toggle && (
//         <Home
//           home={home}
//           provider={provider}
//           account={account}
//           escrow={null}
//           togglePop={togglePop}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

//----------------------------------------------

// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';
// import Sell from './components/Sell'; 

// // Config
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const [filter, setFilter] = useState('buy');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedHomeId, setSelectedHomeId] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark' ||
//       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleSettings = () => setShowSettings(!showSettings);

//   const connectWallet = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = ethers.utils.getAddress(accounts[0]);
//     setAccount(account);
//   };

//   const loadBackendData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/properties");
//       const data = await response.json();
//       console.log("Fetched homes from backend:", data);
//       setHomes(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to load properties from backend:", error);
//     }
//   };

//   useEffect(() => {
//     loadBackendData();
//   }, []);

//   const togglePop = (home) => {
//     setHome(home);
//     setToggle(!toggle);
//     setSelectedHomeId(home.id);
//   };

//   const filteredHomes = homes
//     .filter(home => Array.isArray(home.attributes))
//     .filter((home) => {
//       const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
//       console.log(`🏷️ Home ID: ${home.id} | Listing Type: ${listingType} | Filter: ${filter}`);

//       const matchesCategory =
//         filter === 'buy' ? listingType === 'buy' :
//         filter === 'rent' ? listingType === 'rent' :
//         filter === 'sell' ? listingType === 'sell' : true;

//       const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());

//       console.log(`✅ Matches Category: ${matchesCategory}, 🔍 Matches Search: ${matchesSearch}`);

//       return matchesCategory && matchesSearch;
//     });

//   return (
//     <Router>
//       <Navigation
//         account={account}
//         connectWallet={connectWallet}
//         setFilter={setFilter}
//         activeFilter={filter}
//       />
//       <Search setSearchQuery={setSearchQuery} />

//       <div className="settings-menu">
//         <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
//         {showSettings && (
//           <div className="settings-dropdown">
//             <button onClick={toggleTheme}>
//               {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//             </button>
//           </div>
//         )}
//       </div>

//       <Routes>
//         <Route path="/" element={
//           <div className='cards__section'>
//             <h3>Homes For You</h3>
//             <hr />

//             {loading ? (
//               <p className="loading">Loading homes from the backend...</p>
//             ) : (
//               <div className='cards'>
//                 {filteredHomes.length === 0 ? (
//                   <p className="no-results">😕 No homes match your criteria.</p>
//                 ) : (
//                   filteredHomes.map((home, index) => (
//                     <div
//                       className={`card ${selectedHomeId === home.id ? 'active' : ''}`}
//                       key={index}
//                       onClick={() => togglePop(home)}
//                     >
//                       {[4, 5].includes(Number(home.id)) && <span className="badge">New</span>}
//                       <div className='card__image'>
//                         {/* <img src={home.image} alt="Home" /> */}
//                         <img src={`http://localhost:5000${home.image}`} alt="Home" />

//                       </div>
//                       <div className='card__info'>
//                         <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
//                         <p>
//                           <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
//                           <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
//                           <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
//                         </p>
//                         <p>{home.address}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {toggle && (
//               <Home
//                 home={home}
//                 provider={provider}
//                 account={account}
//                 escrow={null}
//                 togglePop={togglePop}
//               />
//             )}
//           </div>
//         } />

//         <Route path="/sell" element={<Sell account={account} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


//---------------------------------------1 april --------------------------
// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Sell from './components/Sell'; // Import Sell page


// // Config
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const [filter, setFilter] = useState('buy');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedHomeId, setSelectedHomeId] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark' ||
//       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleSettings = () => setShowSettings(!showSettings);

//   const connectWallet = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = ethers.utils.getAddress(accounts[0]);
//     setAccount(account);
//   };

//   const loadBackendData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/properties");
//       const data = await response.json();
//       console.log("Fetched homes from backend:", data);
//       setHomes(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to load properties from backend:", error);
//     }
//   };

//   useEffect(() => {
//     loadBackendData();
//   }, []);

//   const togglePop = (home) => {
//     setHome(home);
//     setToggle(!toggle);
//     setSelectedHomeId(home.id);
//   };

//   // ✅ Safe filtering logic
//   // const filteredHomes = homes
//   //   .filter(home => Array.isArray(home.attributes))
//   //   .filter((home) => {
//   //     const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
//   //     const matchesCategory =
//   //       filter === 'buy' ? listingType === 'buy' :
//   //       filter === 'rent' ? listingType === 'rent' :
//   //       filter === 'sell' ? listingType === 'sell' : true;
//   //     const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());
//   //     return matchesCategory && matchesSearch;
//   //   });

//   const filteredHomes = homes
//   .filter(home => Array.isArray(home.attributes))
//   .filter((home) => {
//     const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
    
//     console.log(`🏷️ Home ID: ${home.id} | Listing Type: ${listingType} | Filter: ${filter}`);

//     const matchesCategory =
//       filter === 'buy' ? listingType === 'buy' :
//       filter === 'rent' ? listingType === 'rent' :
//       filter === 'sell' ? listingType === 'sell' : true;

//     const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());

//     console.log(`✅ Matches Category: ${matchesCategory}, 🔍 Matches Search: ${matchesSearch}`);

//     return matchesCategory && matchesSearch;
//   });


//   return (
//     <div>
//       <Navigation
//         account={account}
//         connectWallet={connectWallet}
//         setFilter={setFilter}
//         activeFilter={filter}
//       />
//       <Search setSearchQuery={setSearchQuery} />

//       <div className="settings-menu">
//         <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
//         {showSettings && (
//           <div className="settings-dropdown">
//             <button onClick={toggleTheme}>
//               {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//             </button>
//           </div>
//         )}
//       </div>

//       <div className='cards__section'>
//         <h3>Homes For You</h3>
//         <hr />

//         {loading ? (
//           <p className="loading">Loading homes from the backend...</p>
//         ) : (
//           <div className='cards'>
//             {filteredHomes.length === 0 ? (
//               <p className="no-results">😕 No homes match your criteria.</p>
//             ) : (
//               filteredHomes.map((home, index) => (
//                 <div
//                   className={`card ${selectedHomeId === home.id ? 'active' : ''}`}
//                   key={index}
//                   onClick={() => togglePop(home)}
//                 >
//                   {[4, 5].includes(Number(home.id)) && <span className="badge">New</span>}
//                   <div className='card__image'>
//                     <img src={home.image} alt="Home" />
//                   </div>
//                   <div className='card__info'>
//                     <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
//                     <p>
//                       <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
//                       <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
//                       <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
//                     </p>
//                     <p>{home.address}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {toggle && (
//         <Home
//           home={home}
//           provider={provider}
//           account={account}
//           escrow={null}
//           togglePop={togglePop}
//         />
//       )}
//     </div>
//   );
// }

// export default App;



//------------------------------------------------------------------------
// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';

// // Config (you can remove the ABIs since we're not using them right now)
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedHomeId, setSelectedHomeId] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark' ||
//       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleSettings = () => setShowSettings(!showSettings);

//   const connectWallet = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = ethers.utils.getAddress(accounts[0]);
//     setAccount(account);
//   };

//   const loadBackendData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/properties");
//       const data = await response.json();
//       console.log("Fetched homes from backend:", data);
//       setHomes(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to load properties from backend:", error);
//     }
//   };

//   useEffect(() => {
//     loadBackendData();
//   }, []);

//   const togglePop = (home) => {
//     setHome(home);
//     setToggle(!toggle);
//     setSelectedHomeId(home.id);
//   };

//   return (
//     <div>
//       <Navigation
//         account={account}
//         connectWallet={connectWallet}
//         setFilter={() => {}}
//         activeFilter={''}
//       />
//       <Search setSearchQuery={setSearchQuery} />

//       <div className="settings-menu">
//         <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
//         {showSettings && (
//           <div className="settings-dropdown">
//             <button onClick={toggleTheme}>
//               {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//             </button>
//           </div>
//         )}
//       </div>

//       <div className='cards__section'>
//         <h3>Homes For You</h3>
//         <hr />

//         {loading ? (
//           <p className="loading">Loading homes from backend...</p>
//         ) : (
//           <div className='cards'>
//             {homes.length === 0 ? (
//               <p className="no-results">😕 No homes found.</p>
//             ) : (
//               homes.map((home, index) => (
//                 <div
//                   className={`card ${selectedHomeId === home.id ? 'active' : ''}`}
//                   key={index}
//                   onClick={() => togglePop(home)}
//                 >
//                   <div className='card__image'>
//                     <img src={home.image} alt="Home" />
//                   </div>
//                   <div className='card__info'>
//                     <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
//                     <p>
//                       <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
//                       <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
//                       <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
//                     </p>
//                     <p>{home.address}</p>
//                     <pre style={{ fontSize: '0.6rem', color: 'gray' }}>
//                       {JSON.stringify(home.attributes, null, 2)}
//                     </pre>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {toggle && (
//         <Home
//           home={home}
//           provider={provider}
//           account={account}
//           escrow={null}
//           togglePop={togglePop}
//         />
//       )}
//     </div>
//   );
// }

// export default App;







//-------------------------------------------------latest frontend before propertyregistry.sol-------------------------------

// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';

// // ABIs
// import RealEstate from './abis/RealEstate.json';
// import Escrow from './abis/Escrow.json';

// // Config
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [escrow, setEscrow] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const [filter, setFilter] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedHomeId, setSelectedHomeId] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark' ||
//       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleSettings = () => setShowSettings(!showSettings);

//   const connectWallet = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = ethers.utils.getAddress(accounts[0]);
//     setAccount(account); // This correctly sets your account state.
// };

// const loadBackendData = async () => {
//   try {
//     const response = await fetch("http://localhost:5000/api/properties");
//     const data = await response.json();
//     console.log("Fetched homes from backend:", data);  // <-- 👈 Add this line
//     setHomes(data);
//     setLoading(false);
//   } catch (error) {
//     console.error("Failed to load properties from backend:", error);
//   }
// };


//   // const loadBlockchainData = async () => {
//   //   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   //   setProvider(provider);
//   //   const network = await provider.getNetwork();

//   //   const networkData = config[network.chainId];
//   //   if (!networkData) {
//   //     alert(`Unsupported network (chainId: ${network.chainId}). Please update config.json.`);
//   //     return;
//   //   }

//   //   const realEstate = new ethers.Contract(
//   //     networkData.realEstate.address,
//   //     RealEstate,
//   //     provider
//   //   );
//   //   const totalSupply = await realEstate.totalSupply();
//   //   const homes = [];

//   //   for (let i = 1; i <= totalSupply; i++) {
//   //     const uri = await realEstate.tokenURI(i);
//   //     let finalUri = uri;
//   //     if (!uri.startsWith('http')) {
//   //       finalUri = `${window.location.origin}/${uri}`;
//   //     }
//   //     try {
//   //       const response = await fetch(finalUri);
//   //       const metadata = await response.json();
//   //       homes.push({ ...metadata, id: i });
//   //     } catch (error) {
//   //       console.error(`Failed to fetch metadata for token ${i}:`, error);
//   //     }
//   //   }

//   //   setHomes(homes);
//   //   setLoading(false);

//   //   const escrow = new ethers.Contract(
//   //     networkData.escrow.address,
//   //     Escrow,
//   //     provider
//   //   );
//   //   setEscrow(escrow);

//   //   window.ethereum.on('accountsChanged', async () => {
//   //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//   //     const account = ethers.utils.getAddress(accounts[0]);
//   //     setAccount(account);
//   //   });
//   // };

//   // useEffect(() => {
//   //   loadBlockchainData();
//   // }, []);

//   useEffect(() => {
//     loadBackendData();
//   }, []);
  

//   const togglePop = (home) => {
//     setHome(home);
//     setToggle(!toggle);
//     setSelectedHomeId(home.id);
//   };

//   // const filteredHomes = homes.filter((home) => {
//   //   const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
//   //   const matchesCategory =
//   //     filter === 'buy' ? listingType === 'buy' :
//   //     filter === 'rent' ? listingType === 'rent' :
//   //     filter === 'sell' ? listingType === 'sell' : true;
//   //   const matchesSearch = home.address.toLowerCase().includes(searchQuery.toLowerCase());
//   //   return matchesCategory && matchesSearch;
//   // });

//   const filteredHomes = homes.filter((home) => {
//     const attributes = home.attributes || [];
//     const listingType = attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
  
//     const matchesCategory =
//       filter === 'buy' ? listingType === 'buy' :
//       filter === 'rent' ? listingType === 'rent' :
//       filter === 'sell' ? listingType === 'sell' : true;
  
//     const matchesSearch = home.address?.toLowerCase().includes(searchQuery.toLowerCase());
  
//     return matchesCategory && matchesSearch;
//   });
  

//   return (
//     <div>
//       <Navigation
//         account={account}
//         connectWallet={connectWallet}
//         setFilter={setFilter}
//         activeFilter={filter}
//       />
//       <Search setSearchQuery={setSearchQuery} />

//       <div className="settings-menu">
//         <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
//         {showSettings && (
//           <div className="settings-dropdown">
//             <button onClick={toggleTheme}>
//               {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//             </button>
//           </div>
//         )}
//       </div>

//       <div className='cards__section'>
//         <h3>Homes For You</h3>
//         <hr />

//         {loading ? (
//           <p className="loading">Loading homes from the blockchain...</p>
//         ) : (
//           <div className='cards'>
//             {filteredHomes.length === 0 ? (
//               <p className="no-results">😕 No homes match your criteria.</p>
//             ) : (
//               filteredHomes.map((home, index) => (
//                 <div
//                   className={`card ${selectedHomeId === home.id ? 'active' : ''}`}
//                   key={index}
//                   onClick={() => togglePop(home)}
//                 >
//                   {[4, 5].includes(home.id) && <span className="badge">New</span>}
//                   <div className='card__image'>
//                     <img src={home.image} alt="Home" />
//                   </div>
//                   <div className='card__info'>
//                     <h4>{home.attributes[0].value} ETH</h4>
//                     <p>
//                       <strong>{home.attributes[2].value}</strong> bds |
//                       <strong>{home.attributes[3].value}</strong> ba |
//                       <strong>{home.attributes[4].value}</strong> sqft
//                     </p>
//                     <p>{home.address}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {toggle && (
//         <Home
//           home={home}
//           provider={provider}
//           account={account}
//           escrow={escrow}
//           togglePop={togglePop}
//         />
//       )}
//     </div>
//   );
// }

// export default App;


//---------------------------------------------------frontend working done----------------------------

// // App.js
// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';

// // ABIs
// import RealEstate from './abis/RealEstate.json';
// import Escrow from './abis/Escrow.json';

// // Config
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [escrow, setEscrow] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const [filter, setFilter] = useState('buy');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedHomeId, setSelectedHomeId] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem('theme') === 'dark' ||
//       (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//   });
//   const [showSettings, setShowSettings] = useState(false);

//   useEffect(() => {
//     document.body.classList.toggle('dark', darkMode);
//     localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);
//   const toggleSettings = () => setShowSettings(!showSettings);

//   const loadBlockchainData = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     setProvider(provider);
//     const network = await provider.getNetwork();

//     const networkData = config[network.chainId];
//     if (!networkData) {
//       alert(`Unsupported network (chainId: ${network.chainId}). Please update config.json.`);
//       return;
//     }

//     const realEstate = new ethers.Contract(
//       networkData.realEstate.address,
//       RealEstate,
//       provider
//     );
//     const totalSupply = await realEstate.totalSupply();
//     const homes = [];

//     for (let i = 1; i <= totalSupply; i++) {
//       const uri = await realEstate.tokenURI(i);
//       let finalUri = uri;
//       if (!uri.startsWith('http')) {
//         finalUri = `${window.location.origin}/${uri}`;
//       }
//       try {
//         const response = await fetch(finalUri);
//         const metadata = await response.json();
//         homes.push({ ...metadata, id: i });
//       } catch (error) {
//         console.error(`Failed to fetch metadata for token ${i}:`, error);
//       }
//     }

//     setHomes(homes);
//     setLoading(false);

//     const escrow = new ethers.Contract(
//       networkData.escrow.address,
//       Escrow,
//       provider
//     );
//     setEscrow(escrow);

//     window.ethereum.on('accountsChanged', async () => {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const account = ethers.utils.getAddress(accounts[0]);
//       setAccount(account);
//     });
//   };

//   useEffect(() => {
//     loadBlockchainData();
//   }, []);

//   const togglePop = (home) => {
//     setHome(home);
//     setToggle(!toggle);
//     setSelectedHomeId(home.id);
//   };

//   const filteredHomes = homes.filter((home) => {
//     const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();
//     const matchesCategory =
//       filter === 'buy' ? listingType === 'buy' :
//       filter === 'rent' ? listingType === 'rent' :
//       filter === 'sell' ? listingType === 'sell' : true;
//     const matchesSearch = home.address.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <div>
//       <Navigation
//         account={account}
//         setAccount={setAccount}
//         setFilter={setFilter}
//         activeFilter={filter}
//       />
//       <Search setSearchQuery={setSearchQuery} />

//       <div className="settings-menu">
//         <button className="settings-toggle" onClick={toggleSettings}>⚙️</button>
//         {showSettings && (
//           <div className="settings-dropdown">
//             <button onClick={toggleTheme}>
//               {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//             </button>
//           </div>
//         )}
//       </div>

//       <div className='cards__section'>
//         <h3>Homes For You</h3>
//         <hr />

//         {loading ? (
//           <p className="loading">Loading homes from the blockchain...</p>
//         ) : (
//           <div className='cards'>
//             {filteredHomes.length === 0 ? (
//               <p className="no-results">😕 No homes match your criteria.</p>
//             ) : (
//               filteredHomes.map((home, index) => (
//                 <div
//                   className={`card ${selectedHomeId === home.id ? 'active' : ''}`}
//                   key={index}
//                   onClick={() => togglePop(home)}
//                 >
//                   {[4, 5].includes(home.id) && <span className="badge">New</span>}
//                   <div className='card__image'>
//                     <img src={home.image} alt="Home" />
//                   </div>
//                   <div className='card__info'>
//                     <h4>{home.attributes[0].value} ETH</h4>
//                     <p>
//                       <strong>{home.attributes[2].value}</strong> bds |
//                       <strong>{home.attributes[3].value}</strong> ba |
//                       <strong>{home.attributes[4].value}</strong> sqft
//                     </p>
//                     <p>{home.address}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {toggle && (
//         <Home
//           home={home}
//           provider={provider}
//           account={account}
//           escrow={escrow}
//           togglePop={togglePop}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

//-------------------------------------------------------------------------------------------------------

// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';

// // ABIs
// import RealEstate from './abis/RealEstate.json';
// import Escrow from './abis/Escrow.json';

// // Config
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null);
//   const [escrow, setEscrow] = useState(null);

//   const [account, setAccount] = useState(null);

//   const [homes, setHomes] = useState([]);
//   const [home, setHome] = useState({});
//   const [toggle, setToggle] = useState(false);

//   // ✅ NEW: Added filter state
//   const [filter, setFilter] = useState('buy'); // default filter

//   const [searchQuery, setSearchQuery] = useState('');


//   const loadBlockchainData = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     setProvider(provider);
//     const network = await provider.getNetwork();

//     console.log("Connected network chainId:", network.chainId);

//     // ✅ Safe check for config.json entry
//     const networkData = config[network.chainId];

//     if (!networkData) {
//       alert(`Unsupported network (chainId: ${network.chainId}). Please update config.json.`);
//       return;
//     }

//     // ✅ Use networkData instead of config[chainId] directly
//     const realEstate = new ethers.Contract(
//       networkData.realEstate.address,
//       RealEstate,
//       provider
//     );
//     const totalSupply = await realEstate.totalSupply();
//     const homes = [];

//     for (let i = 1; i <= totalSupply; i++) {
//       const uri = await realEstate.tokenURI(i);
//       //const response = await fetch(uri);
//       let finalUri = uri;
//       if (!uri.startsWith("http")) {
//          finalUri = `${window.location.origin}/${uri}`;
//       }
//       const response = await fetch(finalUri);

//       const metadata = await response.json();
//       homes.push(metadata);
//     }

//     setHomes(homes);

//     const escrow = new ethers.Contract(
//       networkData.escrow.address,
//       Escrow,
//       provider
//     );
//     setEscrow(escrow);

//     window.ethereum.on('accountsChanged', async () => {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const account = ethers.utils.getAddress(accounts[0]);
//       setAccount(account);
//     });
//   };

//   useEffect(() => {
//     loadBlockchainData();
//   }, []);

//   const togglePop = (home) => {
//     setHome(home);
//     toggle ? setToggle(false) : setToggle(true);
//   };

//   return (
//     <div>
//       <Navigation account={account} setAccount={setAccount} setFilter={setFilter} />
//       <Search setSearchQuery={setSearchQuery} />


//       <div className='cards__section'>
//         <h3>Homes For You</h3>
//         <hr />

//         <div className='cards'>
//           {homes
//             .filter((home) => {
//               const listingType = home.attributes.find(attr => attr.trait_type === "Listing Type")?.value?.toLowerCase();

//               const matchesCategory =
//               filter === 'buy'
//               ? listingType === 'buy'
//               : filter === 'rent'
//               ? listingType === 'rent'
//               : filter === 'sell'
//               ? listingType === 'sell'
//               : true;

//             const matchesSearch =
//             home.address.toLowerCase().includes(searchQuery.toLowerCase());

//              return matchesCategory && matchesSearch;
//             })
//             .map((home, index) => (
//               <div className='card' key={index} onClick={() => togglePop(home)}>
//                 <div className='card__image'>
//                   <img src={home.image} alt="Home" />
//                 </div>
//                 <div className='card__info'>
//                   <h4>{home.attributes[0].value} ETH</h4>
//                   <p>
//                     <strong>{home.attributes[2].value}</strong> bds |
//                     <strong>{home.attributes[3].value}</strong> ba |
//                     <strong>{home.attributes[4].value}</strong> sqft
//                   </p>
//                   <p>{home.address}</p>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       {toggle && (
//         <Home
//           home={home}
//           provider={provider}
//           account={account}
//           escrow={escrow}
//           togglePop={togglePop}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

//--------------------------------------------------------------------------------------------------


// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';

// // Components
// import Navigation from './components/Navigation';
// import Search from './components/Search';
// import Home from './components/Home';

// // ABIs
// import RealEstate from './abis/RealEstate.json'
// import Escrow from './abis/Escrow.json'

// // Config
// import config from './config.json';

// function App() {
//   const [provider, setProvider] = useState(null)
//   const [escrow, setEscrow] = useState(null)

//   const [account, setAccount] = useState(null)

//   const [homes, setHomes] = useState([])
//   const [home, setHome] = useState({})
//   const [toggle, setToggle] = useState(false);

//   const loadBlockchainData = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum)
//     setProvider(provider)
//     const network = await provider.getNetwork()

//     const realEstate = new ethers.Contract(config[network.chainId].realEstate.address, RealEstate, provider)
//     const totalSupply = await realEstate.totalSupply()
//     const homes = []

//     for (var i = 1; i <= totalSupply; i++) {
//       const uri = await realEstate.tokenURI(i)
//       const response = await fetch(uri)
//       const metadata = await response.json()
//       homes.push(metadata)
//     }

//     setHomes(homes)

//     const escrow = new ethers.Contract(config[network.chainId].escrow.address, Escrow, provider)
//     setEscrow(escrow)

//     window.ethereum.on('accountsChanged', async () => {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const account = ethers.utils.getAddress(accounts[0])
//       setAccount(account);
//     })
//   }

//   useEffect(() => {
//     loadBlockchainData()
//   }, [])

//   const togglePop = (home) => {
//     setHome(home)
//     toggle ? setToggle(false) : setToggle(true);
//   }

//   return (
//     <div>
//       <Navigation account={account} setAccount={setAccount} />
//       <Search />

//       <div className='cards__section'>

//         <h3>Homes For You</h3>

//         <hr />

//         <div className='cards'>
//           {homes.map((home, index) => (
//             <div className='card' key={index} onClick={() => togglePop(home)}>
//               <div className='card__image'>
//                 <img src={home.image} alt="Home" />
//               </div>
//               <div className='card__info'>
//                 <h4>{home.attributes[0].value} ETH</h4>
//                 <p>
//                   <strong>{home.attributes[2].value}</strong> bds |
//                   <strong>{home.attributes[3].value}</strong> ba |
//                   <strong>{home.attributes[4].value}</strong> sqft
//                 </p>
//                 <p>{home.address}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>

//       {toggle && (
//         <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop} />
//       )}

//     </div>
//   );
// }

// export default App;
