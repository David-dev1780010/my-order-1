import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#150B2C',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/images/fon.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        opacity: 0.3,
        zIndex: 1,
        transform: 'translateY(-15%) translateX(3%) scale(1.3)',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        gap: '20px',
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#09FBD3',
          filter: 'blur(10px)',
        }} />
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#FE53BB',
          filter: 'blur(10px)',
        }} />
      </div>
    </div>
  );
};

export default App; 