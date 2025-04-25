import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav style={{
      backgroundColor: '#2D1E5A',
      padding: '15px',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      <NavLink to="/" style={({ isActive }) => ({
        color: isActive ? '#FE53BB' : 'white',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.3s ease',
      })}>
        <img src="/images/Vector.png" alt="Home" style={{ width: '24px', height: '24px' }} />
        <span>Главная</span>
      </NavLink>
      
      <NavLink to="/profile" style={({ isActive }) => ({
        color: isActive ? '#FE53BB' : 'white',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.3s ease',
      })}>
        <img src="/images/Vector-1.png" alt="Profile" style={{ width: '24px', height: '24px' }} />
        <span>Профиль</span>
      </NavLink>
      
      <NavLink to="/order" style={({ isActive }) => ({
        color: isActive ? '#FE53BB' : 'white',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.3s ease',
      })}>
        <img src="/images/Vector-2.png" alt="Order" style={{ width: '24px', height: '24px' }} />
        <span>Заказать</span>
      </NavLink>
      
      <NavLink to="/history" style={({ isActive }) => ({
        color: isActive ? '#FE53BB' : 'white',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.3s ease',
      })}>
        <img src="/images/Vector-3.png" alt="History" style={{ width: '24px', height: '24px' }} />
        <span>История</span>
      </NavLink>
      
      <NavLink to="/support" style={({ isActive }) => ({
        color: isActive ? '#FE53BB' : 'white',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.3s ease',
      })}>
        <img src="/images/tarelka.png" alt="Support" style={{ width: '24px', height: '24px' }} />
        <span>Поддержка</span>
      </NavLink>
    </nav>
  );
};

export default Navigation; 