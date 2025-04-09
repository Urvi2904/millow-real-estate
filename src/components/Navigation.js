/**
 * Navigation - Top navigation bar.
 * Displays different buttons depending on user role (admin or user).
 */

import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Navigation = ({
  account,
  setFilter,
  activeFilter,
  onLogout,
  isAdmin = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation and filter state for user (Buy / Rent)
  const handleNavigation = (category) => {
    setFilter?.(category);
    navigate('/');
  };

  // Handle logout button click
  const handleLogout = () => {
    localStorage.clear();
    onLogout?.();
    navigate('/login', { replace: true });
  };

  // Identify current path for highlighting active nav item
  const isSellPage = location.pathname === '/sell';
  const isMyProps = location.pathname === '/my-properties';
  const isInspections = location.pathname === '/inspections';

  return (
    <nav>
      <ul className="nav__links">
        {!isAdmin && (
          <>
            <li>
              <button
                className={activeFilter === 'buy' ? 'active-filter' : ''}
                onClick={() => handleNavigation('buy')}
              >
                Buy
              </button>
            </li>
            <li>
              <button
                className={activeFilter === 'rent' ? 'active-filter' : ''}
                onClick={() => handleNavigation('rent')}
              >
                Rent
              </button>
            </li>
            <li>
              <button
                className={isMyProps ? 'active-filter' : ''}
                onClick={() => navigate('/my-properties')}
              >
                My Properties
              </button>
            </li>
          </>
        )}
        {isAdmin && (
          <>
            <li>
              <button
                className={isSellPage ? 'active-filter' : ''}
                onClick={() => navigate('/sell')}
              >
                Sell
              </button>
            </li>
            <li>
              <button
                className={isInspections ? 'active-filter' : ''}
                onClick={() => navigate('/inspections')}
              >
                Inspections
              </button>
            </li>
          </>
        )}
      </ul>

      {/* App Logo + Title */}
      <div className="nav__brand">
        <img src={logo} alt="Logo" />
        <h1>Millow</h1>
      </div>

      {/* Wallet Status Block */}
      {account ? (
        <div className="nav__account-controls">
          <div className="nav__wallet">
            <div className="label">Account</div>
            <div className="address">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="nav__wallet">Not Connected</div>
      )}
    </nav>
  );
};

export default Navigation;
