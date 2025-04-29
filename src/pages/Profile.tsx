import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        close: () => void;
      };
    };
  }
}

interface ProfileData {
  nickname: string;
  email: string;
  phone: string;
}

const Profile: React.FC = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('никнейм');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Получаем данные пользователя из Telegram WebApp
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser) {
      if (telegramUser.photo_url) {
        setUserPhoto(telegramUser.photo_url);
      }
      if (telegramUser.username) {
        setUsername(telegramUser.username);
        setProfileData(prev => ({ ...prev, nickname: telegramUser.username || '' }));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Здесь будет логика сохранения данных на бэкенд
    setUsername(profileData.nickname);
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

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    marginBottom: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
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
          {isEditing ? 'Редактирование' : 'Личный кабинет'}
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
          padding: '8px'
        }}>
          {userPhoto ? (
            <img 
              src={userPhoto}
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
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <input
                type="text"
                name="nickname"
                placeholder="Никнейм"
                value={profileData.nickname}
                onChange={handleInputChange}
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={profileData.email}
                onChange={handleInputChange}
                style={inputStyle}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={profileData.phone}
                onChange={handleInputChange}
                style={inputStyle}
              />
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleSubmit}
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
                onClick={() => setIsEditing(false)}
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <div style={{
                color: 'white',
                marginBottom: '5px',
                fontSize: '20px',
                fontWeight: '400',
                opacity: '0.9'
              }}>
                {username}
              </div>

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
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                Пополнить баланс
              </motion.button>

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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile; 