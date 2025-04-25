import React from 'react';
import fon from './assets/images/fon.png';

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
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${fon})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
        zIndex: 1,
      }} />
      <div style={{
        position: 'relative',
        zIndex: 2,
      }}>
        mini app
      </div>
    </div>
  );
};

export default App; 