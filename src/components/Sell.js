// // Sell.js
// import React, { useState } from 'react';
// import SellPropertyForm from '../components/SellPropertyForm';

// const Sell = ({ account }) => {
//   const [showForm, setShowForm] = useState(false);

//   return (
//     <div className="sell__section">
//       <h2 style={{ textAlign: 'center', margin: '2rem 0' }}>Sell or Rent Your Property</h2>
      
//       <div style={{ textAlign: 'center' }}>
//         {account ? (
//           <button className="home__buy" onClick={() => setShowForm(true)}>
//             🏠 Rent or Sell Property
//           </button>
//         ) : (
//           <p style={{ fontWeight: 'bold' }}>⚠️ Please connect your wallet to proceed.</p>
//         )}
//       </div>

//       {showForm && (
//         <SellPropertyForm
//           account={account}
//           onClose={() => setShowForm(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sell;


// import React, { useState } from 'react';
// import SellPropertyForm from '../components/SellPropertyForm';

// const Sell = ({ account }) => {
//   const [selectedOption, setSelectedOption] = useState('');

//   const handleOptionChange = (e) => {
//     setSelectedOption(e.target.value);
//   };

//   return (
//     <div className="sell-page" style={{ padding: '2rem' }}>
//       <h2>🏠 List Your Property</h2>
//       <p>Would you like to sell or rent your property?</p>

//       <div style={{ marginBottom: '1rem' }}>
//         <label style={{ marginRight: '1rem' }}>
//           <input
//             type="radio"
//             name="listingType"
//             value="Sell"
//             onChange={handleOptionChange}
//             checked={selectedOption === 'Sell'}
//           /> Sell
//         </label>
//         <label>
//           <input
//             type="radio"
//             name="listingType"
//             value="Rent"
//             onChange={handleOptionChange}
//             checked={selectedOption === 'Rent'}
//           /> Rent
//         </label>
//       </div>

//       {selectedOption && (
//         <SellPropertyForm account={account} listingType={selectedOption} />
//       )}
//     </div>
//   );
// };

// export default Sell;


// src/components/Sell.js


//-------------------------------------------------------------- 2 april ---------------
// import React, { useState } from 'react';
// import SellPropertyForm from './SellPropertyForm';

// const Sell = ({ account, reloadHomes  }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [listingType, setListingType] = useState('Sell');

//   const handleStart = () => setShowForm(true);

//   return (
//     <div className="cards__section">
//       <h3>Sell or Rent Your Property</h3>
//       <hr />
//       {!showForm ? (
//         <button className="home__buy" onClick={handleStart}>
//           🏠 Sell or Rent Your Property
//         </button>
//       ) : (
//         // <SellPropertyForm
//         //   account={account}
//         //   listingType={listingType}
//         //   setListingType={setListingType}
//         //   onClose={() => setShowForm(false)}
//         // />
//         <SellPropertyForm
//             account={account}
//             listingType={listingType}
//             setListingType={setListingType} // ✅ This line fixes it!
//             onClose={() => setShowForm(false)}
//             reloadHomes={reloadHomes}
//             resetSelection={resetSelection}
//         />
//       )}
//     </div>
//   );
// };

// export default Sell;

//------------------------------------------------- 2 april , 18:23----------------------
// import React, { useState, useEffect } from 'react';
// import SellPropertyForm from './SellPropertyForm';
// import CustomConfirmModal from './CustomConfirmModal';


// const Sell = ({ account, reloadHomes, resetSelection }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [listingType, setListingType] = useState('Sell');
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);
//   const [myProperties, setMyProperties] = useState([]);


//   const handleStart = () => setShowForm(true);

//   // 🧠 Load only user's properties
//   const loadMyProperties = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/properties');
//       const data = await res.json();
//       const userProperties = data.filter(
//         (property) => property.owner?.toLowerCase() === account?.toLowerCase()
//       );
//       setMyProperties(userProperties);
//     } catch (err) {
//       console.error('Failed to load user properties:', err);
//     }
//   };


// // const handleDelete = async (id) => {
// //     const confirmed = window.confirm("Are you sure you want to delete this listing?");
// //     if (!confirmed) return;
  
// //     try {
// //       await fetch(`http://localhost:5000/api/properties/${id}`, {
// //         method: 'DELETE',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ account }) // ✅ send current wallet address
// //       });
  
// //       alert("✅ Property deleted!");
// //       loadMyProperties();
// //       reloadHomes();
// //     } catch (err) {
// //       alert("❌ Failed to delete property.");
// //       console.error(err);
// //     }
// //   };
  

// const handleDeleteClick = (id) => {
//   setConfirmDeleteId(id);
// };

