// import { useState } from 'react';
// import { ethers } from 'ethers';

// const SellPropertyForm = ({ account, listingType, setListingType, onClose, reloadHomes, resetSelection }) => {
//   const [form, setForm] = useState({
//     name: '',
//     address: '',
//     description: '',
//     image: null,
//     price: '',
//     bedrooms: '',
//     bathrooms: '',
//     sqft: '',
//     year: ''
//   });

//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

    
//    if (!account) {
//       alert("⚠️ Please connect your wallet to continue.");
//       return;
//     }
//     try {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();

//       // 🦊 MetaMask listing fee
//       const tx = await signer.sendTransaction({
//         to: account, // For now, send back to self
//         value: ethers.utils.parseEther('0.01')
//       });

//       await tx.wait();

//       // Convert "Sell" → "buy", "Rent" → "rent"
//       const listingValue = listingType.toLowerCase() === 'sell' ? 'buy' : 'rent';

//       const attributes = [
//         { trait_type: 'Purchase Price', value: parseFloat(form.price) },
//         { trait_type: 'Type of Residence', value: 'Custom' },
//         { trait_type: 'Bed Rooms', value: parseInt(form.bedrooms) },
//         { trait_type: 'Bathrooms', value: parseInt(form.bathrooms) },
//         { trait_type: 'Square Feet', value: parseInt(form.sqft) },
//         { trait_type: 'Year Built', value: parseInt(form.year) },
//         { trait_type: 'Listing Type', value: listingValue }
//       ];

//       const payload = {
//         name: form.name,
//         address: form.address,
//         description: form.description,
//         attributes,
//         owner: account,
//       };

//       const formData = new FormData();
//       formData.append('data', JSON.stringify(payload));
//       formData.append('image', form.image);

//       setUploading(true);

//       const res = await fetch('http://localhost:5000/api/properties', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await res.json();
//       setUploading(false);

//       if (res.ok) {
//         alert('✅ Property submitted successfully!');
//         if (resetSelection) resetSelection();
//         if (reloadHomes) reloadHomes();  //refreshes house cards from backend
//         if (onClose) onClose();
//       } else {
//         alert('❌ Failed to submit property.');
//         console.error(data);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('❌ Submission failed or cancelled.');
//     }
//   };

//   return (
//     <form className="sell-property-form" onSubmit={handleSubmit}>
//       <h2>Submit Your Property ({listingType})</h2>

//       <label>
//         Listing Type:
//         <select
//           name="listingType"
//           value={listingType}
//           onChange={(e) => setListingType(e.target.value)}
//         >
//           <option value="Sell">Sell</option>
//           <option value="Rent">Rent</option>
//         </select>
//       </label>

//       <input name="name" placeholder="Property Title" value={form.name} onChange={handleChange} required />
//       <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
//       <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
//       <input name="price" type="number" placeholder="Price (ETH)" value={form.price} onChange={handleChange} required />
//       <input name="bedrooms" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} required />
//       <input name="bathrooms" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} required />
//       <input name="sqft" type="number" placeholder="Square Feet" value={form.sqft} onChange={handleChange} required />
//       <input name="year" type="number" placeholder="Year Built" value={form.year} onChange={handleChange} required />
//       <input name="image" type="file" accept="image/*" onChange={handleChange} required />

//       <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
//         <button type="submit" disabled={uploading} className="submit-btn">
//           {uploading ? 'Submitting...' : 'Submit Property'}
//         </button>
//         <button
//           type="button"
//           onClick={onClose}
//           className="cancel-btn"
//           style={{ backgroundColor: '#777', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SellPropertyForm;

//--------------------------------------------------------------------------------
// import { useState } from 'react';
// import { ethers } from 'ethers';
// import EscrowABI from '../abis/Escrow.json';
// import config from '../config.json';

// const SellPropertyForm = ({
//   account,
//   listingType,
//   setListingType,
//   onClose,
//   reloadHomes,
//   resetSelection
// }) => {
//   const [form, setForm] = useState({
//     name: '',
//     address: '',
//     description: '',
//     image: null,
//     price: '',
//     bedrooms: '',
//     bathrooms: '',
//     sqft: '',
//     year: ''
//   });

//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!account) {
//       alert("⚠️ Please connect your wallet to continue.");
//       return;
//     }

//     try {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const { chainId } = await provider.getNetwork();
//       const escrowAddress = config[chainId]?.escrow?.address;

//       if (!escrowAddress) {
//         alert('❌ Escrow contract not found for this network.');
//         return;
//       }

//       // 🔢 Generate a temporary fake NFT ID
//       const nftId = Date.now();

//       // ⛓ Interact with smart contract
//       const escrow = new ethers.Contract(escrowAddress, EscrowABI, signer);
//       const tx = await escrow.depositEarnest(nftId, {
//         value: ethers.utils.parseEther('0.01')
//       });
//       await tx.wait();

//       // 🧾 Build listing data for DB
//       const listingValue = listingType.toLowerCase() === 'sell' ? 'buy' : 'rent';
//       const attributes = [
//         { trait_type: 'Purchase Price', value: parseFloat(form.price) },
//         { trait_type: 'Type of Residence', value: 'Custom' },
//         { trait_type: 'Bed Rooms', value: parseInt(form.bedrooms) },
//         { trait_type: 'Bathrooms', value: parseInt(form.bathrooms) },
//         { trait_type: 'Square Feet', value: parseInt(form.sqft) },
//         { trait_type: 'Year Built', value: parseInt(form.year) },
//         { trait_type: 'Listing Type', value: listingValue }
//       ];

