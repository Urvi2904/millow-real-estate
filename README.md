
Millow Real Estate - Blockchain-Powered Property Platform

Millow is a decentralized real estate marketplace built with **Ethereum smart contracts**, **React**, and **MongoDB**. It enables admins to list properties for sale or rent and allows users to explore, visit, contact, and even purchase properties securely via blockchain.


## Features
🧑‍💼 Admin
- Add new properties with images and metadata
- List properties for **Sale** or **Rent**
- Automatically mint property as NFT on the   blockchain
- Approve inspections and finalize transactions

👥 User
- Browse listed properties (Sale / Rent)
- Search & filter by type and address
- Contact agent or schedule property visit
- Buy property through blockchain with escrow logic
- View owned properties
## Tech Stack

**Frontend:** React, React Router, Ethers.js, HTML5, CSS3, JavaScript(ES6+)

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Multer 

**Blockchain Smart Contracts:** Solidity, Truffle, Ganache

**Web3 Tools:** MetaMask, Ethers.js

**Dev Tools:** Prettier, ESLint, Nodemon, VS Code

## Project Structure
Millow-real-estate/
│
├── backend/                     # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   ├── models/
│   │   └── Property.js          # Property schema
│   ├── routes/
│   │   └── properties.js        # REST API routes
│   ├── uploads/                 # Uploaded images
│   ├── .env                     # Environment variables
│   └── server.js                # Backend entry point
│
├── build/                       # Frontend production build (after `npm run build`)
│
├── contracts/                   # Solidity Smart Contracts
│   ├── Escrow.sol
│   └── RealEstate.sol
│
├── migrations/                  # Truffle migration scripts
│   ├── 1_deploy_real_estate.js
│   └── 2_deploy_escrow.js
│
├── public/                      # Public assets for frontend
│
├── src/                         # Frontend (React)
│   ├── abis/                    # Contract ABIs from Truffle
│   │   ├── Escrow.json
│   │   └── RealEstate.json
│   ├── assets/                  # Static assets (images, logos, etc.)
│   ├── components/              # UI Components and pages
│   │   ├── ContactAgentForm.js
│   │   ├── CustomConfirmModal.js
│   │   ├── Home.js
│   │   ├── InspectionPanel.js
│   │   ├── Login.js
│   │   ├── myProperties.js
│   │   ├── Navigation.js
│   │   ├── Search.js
│   │   ├── Sell.js
│   │   └── SellPropertyForm.js
│   ├── services/
│   │   └── contracts.js         # Loads smart contracts using ethers.js
│   ├── App.js                   # Main React component
│   ├── config.json              # Deployed contract addresses
│   ├── index.css                # Global styles
│   ├── index.js                 # React entry point
│   ├── logo.svg                 # App logo
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── .eslintrc.json
├── .eslintignore
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── package-lock.json
├── truffle-config.js           # Truffle network & compiler settings
└── README.md                   # Project documentation

## Dependencies

🧱 Core Technologies
-React v19.0.0 – Frontend UI library
-Express v4.21.2 – Backend web server
-MongoDB + Mongoose v8.13.1 – NoSQL database & ORM
-Solidity v0.8.16 – Smart contract language
-Truffle v5.11.5 – Smart contract development framework
-Ethers.js v5.8.0 – Ethereum wallet & contract interaction 

🧰 Development & Utilities
-dotenv v16.4.7 – Environment variable management
-nodemon v3.1.9 – Auto-restart server on changes
-multer v1.4.5-lts.2 – File upload handling (images)
-cors v2.8.5 – Cross-origin resource sharing
-lite-server v2.6.1 – Lightweight dev server for simple apps

🎨 Code Quality & Styling
-Prettier v3.5.3 – Code formatter
-ESLint v8.57.1 – JavaScript linter
-eslint-plugin-react v7.37.5
-eslint-plugin-jsx-a11y v6.10.2
-eslint-plugin-react-hooks v5.2.0

🧭 Routing & Navigation
-react-router-dom v7.5.0 – SPA routing for React

📊 Analytics & Optimization
-web-vitals v4.2.4 – Real user performance metrics

📦 Smart Contract 
-@openzeppelin/contracts v4.9.3 – Solidity libraries
-@truffle/hdwallet-provider v2.1.15 – Wallet provider for Truffle deployments

🌐 Global Tools
-json-server v1.0.0-beta.3 – Mock REST API (optional)
-Truffle v5.7.9 – (Global install; may differ from local)


## Getting Started

1. Clone the repo

2. Install Dependencies
#Backend
cd backend
npm install

#Frontend
npm install

3. Run MongoDB locally
Make sure MongoDB is running on mongodb://localhost:27017.

4. Start the Backend
cd backend
node server.js

5. Compile and Deploy Smart Contracts
truffle compile
truffle migrate

6. Start the Frontend
npm start

## 🔐Smart Contract Setup Notes
After running truffle migrate, copy the Escrow contract address and set it as the admin wallet in Login.js:
const ADMIN_ADDRESS = '0x...'.toLowerCase();

Copy these ABI files from build to frontend:
After migration
cp build/contracts/Escrow.json src/abis/
cp build/contracts/RealEstate.json src/abis/
-Roles & Authentication
Admin: Must connect using the address that deployed the Escrow contract.
User: Any other wallet address can interact as a buyer.

