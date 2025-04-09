/**
 * MyProperties - Lists properties the current user has bought.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const MyProperties = ({ account, escrow }) => {
  const [myProperties, setMyProperties] = useState([]);

  // Fetch user's bought properties when account changes
  useEffect(() => {
    fetchProperties();
  }, [account]);

  /**
   * fetchProperties - Loads all properties from backend
   * and filters the ones bought by the current user (via escrow contract)
   */
  const fetchProperties = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/properties');
      const data = await res.json();

      // Check blockchain to see which ones the current user bought
      const bought = await Promise.all(
        data.map(async (home) => {
          const buyer = await escrow.buyer(home.tokenId);
          return buyer.toLowerCase() === account.toLowerCase();
        }),
      );

      const userHomes = data.filter((_, i) => bought[i]);
      setMyProperties(userHomes);
    } catch (err) {
      console.error('❌ Error fetching properties:', err);
    }
  };

  return (
    <div className="cards__section">
      <h3> My Purchased Properties</h3>
      <hr />
      {myProperties.length === 0 ? (
        <p>🧐 You haven&apos;t bought any properties yet.</p>
      ) : (
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
                <h4>{home.attributes?.[0]?.value || '?'} ETH</h4>
                <p>{home.address}</p>
                <PropertyStatus escrow={escrow} home={home} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * PropertyStatus - Determines and displays status of a single property
 * - Waiting for inspection
 * - Waiting for finalization
 * - Sale Complete
 */
const PropertyStatus = ({ escrow, home }) => {
  const [inspected, setInspected] = useState(false);
  const [finalized, setFinalized] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const inspected = await escrow.inspectionPassed(home.tokenId);
      setInspected(inspected);

      const buyer = await escrow.buyer(home.tokenId);
      const isFinal =
        buyer && buyer !== ethers.constants.AddressZero && inspected;
      setFinalized(isFinal);
    } catch (err) {
      console.error('❌ Error fetching status:', err);
    }
  };

  return (
    <p style={{ fontWeight: 'bold', color: '#444' }}>
      {finalized
        ? '✅ Sale Complete'
        : !inspected
          ? '🕐 Waiting for inspection'
          : '⏳ Waiting for finalization'}
    </p>
  );
};

export default MyProperties;