//       const payload = {
//         name: form.name,
//         address: form.address,
//         description: form.description,
//         attributes,
//         owner: account
//       };

//       const formData = new FormData();
//       formData.append('data', JSON.stringify(payload));
//       formData.append('image', form.image);

//       setUploading(true);

//       const res = await fetch('http://localhost:5000/api/properties', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await res.json();
//       setUploading(false);

//       if (res.ok) {
//         alert('✅ Property submitted successfully!');
//         if (resetSelection) resetSelection();
//         if (reloadHomes) reloadHomes();
//         if (onClose) onClose();
//       } else {
//         alert('❌ Failed to submit property.');
//         console.error(data);
//       }
//     } catch (err) {
//       console.error("❌ Full error: ", err);
//       alert('❌ Submission failed or cancelled.');
//     }
//   };

//   return (
//     <form className="sell-property-form" onSubmit={handleSubmit}>
//       <h2>Submit Your Property ({listingType})</h2>

//       <label>
//         Listing Type:
//         <select
//           name="listingType"
//           value={listingType}
//           onChange={(e) => setListingType(e.target.value)}
//         >
//           <option value="Sell">Sell</option>
//           <option value="Rent">Rent</option>
//         </select>
//       </label>

//       <input name="name" placeholder="Property Title" value={form.name} onChange={handleChange} required />
//       <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
//       <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
//       <input name="price" type="number" placeholder="Price (ETH)" value={form.price} onChange={handleChange} required />
//       <input name="bedrooms" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} required />
//       <input name="bathrooms" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} required />
//       <input name="sqft" type="number" placeholder="Square Feet" value={form.sqft} onChange={handleChange} required />
//       <input name="year" type="number" placeholder="Year Built" value={form.year} onChange={handleChange} required />
//       <input name="image" type="file" accept="image/*" onChange={handleChange} required />

//       <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
//         <button type="submit" disabled={uploading} className="submit-btn">
//           {uploading ? 'Submitting...' : 'Submit Property'}
//         </button>
//         <button
//           type="button"
//           onClick={onClose}
//           className="cancel-btn"
//           style={{
//             backgroundColor: '#777',
//             color: 'white',
//             border: 'none',
//             padding: '10px 20px',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SellPropertyForm;



import { useState } from 'react';
import { ethers } from 'ethers';
import EscrowABI from '../abis/Escrow.json';
import config from '../config.json';

const SellPropertyForm = ({ account, listingType, setListingType, onClose, reloadHomes, resetSelection }) => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    description: '',
    image: null,
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    year: ''
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      alert("⚠️ Please connect your wallet to continue.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const { chainId } = await provider.getNetwork();
      const escrowAddress = config[chainId]?.escrow?.address;

      if (!escrowAddress) {
        alert('❌ Escrow contract not found for this network.');
        return;
      }

      // Simulate an NFT ID (could be replaced with real one later)
      const nftId = Date.now();

      // 🟢 Pay listing fee to Escrow smart contract
      const escrow = new ethers.Contract(escrowAddress, EscrowABI, signer);
      const tx = await escrow.depositEarnest(nftId, {
        value: ethers.utils.parseEther('0.01')
      });
      await tx.wait();

      // Convert "Sell" → "buy", "Rent" → "rent"
      const listingValue = listingType.toLowerCase() === 'sell' ? 'buy' : 'rent';

      const attributes = [
        { trait_type: 'Purchase Price', value: parseFloat(form.price) },
        { trait_type: 'Type of Residence', value: 'Custom' },
        { trait_type: 'Bed Rooms', value: parseInt(form.bedrooms) },
        { trait_type: 'Bathrooms', value: parseInt(form.bathrooms) },
        { trait_type: 'Square Feet', value: parseInt(form.sqft) },
        { trait_type: 'Year Built', value: parseInt(form.year) },
        { trait_type: 'Listing Type', value: listingValue }
      ];

      const payload = {
        name: form.name,
        address: form.address,
        description: form.description,
        attributes,
        owner: account,
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      formData.append('image', form.image);

      setUploading(true);
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok) {
        alert('✅ Property submitted successfully!');
        if (resetSelection) resetSelection();
        if (reloadHomes) reloadHomes();
        if (onClose) onClose();
      } else {
        alert('❌ Failed to submit property.');
        console.error(data);
      }

    } catch (err) {
      console.error("❌ Error during property submission:", err);
      alert('❌ Submission failed or transaction was rejected.');
    }
  };

  return (
    <form className="sell-property-form" onSubmit={handleSubmit}>
      <h2>Submit Your Property ({listingType})</h2>

      <label>
        Listing Type:
        <select
          name="listingType"
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
        >
          <option value="Sell">Sell</option>
          <option value="Rent">Rent</option>
        </select>
      </label>

      <input name="name" placeholder="Property Title" value={form.name} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price (ETH)" value={form.price} onChange={handleChange} required />
      <input name="bedrooms" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} required />
      <input name="bathrooms" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} required />
      <input name="sqft" type="number" placeholder="Square Feet" value={form.sqft} onChange={handleChange} required />
      <input name="year" type="number" placeholder="Year Built" value={form.year} onChange={handleChange} required />
      <input name="image" type="file" accept="image/*" onChange={handleChange} required />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <button type="submit" disabled={uploading} className="submit-btn">
          {uploading ? 'Submitting...' : 'Submit Property'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cancel-btn"
          style={{
            backgroundColor: '#777',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SellPropertyForm;
