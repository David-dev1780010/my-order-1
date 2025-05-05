import React from 'react';

const ButtonWithDots: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 12 }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginRight: 8 }} />
    <button
      style={{
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: '#B6116B',
        color: 'white',
        border: 'none',
        fontSize: '22px',
        fontWeight: '500',
        fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
        cursor: 'pointer',
        position: 'relative',
        textAlign: 'center',
        maxWidth: '280px',
        margin: '0 auto'
      }}
    >
      {children}
    </button>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginLeft: 8 }} />
  </div>
);

const Order: React.FC = () => {
  // Обработчик для кнопки "Другое..."
  const handleOtherClick = () => {
    if (window.Telegram && window.Telegram.WebApp && (window.Telegram.WebApp as any).showAlert) {
      (window.Telegram.WebApp as any).showAlert('Функция временно не доступна');
    } else {
      alert('Функция временно не доступна');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '100px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div
        style={{
          backgroundColor: '#2D1E5A',
          borderRadius: '25px',
          padding: '30px 20px',
          width: '100%',
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <h1 style={{
          color: 'white',
          fontSize: '28px',
          marginBottom: '32px',
          fontWeight: '500',
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          Выберите услугу<br />дизайна
        </h1>
        <ButtonWithDots>GFX баннер</ButtonWithDots>
        <ButtonWithDots>GFX анимация</ButtonWithDots>
        <ButtonWithDots>GFX аватарка</ButtonWithDots>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 0, marginTop: 8, justifyContent: 'center', position: 'relative' }}>
          <span style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'rgba(254, 83, 187, 0.7)',
            boxShadow: '0 0 16px 8px rgba(254, 83, 187, 0.3)',
            display: 'inline-block',
            marginRight: 8,
            position: 'relative',
            zIndex: 1
          }} />
          <button
            onClick={handleOtherClick}
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#B6116B',
              color: 'white',
              border: 'none',
              fontSize: '22px',
              fontWeight: '500',
              fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
              cursor: 'pointer',
              position: 'relative',
              textAlign: 'center',
              width: '112px',
              margin: '0 auto',
              zIndex: 2
            }}
          >
            Другое...
          </button>
          <span style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'rgba(254, 83, 187, 0.7)',
            boxShadow: '0 0 16px 8px rgba(254, 83, 187, 0.3)',
            display: 'inline-block',
            marginLeft: 8,
            position: 'relative',
            zIndex: 1
          }} />
        </div>
      </div>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(9, 251, 211, 0.1)',
          filter: 'blur(100px)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(254, 83, 187, 0.1)',
          filter: 'blur(100px)',
          zIndex: 0
        }} />
      </div>
    </div>
  );
};

export default Order; 