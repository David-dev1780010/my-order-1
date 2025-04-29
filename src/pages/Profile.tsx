import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

const Profile: React.FC = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('никнейм');

  useEffect(() => {
    // Получаем данные пользователя из Telegram WebApp
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser) {
      if (telegramUser.photo_url) {
        setUserPhoto(telegramUser.photo_url);
      }
      if (telegramUser.username) {
        setUsername(telegramUser.username);
      }
    }
  }, []);

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
          width: '85px',
          height: '85px',
          borderRadius: '50%',
          border: '2px solid #FF54BD',
          backgroundColor: '#2D1E5A',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {userPhoto ? (
            <img 
              src={userPhoto}
              alt="Аватар пользователя"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              backgroundColor: '#FF54BD',
              opacity: 0.5
            }} />
          )}
        </div>

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
    </div>
  );
};

export default Profile; 