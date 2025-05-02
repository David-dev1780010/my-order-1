import React from 'react';

const ButtonWithDots: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '18px' }}>
    <span style={{
      width: 10, height: 10, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginRight: 8
    }} />
    <button
      {...props}
      style={{
        flex: 1,
        padding: '16px',
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
        ...props.style
      }}
    >
      {children}
    </button>
    <span style={{
      width: 10, height: 10, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginLeft: 8
    }} />
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
      overflow: 'hidden'
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
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 0, marginTop: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginRight: 8 }} />
          <button
            onClick={handleOtherClick}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#B6116B',
              color: 'white',
              border: 'none',
              fontSize: '18px',
              fontWeight: '500',
              fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
              cursor: 'pointer',
              position: 'relative',
              textAlign: 'center'
            }}
          >
            Другое...
          </button>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginLeft: 8 }} />
        </div>
      </div>
    </div>
  );
};

export default Order; 