// const confirmDelete = async () => {
//   try {
//     const res = await fetch(`http://localhost:5000/api/properties/${confirmDeleteId}`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ account })  // to validate owner
//     });

//     if (res.ok) {
//       alert('✅ Property deleted');
//       setConfirmDeleteId(null);
//       reloadHomes();
//     } else {
//       alert('❌ Failed to delete');
//     }
//   } catch (err) {
//     console.error('Error deleting property:', err);
//     alert('❌ Something went wrong');
//   }
// };

//   useEffect(() => {
//     if (account) {
//       loadMyProperties();
//     }
//   }, [account]);

//   return (
//     <div className="cards__section">
//       <h3>Sell or Rent Your Property</h3>
//       <hr />
//       {!showForm ? (
//         <button className="home__buy" onClick={handleStart}>
//           🏠 Sell or Rent Your Property
//         </button>
//       ) : (
//         <SellPropertyForm
//           account={account}
//           listingType={listingType}
//           setListingType={setListingType}
//           onClose={() => {
//             setShowForm(false);
//             resetSelection();
//             loadMyProperties();
//           }}
//           reloadHomes={reloadHomes}
//           resetSelection={resetSelection}
//         />
//       )}

//       {/* ✅ My Properties Section */}
//       {myProperties.length > 0 && (
//         <div style={{ marginTop: '40px' }}>
//           <h3>My Properties</h3>
//           <hr />
//           <div className="cards">
//             {myProperties.map((home, index) => (
//               <div className="card" key={index}>
//                 <div className="card__image">
//                   <img
//                     src={
//                       home.image?.startsWith('http')
//                         ? home.image
//                         : `http://localhost:5000${home.image}`
//                     }
//                     alt="Home"
//                   />
//                 </div>
//                 <div className="card__info">
//                   <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
//                   <p>
//                     <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
//                     <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
//                     <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
//                   </p>
//                   <p>{home.address}</p>
//                   <button
//                     className="delete-button"
//                     onClick={() => handleDelete(home._id)}
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sell;


import React, { useState, useEffect } from 'react';
import SellPropertyForm from './SellPropertyForm';
import CustomConfirmModal from './CustomConfirmModal';

const Sell = ({ account, reloadHomes, resetSelection }) => {
  const [showForm, setShowForm] = useState(false);
  const [listingType, setListingType] = useState('Sell');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [myProperties, setMyProperties] = useState([]);

  const handleStart = () => setShowForm(true);

  const loadMyProperties = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/properties');
      const data = await res.json();
      const userProperties = data.filter(
        (property) => property.owner?.toLowerCase() === account?.toLowerCase()
      );
      setMyProperties(userProperties);
    } catch (err) {
      console.error('Failed to load user properties:', err);
    }
  };

  useEffect(() => {
    if (account) {
      loadMyProperties();
    }
  }, [account]);

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }) // validate owner
      });

      if (res.ok) {
        alert('✅ Property deleted');
        setConfirmDeleteId(null);
        loadMyProperties();
        reloadHomes();
      } else {
        alert('❌ Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('❌ Something went wrong');
    }
  };

  return (
    <div className="cards__section">
      <h3>Sell or Rent Your Property</h3>
      <hr />
      {!showForm ? (
        <button className="home__buy" onClick={handleStart}>
          🏠 Sell or Rent Your Property
        </button>
      ) : (
        <SellPropertyForm
          account={account}
          listingType={listingType}
          setListingType={setListingType}
          onClose={() => {
            setShowForm(false);
            resetSelection();
            loadMyProperties();
          }}
          reloadHomes={reloadHomes}
          resetSelection={resetSelection}
        />
      )}

      {/* ✅ My Properties Section */}
      {myProperties.length > 0 && (
        <>
          <h3 style={{ marginTop: '40px' }}>My Properties</h3>
          <hr />
          <div className="cards">
            {myProperties.map((home, index) => (
              <div className="card" key={index}>
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
                <div className="card__info">
                  <h4>{home.attributes?.[0]?.value || "?"} ETH</h4>
                  <p>
                    <strong>{home.attributes?.[2]?.value || "?"}</strong> bds |
                    <strong>{home.attributes?.[3]?.value || "?"}</strong> ba |
                    <strong>{home.attributes?.[4]?.value || "?"}</strong> sqft
                  </p>
                  <p>{home.address}</p>

                  {/* 🗑️ Only show if user is owner */}
                  {home.owner?.toLowerCase() === account?.toLowerCase() && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(home._id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 💬 Confirmation Modal */}
      {confirmDeleteId && (
        <CustomConfirmModal
          message="Are you sure you want to delete this porperty listing?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
};

export default Sell;
