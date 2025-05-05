// minor change for redeploy
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  {
    key: 'banner',
    title: 'GFX баннер',
    price: 20,
    description: 'Мы создадим уникальный GFX баннер, учитывая все ваши пожелания.',
    placeholder: 'Чем подробнее, тем лучше. Например: Ник, цвет, тематика и tg',
    image: '/images/color.png',
  },
  {
    key: 'animation',
    title: 'GFX анимация',
    price: 40,
    description: 'Анимированный GFX-баннер или аватарка для вашего профиля или проекта.',
    placeholder: 'Опишите, что должно анимироваться, стиль, цвета, ник и т.д.',
    image: '/images/color.png',
  },
  {
    key: 'avatar',
    title: 'GFX аватарка',
    price: 20,
    description: 'Яркая и запоминающаяся GFX-аватарка для соцсетей или мессенджеров.',
    placeholder: 'Например: Ник, цвет, стиль, тематика',
    image: '/images/color.png',
  },
];

const ButtonWithDots: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 12 }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginRight: 8 }} />
    <button
      onClick={onClick}
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
        margin: '0 auto',
        transition: 'background 0.2s',
      }}
    >
      {children}
    </button>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block', marginLeft: 8 }} />
  </div>
);

const containerVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Order: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOtherClick = () => {
    if (window.Telegram && window.Telegram.WebApp && (window.Telegram.WebApp as any).showAlert) {
      (window.Telegram.WebApp as any).showAlert('Функция временно не доступна');
    } else {
      alert('Функция временно не доступна');
    }
  };

  const service = services.find(s => s.key === selected);

  let userTag = '';
  let balance = 0;
  try {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const parsed = JSON.parse(profile);
      userTag = parsed.savedUserTag || '';
    }
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
      balance = parseFloat(savedBalance);
    }
  } catch {}

  const handleOrder = () => {
    setError(null);
    setSuccess(null);
    if (!details || details.length < 50 || details.length > 560) {
      setError('Техническое задание должно содержать от 50 до 560 символов.\n\nИнструкция: подробно опишите, что вы хотите получить, чтобы достичь минимального количества символов.');
      return;
    }
    if (!userTag) {
      setError('В профиле не заполнен username!\n\nИнструкция: перейдите в профиль и укажите ваш username, чтобы мы могли связаться с вами.');
      return;
    }
    if (balance < (service?.price || 0)) {
      setError(`Недостаточно средств на балансе!\n\nИнструкция: пополните баланс минимум на ${service?.price}$ для оформления заказа.`);
      return;
    }
    setSuccess('Заказ успешно оформлен!');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: selected ? '40px' : '100px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{
          backgroundColor: '#2D1E5A',
          borderRadius: '25px',
          padding: selected ? '18px 10px' : '30px 20px',
          width: '100%',
          maxWidth: '340px',
          maxHeight: selected ? '90vh' : undefined,
          overflowY: selected ? 'auto' : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.3 } }}
            style={{ width: '100%' }}
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
            <ButtonWithDots onClick={() => setSelected('banner')}>GFX баннер</ButtonWithDots>
            <ButtonWithDots onClick={() => setSelected('animation')}>GFX анимация</ButtonWithDots>
            <ButtonWithDots onClick={() => setSelected('avatar')}>GFX аватарка</ButtonWithDots>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 0, marginTop: 8, justifyContent: 'center' }}>
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
                  width: '180px',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block' }} />
                Другое...
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B6116B', display: 'inline-block' }} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="order"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.3 } }}
            style={{ width: '100%' }}
          >
            <div style={{ position: 'absolute', top: 24, right: 24, color: '#FF53C0', fontWeight: 700, fontSize: 32, fontFamily: 'Montserrat Alternates', zIndex: 2 }}>
              {service?.price}$
            </div>
            <img src={service?.image} alt="color" style={{ width: 80, height: 80, margin: '0 auto 12px', display: 'block' }} />
            <div style={{
              color: 'white',
              fontSize: '28px',
              fontWeight: 500,
              fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
              textAlign: 'center',
              marginBottom: 8
            }}>{service?.title}</div>
            <div style={{
              color: '#BEB8D1',
              fontSize: '18px',
              fontWeight: 400,
              fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
              textAlign: 'center',
              marginBottom: 18
            }}>{service?.description}</div>
            <textarea
              placeholder={service?.placeholder}
              value={details}
              onChange={e => setDetails(e.target.value)}
              style={{
                width: '100%',
                minHeight: 90,
                background: '#584C7D',
                border: 'none',
                borderRadius: 18,
                color: 'white',
                fontSize: 17,
                padding: 18,
                marginBottom: 12,
                fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {error && (
              <div style={{ color: '#FF53C0', background: 'rgba(255,83,192,0.08)', borderRadius: 10, padding: '8px 12px', marginBottom: 10, whiteSpace: 'pre-line', fontSize: 15, textAlign: 'center' }}>{error}</div>
            )}
            {success && (
              <div style={{ color: '#09FBD3', background: 'rgba(9,251,211,0.08)', borderRadius: 10, padding: '8px 12px', marginBottom: 10, fontSize: 15, textAlign: 'center' }}>{success}</div>
            )}
            <button
              onClick={handleOrder}
              style={{
                padding: '6px 40px',
                margin: '0 auto 16px',
                display: 'block',
                borderRadius: '14px',
                backgroundColor: '#B6116B',
                color: 'white',
                border: 'none',
                fontSize: '22px',
                fontWeight: '600',
                fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Оформить заказ
            </button>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#09FBD3', display: 'inline-block', marginRight: 4 }} />
              <button
                onClick={() => setSelected(null)}
                style={{
                  padding: '6px 40px',
                  margin: '0 auto',
                  display: 'block',
                  borderRadius: '14px',
                  backgroundColor: '#09FBD3',
                  color: '#2D1E5A',
                  border: 'none',
                  fontSize: '22px',
                  fontWeight: '600',
                  fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  textAlign: 'center',
                }}
              >
                Выбрать другую услугу
              </button>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#09FBD3', display: 'inline-block', marginLeft: 4 }} />
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
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