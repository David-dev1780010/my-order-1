import React from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', icon: 'main.png', label: 'Главная' },
    { id: 'profile', icon: 'profile.png', label: 'Профиль' },
    { id: 'order', icon: 'order.png', label: 'Заказать' },
    { id: 'history', icon: 'history.png', label: 'История' },
    { id: 'support', icon: 'support.png', label: 'Поддержка' },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2D1E5A',
        padding: '20px 15px',
        borderTopLeftRadius: '25px',
        borderTopRightRadius: '25px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            whileHover={{ scale: 1.1 }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: currentPage === item.id ? '#FFF' : '#9B9B9B',
              opacity: currentPage === item.id ? 1 : 0.7,
              transition: 'all 0.3s ease',
              padding: '8px 16px',
              width: '72px',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              userSelect: 'none',
            }}
          >
            <motion.div
              style={{
                width: '32px',
                height: '32px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={`/images/${item.icon}`}
                alt={item.label}
                style={{
                  width: '28px',
                  height: '28px',
                  filter: currentPage === item.id ? 'brightness(1)' : 'brightness(0.8)',
                }}
              />
            </motion.div>
            <span style={{
              fontSize: '12px',
              fontWeight: currentPage === item.id ? '600' : '400',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation; 