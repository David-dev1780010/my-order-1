import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            photo_url?: string;
            username?: string;
            id?: number;
          };
        };
      };
    };
  }
}

const TopUpModal: React.FC = () => {
  const [amount, setAmount] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#1E1231',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        color: 'white'
      }}>
        <div style={{ fontSize: '17px', opacity: 0.6 }}>Закрыть</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '17px' }}>Order a</div>
          <div style={{ fontSize: '13px', opacity: 0.6 }}>мини-приложение</div>
        </div>
        <div style={{ width: '50px' }}>⋮</div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        margin: '20px',
        backgroundColor: '#2D1E5A',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        <div style={{
          color: 'white',
          fontSize: '32px',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          Пополнение баланса
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <input
            type="number"
            placeholder="Введите сумму ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '17px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: '#55ACEE',
            borderRadius: '12px',
            width: '180px',
            height: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src="/images/crypto_pay.png" 
              alt="CryptoBot"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain'
              }}
            />
          </div>
          <div style={{
            color: 'white',
            fontSize: '17px'
          }}>
            CryptoBot
          </div>
        </div>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: '#B6116B',
            color: 'white',
            border: 'none',
            fontSize: '17px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Пополнить
        </motion.button>
      </div>
    </motion.div>
  );
};

const Profile: React.FC = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('никнейм');
  const [email, setEmail] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  useEffect(() => {
    // Получаем данные пользователя из Telegram WebApp
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser) {
      if (telegramUser.photo_url) {
        setUserPhoto(telegramUser.photo_url);
      }
      if (telegramUser.username) {
        setUsername(telegramUser.username);
        setTempUsername(telegramUser.username);
      }
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername);
    }
    if (tempEmail.trim()) {
      setEmail(tempEmail);
    }
    if (previewUrl) {
      setUserPhoto(previewUrl);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUsername(username);
    setTempEmail(email);
    setPreviewUrl(null);
    setIsEditing(false);
  };

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
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
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
          fontSize: '32px',
          marginBottom: '40px',
          fontWeight: '500',
          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
          Личный кабинет
        </h1>

        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          border: '3px solid #FF54BD',
          backgroundColor: '#2D1E5A',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '8px',
          cursor: isEditing ? 'pointer' : 'default'
        }}>
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                zIndex: 2
              }}
            />
          )}
          {(previewUrl || userPhoto) ? (
            <img 
              src={previewUrl || userPhoto || ''}
              alt="Аватар пользователя"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#FF54BD',
              opacity: 0.5
            }} />
          )}
          {isEditing && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              fontSize: '10px',
              textAlign: 'center',
              padding: '2px 0'
            }}>
              Изменить
            </div>
          )}
        </div>

        {isEditing ? (
          <motion.input
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="text"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            placeholder="Введите никнейм"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid #FF54BD',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '16px',
              width: '100%',
              marginBottom: '10px',
              outline: 'none'
            }}
          />
        ) : (
          <div style={{
            color: 'white',
            marginBottom: '5px',
            fontSize: '20px',
            fontWeight: '400',
            opacity: '0.9'
          }}>
            {username}
          </div>
        )}

        <AnimatePresence>
          {isEditing && (
            <motion.input
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              type="email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              placeholder="Введите email"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid #FF54BD',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '16px',
                width: '100%',
                marginBottom: '10px',
                outline: 'none'
              }}
            />
          )}
        </AnimatePresence>

        {!isEditing && (
          <div style={{
            color: '#9E9E9E',
            marginBottom: '25px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Баланс: <span style={{ color: 'white' }}>💰 $0</span>
          </div>
        )}

        {!isEditing && (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsTopUpModalOpen(true)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#B6116B',
              color: 'white',
              border: 'none',
              fontSize: '17px',
              fontWeight: '500',
              marginBottom: '12px',
              cursor: 'pointer'
            }}
          >
            Пополнить баланс
          </motion.button>
        )}

        {isEditing ? (
          <>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#09FBD3',
                color: '#2D1E5A',
                border: 'none',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              Сохранить
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleCancel}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#B6116B',
                color: 'white',
                border: 'none',
                fontSize: '17px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Отмена
            </motion.button>
          </>
        ) : (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsEditing(true)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#09FBD3',
              color: '#2D1E5A',
              border: 'none',
              fontSize: '17px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Редактировать профиль
          </motion.button>
        )}
      </motion.div>
      <AnimatePresence>
        {isTopUpModalOpen && (
          <TopUpModal />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile; 