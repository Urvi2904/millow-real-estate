/**
 * Home - Modal popup displaying detailed property information.
 * Provides interaction buttons (Buy, Approve, Finalize) based on user role and transaction status.
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

  //Information  from escrow contract
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
    if (!escrow || !home || !home.tokenId) return;

    try {
      const tokenId = home.tokenId.toString();
      const buyer = await escrow.buyer(tokenId);
      setBuyer(buyer);

      const approved = await escrow.approval(tokenId, buyer);
      setHasApproved(approved);

      const inspected = await escrow.inspectionPassed(tokenId);
      setHasInspected(inspected);

      const inspector = await escrow.inspector(tokenId);
      setInspector(inspector);

      setHasBought(buyer !== ethers.constants.AddressZero);

      const currentOwner = await escrow.owner(tokenId);
      if (currentOwner && currentOwner !== ethers.constants.AddressZero) {
        setOwner(currentOwner);
      }

      const finalized = await escrow.saleFinalized(tokenId);
      setHasFinalized(finalized || false);
    } catch (err) {
      console.warn('❌ Error fetching status:', err);
    }
  };

  //buyHandler - Called when a user buys the property (sends earnest deposit)
  const buyHandler = async () => {
    try {
      const tokenId = ethers.BigNumber.from(home.tokenId);
      const signer = provider.getSigner();

      const priceAttr = home.attributes?.find(
        (attr) => attr.trait_type?.toLowerCase() === 'purchase price',
      );

      const rawPrice = priceAttr?.value;
      if (!rawPrice) return alert('❌ Missing price!');

      const price = ethers.utils.parseEther(rawPrice.toString());

      const tx = await escrow.connect(signer).depositEarnest(tokenId, {
        value: price,
      });

      await tx.wait();
      setHasBought(true);
    } catch (err) {
      console.error('❌ Error in buyHandler:', err);
    }
  };

  //inspectionHandler - Admin approves inspection for the property and finalize sale
  const inspectionHandler = async () => {
    try {
      const tokenId = ethers.BigNumber.from(home.tokenId);
      const signer = provider.getSigner();
      const tx = await escrow
        .connect(signer)
        .updateInspectionStatus(tokenId, true);
      await tx.wait();
      setHasInspected(true);
    } catch (err) {
      console.error('❌ Error in inspectionHandler:', err);
    }
  };

  //Approve sale
  const approveHandler = async () => {
    try {
      const tokenId = ethers.BigNumber.from(home.tokenId);
      const signer = provider.getSigner();
      const tx = await escrow.connect(signer).approveSale(tokenId);
      await tx.wait();
      setHasApproved(true);
    } catch (err) {
      console.error('❌ Error in approveHandler:', err);
    }
  };

  // Finalize sale
  const finalizeHandler = async () => {
    try {
      const tokenId = ethers.BigNumber.from(home.tokenId);
      const signer = provider.getSigner();
      const tx = await escrow.connect(signer).finalizeSale(tokenId);
      await tx.wait();
      setHasFinalized(true);
    } catch (err) {
      console.error('❌ Error in finalizeHandler:', err);
    }
  };

  //JSX rendering
  return (
    <div className="home">
      <div className="home__details">
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

        <div className="home__overview">
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

          <p>
            <strong>{home.attributes?.[2]?.value || '?'}</strong> bds |
            <strong>{home.attributes?.[3]?.value || '?'}</strong> ba |
            <strong>{home.attributes?.[4]?.value || '?'}</strong> sqft
          </p>
          <p>{home.address}</p>
          {(() => {
            const priceAttr = home.attributes?.find((attr) =>
              attr.trait_type?.toLowerCase().includes('price'),
            );
            return <h2>{priceAttr?.value || '?'} ETH</h2>;
          })()}

          {hasBought && hasInspected && hasApproved && hasFinalized ? (
            <div className="home__owned">
              Owned by {owner?.slice(0, 6)}...{owner?.slice(-4)}
            </div>
          ) : (
            <>
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

          <hr />
          <h2>Overview</h2>
          <p>{home.description}</p>

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

        <button onClick={() => togglePop(null)} className="home__close">
          <img src={close} alt="Close" />
        </button>

        {showForm && (
          <ContactAgentForm
            onClose={() => setShowForm(false)}
            title={
              formType === 'visit' ? 'Schedule a Visit' : 'Contact an Agent'
            }
          />
        )}

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
