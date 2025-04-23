/**
 * Sell.js
 *
 * Admin-only view for listing properties for sale or rent.
 * Allows creating new listings, viewing existing ones, and deleting unsold listings.
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

  // Start form display
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

  // Triggered when "Delete" button is clicked
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  //confirmDelete - Sends DELETE request to backend to remove property from database
  // Refreshes property list
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

  //JSX Rendering: Main component structure
  return (
    <div className="cards__section">
      {/* Top section: create new property form */}
      <div className="sell-form-section">
        <h3>Sell or Rent Your Property</h3>
        <hr />

        {/* Button to start the form or show the form itself */}
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
              setShowForm(false); //Hide form
              resetSelection(); //Reset selected property
              loadMyProperties(); //Refresh property list
            }}
            reloadHomes={reloadHomes} //Trigger reload of homes list
            resetSelection={resetSelection}
            escrow={escrow} // Escrow contract for blockchain interaction
            realEstate={realEstate} //NFT contract
          />
        )}
      </div>

      {/* Section title for existing listings */}
      <h3>🏠 My Properties</h3>
      <hr />

      {/* Empty state if admin has no properties listed */}
      {myProperties.length === 0 && !showForm && (
        <p className="no-results">
          🧐 You haven&apos;t listed any properties yet. Click above to get
          started!
        </p>
      )}

      {/* List of property cards (owned by admin) */}
      {myProperties.length > 0 && (
        <div className="cards my-properties">
          {myProperties.map((home, index) => (
            <div className="card" key={index}>
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
                {/* Price, attributes, and address */}
                <h4>{home.attributes?.[0]?.value || '?'} ETH</h4>
                <p>
                  <strong>{home.attributes?.[2]?.value || '?'}</strong> bds |
                  <strong>{home.attributes?.[3]?.value || '?'}</strong> ba |
                  <strong>{home.attributes?.[4]?.value || '?'}</strong> sqft
                </p>

                {/* Address + sale status or delete option */}
                <div className="card__footer">
                  <p>{home.address}</p>
                  {home.inspectionPassed ? (
                    //Sold tag if property is sold
                    <div className="sold-tag">Sold ✅ </div>
                  ) : (
                    // Delete button (only if owner is current admin)
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

      {/* Confirmation modal for deleting a property */}
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
