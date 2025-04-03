import { ethers } from 'ethers';
import logo from '../assets/logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = ({ account, connectWallet, setFilter, activeFilter }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (category) => {
    if (category === 'sell') {
      navigate('/sell');
    } else {
      setFilter(category);
      navigate('/');
    }
  };

  const isSellPage = location.pathname === '/sell';

  return (
    <nav>
      <ul className='nav__links'>
        <li>
          <button
            className={activeFilter === 'buy' && !isSellPage ? 'active-filter' : ''}
            onClick={() => handleNavigation('buy')}
          >
            Buy
          </button>
        </li>
        <li>
          <button
            className={activeFilter === 'rent' && !isSellPage ? 'active-filter' : ''}
            onClick={() => handleNavigation('rent')}
          >
            Rent
          </button>
        </li>
        <li>
          <button
            className={isSellPage ? 'active-filter' : ''}
            onClick={() => handleNavigation('sell')}
          >
            Sell
          </button>
        </li>
      </ul>

      <div className='nav__brand'>
        <img src={logo} alt="Logo" />
        <h1>Millow</h1>
      </div>

      {account ? (
        <button className='nav__connect'>
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button className='nav__connect' onClick={connectWallet}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;




// import { ethers } from 'ethers';
// import logo from '../assets/logo.svg';

// const Navigation = ({ account, connectWallet, setFilter, activeFilter }) => {

//   const handleNavigation = (category) => {
//     setFilter(category);
//   };

//   return (
//     <nav>
//       <ul className='nav__links'>
//         <li>
//           <button
//             className={activeFilter === 'buy' ? 'active-filter' : ''}
//             onClick={() => handleNavigation('buy')}
//           >
//             Buy
//           </button>
//         </li>
//         <li>
//           <button
//             className={activeFilter === 'rent' ? 'active-filter' : ''}
//             onClick={() => handleNavigation('rent')}
//           >
//             Rent
//           </button>
//         </li>
//         <li>
//           <button
//             className={activeFilter === 'sell' ? 'active-filter' : ''}
//             onClick={() => handleNavigation('sell')}
//           >
//             Sell
//           </button>
//         </li>
//       </ul>

//       <div className='nav__brand'>
//         <img src={logo} alt="Logo" />
//         <h1>Millow</h1>
//       </div>

//       {account ? (
//         <button className='nav__connect'>
//           {account.slice(0, 6) + '...' + account.slice(38, 42)}
//         </button>
//       ) : (
//         <button className='nav__connect' onClick={connectWallet}>
//           Connect
//         </button>
//       )}
//     </nav>
//   );
// };

// export default Navigation;




//-----------------------------------------
// import { ethers } from 'ethers';
// import logo from '../assets/logo.svg';

// const Navigation = ({ account, setAccount, setFilter, activeFilter }) => {
//   const handleNavigation = (category) => {
//     setFilter(category);
//   };

//   const connectHandler = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const account = ethers.utils.getAddress(accounts[0]);
//     setAccount(account);
//   };

//   return (
//     <nav>
//       <ul className='nav__links'>
//         <li>
//           <button
//             className={activeFilter === 'buy' ? 'active-filter' : ''}
//             onClick={() => handleNavigation('buy')}
//           >
//             Buy
//           </button>
//         </li>
//         <li>
//           <button
//             className={activeFilter === 'rent' ? 'active-filter' : ''}
//             onClick={() => handleNavigation('rent')}
//           >
//             Rent
//           </button>
//         </li>
//         <li>
//           <button
//             className={activeFilter === 'sell' ? 'active-filter' : ''}
//             onClick={() => handleNavigation('sell')}
//           >
//             Sell
//           </button>
//         </li>
//       </ul>

//       <div className='nav__brand'>
//         <img src={logo} alt="Logo" />
//         <h1>Millow</h1>
//       </div>

//       {account ? (
//         <button className='nav__connect'>
//           {account.slice(0, 6) + '...' + account.slice(38, 42)}
//         </button>
//       ) : (
//         <button className='nav__connect' onClick={connectHandler}>
//           Connect
//         </button>
//       )}
//     </nav>
//   );
// };

// export default Navigation;


