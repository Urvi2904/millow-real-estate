/**
 * Home
 *
 * Modal popup displaying all the property information.
 * Supports buying, approving, inspection, and finalizing based on user role.
 * Also includes buttons to contact the agent or schedule a visit.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import close from '../assets/close.svg';
import ContactAgentForm from './ContactAgentForm';
import CustomConfirmModal from './CustomConfirmModal';

const Home = ({ home, provider, account, escrow, togglePop }) => {
  // Blockchain transaction states
  const [hasBought, setHasBought] = useState(false);
  const [hasInspected, setHasInspected] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);
  const [hasFinalized, setHasFinalized] = useState(false);
  const [owner, setOwner] = useState(null);

  //Information from escrow contract
  const [inspector, setInspector] = useState(null);
  const [buyer, setBuyer] = useState(null);

  //UI controls
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(null);
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);

  // Determine user role and listing type
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';
  const isBuy =
    home.attributes
      ?.find((attr) => attr.trait_type === 'Listing Type')
      ?.value?.toLowerCase() === 'buy';

  // Load property transaction status from blockchain
  useEffect(() => {
    fetchStatus();
  }, [hasBought, hasInspected, hasApproved, hasFinalized]);

  //fetchStatus - Loads buyer, inspection, approval, and finalization states from the blockchain
  const fetchStatus = async () => {
    // Exit early if required data isn't ready
    if (!escrow || !home || !home.tokenId) return;

    try {
      const tokenId = home.tokenId.toString();

      // Fetch buyer address from escrow contract
      const buyer = await escrow.buyer(tokenId);
      setBuyer(buyer);

      //Check if sale is approved
      const approved = await escrow.approval(tokenId, buyer);
      setHasApproved(approved);

      //Check if inspection is passed
      const inspected = await escrow.inspectionPassed(tokenId);
      setHasInspected(inspected);

      //Fetch assigned inspector address
      const inspector = await escrow.inspector(tokenId);
      setInspector(inspector);

      //update state based on buyer address
      setHasBought(buyer !== ethers.constants.AddressZero);

      //Fetch current owner address
      const currentOwner = await escrow.owner(tokenId);
      if (currentOwner && currentOwner !== ethers.constants.AddressZero) {
        setOwner(currentOwner);
      }

      //Check if sale is finalized
      const finalized = await escrow.saleFinalized(tokenId);
      setHasFinalized(finalized || false);
    } catch (err) {
      console.warn('❌ Error fetching status:', err);
    }
  };

  // buyHandler - Triggered when a user clicks "Buy"
  // Sends the earnest deposit to the escrow contract
  const buyHandler = async () => {
    try {
      const tokenId = ethers.BigNumber.from(home.tokenId);
      const signer = provider.getSigner();

      //Find purchase price from NFT (home) attributes
      const priceAttr = home.attributes?.find(
        (attr) => attr.trait_type?.toLowerCase() === 'purchase price',
      );

      const rawPrice = priceAttr?.value;
      if (!rawPrice) return alert('❌ Missing price!');

      // Convert pricce to Ether
      const price = ethers.utils.parseEther(rawPrice.toString());

      //Send deposit transaction to escrow contract
      const tx = await escrow.connect(signer).depositEarnest(tokenId, {
        value: price,
      });

      await tx.wait(); //wait for confirmation
      setHasBought(true); //update local UI state
    } catch (err) {
      console.error('❌ Error in buyHandler:', err);
    }
  };

  // inspectionHandler - Called by Admin to pass the inspection for this property
  // Updates the inspection status on-chain to 'true' via the escrow contract
  const inspectionHandler = async () => {
    try {
      //get tokenId
      const tokenId = ethers.BigNumber.from(home.tokenId);

      //get connected wallet signer
      const signer = provider.getSigner();

      //Call the escrow contract to update inspection status
      const tx = await escrow
        .connect(signer)
        .updateInspectionStatus(tokenId, true);
      await tx.wait(); //wait for confirmation
      setHasInspected(true); //Update UI state
    } catch (err) {
      console.error('❌ Error in inspectionHandler:', err);
    }
  };

  // approveHandler - Called to approve the property sale
  // Sends approval on-chain so the finalization can proceed
  const approveHandler = async () => {
    try {
      const tokenId = ethers.BigNumber.from(home.tokenId);
      const signer = provider.getSigner();

      //Approve sale on Escrow contract
      const tx = await escrow.connect(signer).approveSale(tokenId);
      await tx.wait();
      setHasApproved(true); //Update UI state
    } catch (err) {
      console.error('❌ Error in approveHandler:', err);
    }
  };

  // finalizeHandler - Called by Admin to finalize the sale once all steps are complete
  // Final step that transfers ownership and completes the transaction
  const finalizeHandler = async () => {
    try {
      const tokenId = ethers.BigNumber.from(home.tokenId);
      const signer = provider.getSigner();

      //Finaloze sale and transfer property ownership
      const tx = await escrow.connect(signer).finalizeSale(tokenId);
      await tx.wait();

      setHasFinalized(true); //Update UI state
    } catch (err) {
      console.error('❌ Error in finalizeHandler:', err);
    }
  };

  //JSX rendering - Displays property details and available actions based on state and user role
  return (
    <div className="home">
      <div className="home__details">
        {/* Property image */}
        <div className="home__image">
          <img
            src={
              home.image?.startsWith('http')
                ? home.image
                : `http://localhost:5000${home.image}`
            }
            alt="Home"
          />
        </div>

        {/* Property details and action buttons */}
        <div className="home__overview">
          {/* Property title and conditional buy button for users */}
          <div className="home__header">
            <h1>{home.name}</h1>
            {!isAdmin && isBuy && !hasBought && (
              <button
                className="home__buy inline-buy"
                onClick={() => setShowBuyConfirm(true)}
              >
                Buy
              </button>
            )}
          </div>

          {/* Property attributes */}
          <p>
            <strong>{home.attributes?.[2]?.value || '?'}</strong> bds |
            <strong>{home.attributes?.[3]?.value || '?'}</strong> ba |
            <strong>{home.attributes?.[4]?.value || '?'}</strong> sqft
          </p>

          {/* Address */}
          <p>{home.address}</p>

          {/* Price */}
          {(() => {
            const priceAttr = home.attributes?.find((attr) =>
              attr.trait_type?.toLowerCase().includes('price'),
            );
            return <h2>{priceAttr?.value || '?'} ETH</h2>;
          })()}

          {/* Ownsership status and action buttons */}
          {hasBought && hasInspected && hasApproved && hasFinalized ? (
            /* Ownsership confirmed */
            <div className="home__owned">
              Owned by {owner?.slice(0, 6)}...{owner?.slice(-4)}
            </div>
          ) : (
            <>
              {/* Admin options: Inspection + Fianlize */}
              {isBuy && account && isAdmin && (
                <>
                  <button
                    className="home__buy"
                    onClick={inspectionHandler}
                    disabled={hasInspected}
                  >
                    Approve Inspection
                  </button>
                  <button
                    className="home__buy"
                    onClick={finalizeHandler}
                    disabled={
                      !hasBought ||
                      !hasInspected ||
                      !hasApproved ||
                      hasFinalized
                    }
                  >
                    Finalize Sale
                  </button>
                </>
              )}

              {/* Buyer flow */}
              {!isAdmin && isBuy && hasBought && (
                <>
                  {!hasInspected ? (
                    <p>⏳ Waiting for admin to pass inspection</p>
                  ) : !hasApproved ? (
                    <button className="home__buy" onClick={approveHandler}>
                      ✅ Confirm Sale
                    </button>
                  ) : (
                    <p>⏳ Waiting for admin to finalize</p>
                  )}
                </>
              )}

              {/* Contact agent or schedule visit */}
              <div className="home__button-group">
                <button
                  className="home__buy"
                  onClick={() => {
                    setFormType('visit');
                    setShowForm(true);
                  }}
                >
                  🗓️ Schedule Visit
                </button>
                <button
                  className="home__buy"
                  onClick={() => {
                    setFormType('contact');
                    setShowForm(true);
                  }}
                >
                  📩 Contact Agent
                </button>
              </div>
            </>
          )}

          {/* Description */}
          <hr />
          <h2>Overview</h2>
          <p>{home.description}</p>

          {/* Property features */}
          <hr />
          <h2>Facts and features</h2>
          <ul>
            {(home.attributes || []).map((attr, idx) => (
              <li key={idx}>
                <strong>{attr.trait_type}</strong>: {attr.value}
              </li>
            ))}
          </ul>
        </div>

        {/* Close modal */}
        <button onClick={() => togglePop(null)} className="home__close">
          <img src={close} alt="Close" />
        </button>

        {/* Contact agent form */}
        {showForm && (
          <ContactAgentForm
            onClose={() => setShowForm(false)}
            title={
              formType === 'visit' ? 'Schedule a Visit' : 'Contact an Agent'
            }
          />
        )}

        {/* Confirmation modal for buying */}
        {showBuyConfirm && (
          <CustomConfirmModal
            message="Are you sure you want to buy this property?"
            onConfirm={() => {
              buyHandler();
              setShowBuyConfirm(false);
            }}
            onCancel={() => setShowBuyConfirm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
