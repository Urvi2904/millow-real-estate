/**
 * Navigation.js
 *
 * Top navigation bar component.
 * Renders different navigation options based on whether the user is an admin or a regular user.
 * Also displays wallet address and allows logout.
 */

import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Navigation = ({
  account, // Wallet address of the logged-in user
  setFilter, // Callback to set property filter ("buy" or "rent")
  activeFilter, // Currently selected filter
  onLogout, // Callback to handle logout action
  isAdmin = false, // Boolean indicating if user is admin
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate and apply property filter
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

  // Detect which admin/user page is currently active (for UI highlighting)
  const isSellPage = location.pathname === '/sell';
  const isMyProps = location.pathname === '/my-properties';
  const isInspections = location.pathname === '/inspections';

  //UI rendering based on role
  return (
    <nav>
      <ul className="nav__links">
        {/* User View: Buy / Rent / My Properties */}
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

        {/* Admin View: Sell / Inspections */}
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

      {/* Wallet Status Block + Logout */}
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
