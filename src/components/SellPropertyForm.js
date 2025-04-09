/**
 * SellPropertyForm - Form for admin to list a new property to sell or rent.
 * Sends data to backend and lists property on blockchain via Escrow smart contract.
 */
import { useState } from 'react';

const SellPropertyForm = ({
  account,
  listingType,
  setListingType,
  onClose,
  reloadHomes,
  resetSelection,
  escrow,
}) => {
  // Local state for form input values
  const [form, setForm] = useState({
    name: '',
    address: '',
    description: '',
    image: null,
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    year: '',
  });

  // Upload loading state
  const [uploading, setUploading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // handleSubmit - Submit form data to backend and blockchain
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //Prepare NFT metadata as attributes
      const attributes = [
        { trait_type: 'Purchase Price', value: parseFloat(form.price) },
        { trait_type: 'Type of Residence', value: 'Custom' },
        { trait_type: 'Bed Rooms', value: parseInt(form.bedrooms) },
        { trait_type: 'Bathrooms', value: parseInt(form.bathrooms) },
        { trait_type: 'Square Feet', value: parseInt(form.sqft) },
        { trait_type: 'Year Built', value: parseInt(form.year) },
        {
          trait_type: 'Listing Type',
          value: listingType.toLowerCase() === 'sell' ? 'buy' : 'rent',
        },
      ];

      //Final payload
      const payload = {
        name: form.name,
        address: form.address,
        description: form.description,
        attributes,
        owner: account,
      };

      // Create FormData object to send image and metadata
      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      formData.append('image', form.image);

      setUploading(true);

      //Send to backend API
      const res = await fetch('http://localhost:5000/api/properties', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      setUploading(false);

      if (!res.ok || !result.tokenId) {
        alert('❌ Property was not fully saved. No token ID returned.');
        console.error('⚠️ Server response:', result);
        return;
      }

      // Register property on blockchain smart contract
      try {
        const tx = await escrow.listProperty(result.tokenId, account, account);
        await tx.wait();
        alert('✅ Property saved to blockchain and backend!');
      } catch (contractError) {
        console.error('❌ Blockchain listing failed:', contractError);
        alert(
          '❌ Property saved to DB, but listing on blockchain failed. Contact admin.',
        );
      }

      //Reset UI state
      if (resetSelection) resetSelection();
      if (reloadHomes) reloadHomes();
      if (onClose) onClose();
    } catch (err) {
      console.error('❌ Submit error:', err);
      alert('❌ Something went wrong during submission.');
      setUploading(false);
    }
  };

  //JSX : Form for admin to list a new property to sell or rent
  return (
    <form className="sell-property-form" onSubmit={handleSubmit}>
      <h2>Submit Your Property ({listingType})</h2>

      <select
        name="listingType"
        value={listingType}
        onChange={(e) => setListingType(e.target.value)}
      >
        <option value="Sell">Sell</option>
        <option value="Rent">Rent</option>
      </select>

      <input
        name="name"
        placeholder="Property Title"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price (ETH)"
        value={form.price}
        onChange={handleChange}
        required
      />
      <input
        name="bedrooms"
        type="number"
        placeholder="Bedrooms"
        value={form.bedrooms}
        onChange={handleChange}
        required
      />
      <input
        name="bathrooms"
        type="number"
        placeholder="Bathrooms"
        value={form.bathrooms}
        onChange={handleChange}
        required
      />
      <input
        name="sqft"
        type="number"
        placeholder="Square Feet"
        value={form.sqft}
        onChange={handleChange}
        required
      />
      <input
        name="year"
        type="number"
        placeholder="Year Built"
        value={form.year}
        onChange={handleChange}
        required
      />
      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        required
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <button type="submit" disabled={uploading} className="submit-btn">
          {uploading ? 'Submitting...' : 'Submit Property'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cancel-btn"
          style={{ backgroundColor: '#777', color: 'white' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SellPropertyForm;
