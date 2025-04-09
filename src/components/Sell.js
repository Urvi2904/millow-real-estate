/**
 * Sell - Admin view to create new property listings and manage previously listed ones.
 * Allows upload, view, and delete of "buy" or "rent" properties.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SellPropertyForm from './SellPropertyForm';
import CustomConfirmModal from './CustomConfirmModal';

const Sell = ({ account, reloadHomes, resetSelection, escrow, realEstate }) => {
  const [showForm, setShowForm] = useState(false); // Show/hide SellPropertyForm
  const [listingType, setListingType] = useState('Sell'); // Default listing mode
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Selected property to delete
  const [myProperties, setMyProperties] = useState([]); // Properties owned by the admin

  const handleStart = () => setShowForm(true);

  /**
   * loadMyProperties - Fetch all properties from backend and filter by account (admin)
   * Then enrich each property with inspection status from blockchain
   */
  const loadMyProperties = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/properties');
      const data = await res.json();

      // Filter only properties listed by admin
      const userProperties = data.filter(
        (property) => property.owner?.toLowerCase() === account?.toLowerCase(),
      );

      // Add inspectionPassed status from blockchain for each property
      const enriched = await Promise.all(
        userProperties.map(async (property) => {
          let inspectionPassed = false;
          try {
            if (property.tokenId) {
              const tokenId = ethers.BigNumber.from(property.tokenId);
              inspectionPassed = await escrow.inspectionPassed(tokenId);
            }
          } catch (err) {
            console.warn(
              `⚠️ Error checking inspection for token ${property.tokenId}`,
              err,
            );
          }
          return { ...property, inspectionPassed };
        }),
      );

      setMyProperties(enriched);
    } catch (err) {
      console.error('Failed to load user properties:', err);
    }
  };

  // Reload property list whenever the account changes
  useEffect(() => {
    if (account) {
      loadMyProperties();
    }
  }, [account]);

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  //confirmDelete - Sends DELETE request to backend to remove property
  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/properties/${confirmDeleteId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account }),
        },
      );

      if (res.ok) {
        alert('✅ Property deleted');
        setConfirmDeleteId(null);
        loadMyProperties(); // Refresh property list
        reloadHomes(); // Refresh app-wide homes list
      } else {
        alert('❌ Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('❌ Something went wrong');
    }
  };

  //JSX: Main component structure
  return (
    <div className="cards__section">
      <div className="sell-form-section">
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
            escrow={escrow}
            realEstate={realEstate}
          />
        )}
      </div>

      <h3>🏠 My Properties</h3>
      <hr />

      {myProperties.length === 0 && !showForm && (
        <p className="no-results">
          🧐 You haven&apos;t listed any properties yet. Click above to get
          started!
        </p>
      )}

      {myProperties.length > 0 && (
        <div className="cards my-properties">
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
                <h4>{home.attributes?.[0]?.value || '?'} ETH</h4>
                <p>
                  <strong>{home.attributes?.[2]?.value || '?'}</strong> bds |
                  <strong>{home.attributes?.[3]?.value || '?'}</strong> ba |
                  <strong>{home.attributes?.[4]?.value || '?'}</strong> sqft
                </p>
                <div className="card__footer">
                  <p>{home.address}</p>
                  {home.inspectionPassed ? (
                    <div className="sold-tag">Sold ✅ </div>
                  ) : (
                    home.owner?.toLowerCase() === account?.toLowerCase() && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteClick(home._id)}
                      >
                        Delete
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDeleteId && (
        <CustomConfirmModal
          message="Are you sure you want to delete this property listing?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
};

export default Sell;
