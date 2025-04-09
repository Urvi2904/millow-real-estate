/**
 * InspectionPanel - Displays properties awaiting admin inspection approval.
 * Filters backend properties to show only those where inspection is not yet passed
 */

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const InspectionPanel = ({ account, escrow }) => {
  const [pendingInspections, setPendingInspections] = useState([]);

  // Load inspections when account or escrow contract is ready
  useEffect(() => {
    if (account && escrow) {
      loadPending();
    }
  }, [account, escrow]);

  // loadPending - Fetch all properties and filter those requiring inspection approval
  const loadPending = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/properties');
      const data = await res.json();

      const relevant = [];

      for (const home of data) {
        if (!home.tokenId) continue;

        const tokenId = ethers.BigNumber.from(home.tokenId);

        try {
          const inspector = await escrow.inspector(tokenId);
          const buyer = await escrow.buyer(tokenId);
          const inspected = await escrow.inspectionPassed(tokenId);

          const hasBuyer = buyer && buyer !== ethers.constants.AddressZero;

          // Show only if current user is inspector, has buyer, and not inspected yet
          if (
            inspector.toLowerCase() === account.toLowerCase() &&
            hasBuyer &&
            !inspected
          ) {
            relevant.push({ ...home, buyer, inspectionPassed: inspected });
          }
        } catch (err) {
          console.warn(`⚠️ Error loading token ${home.tokenId}`, err);
        }
      }

      setPendingInspections(relevant);
    } catch (err) {
      console.error('❌ Error loading inspection list:', err);
    }
  };

  //handleInspection - Admin clicks to pass inspection for a property
  const handleInspection = async (tokenId) => {
    try {
      const signer = await escrow.provider.getSigner();
      const tx = await escrow
        .connect(signer)
        .updateInspectionStatus(tokenId, true);
      await tx.wait();
      alert('✅ Inspection passed!');
      loadPending();
    } catch (err) {
      console.error('❌ Error approving inspection:', err);
      alert('❌ Transaction failed');
    }
  };

  //JSX : Display Pending Inspections list
  return (
    <div className="cards__section">
      <h3>🔍 Pending Inspections</h3>
      <hr />
      {pendingInspections.length === 0 ? (
        <p> No pending inspections</p>
      ) : (
        <div className="cards">
          {pendingInspections.map((home, idx) => (
            <div className="card" key={idx}>
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
                <div style={{ paddingTop: '10px' }}>
                  <button
                    className="pass-inspection-button"
                    onClick={() => handleInspection(home.tokenId)}
                  >
                    Pass Inspection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspectionPanel;
