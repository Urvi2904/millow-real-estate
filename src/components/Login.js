/**
 * Login - Provides a clean role-based login screen.
 * Admin and User are verified via wallet address.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import background from '../assets/houses.png';

// Fixed Admin Wallet Address (used for role checking)
const ADMIN_ADDRESS =
  '0xD1Fc4880a872e6C897ece6dDb8a2A115911D3432'.toLowerCase();

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //handleLogin - Connects wallet and sets role in localStorage
  const handleLogin = async (role) => {
    setLoading(true);
    try {
      //Check MetaMask is available
      if (!window.ethereum) {
        alert('🦊 Please install MetaMask.');
        setLoading(false);
        return;
      }

      // Request wallet access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        alert('❌ No wallet detected.');
        setLoading(false);
        return;
      }

      const wallet = accounts[0].toLowerCase();

      // Role validation
      if (role === 'admin' && wallet !== ADMIN_ADDRESS) {
        alert('❌ This wallet is not authorized as admin.');
        setLoading(false);
        return;
      }

      if (role === 'user' && wallet === ADMIN_ADDRESS) {
        alert('❌ This is the admin wallet. Use a different wallet.');
        setLoading(false);
        return;
      }

      // Save to localStorage and notify
      localStorage.setItem('walletAddress', wallet);
      localStorage.setItem('userRole', role);
      onLogin?.();
      navigate(role === 'admin' ? '/sell' : '/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      alert('⚠️ Failed to connect MetaMask.');
    } finally {
      setLoading(false);
    }
  };

  //JSX : Login Page with Logo, Background & Role Buttons
  return (
    <div className="login-page">
      {/* White Header with Centered Logo */}
      <div className="login-header">
        <div className="nav__brand">
          <img src={logo} alt="Logo" />
          <h1>Millow</h1>
        </div>
      </div>

      {/* Background and Login Card */}
      <div
        className="login-bg"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="login-card">
          <h2> Welcome to the Real Estate DApp 🏠</h2>
          <p>Please choose your role:</p>
          <button className="login-btn" onClick={() => handleLogin('admin')}>
            🛂 Login as Admin
          </button>
          <button className="login-btn" onClick={() => handleLogin('user')}>
            🙋 Login as User
          </button>
          {loading && <p>🔄 Connecting to MetaMask...</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
