import React from 'react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
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
      paddingTop: '60px'
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
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '2px solid #FF54BD',
          backgroundColor: '#2D1E5A',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} />

        <div style={{
          color: 'white',
          marginBottom: '5px',
          fontSize: '20px',
          fontWeight: '400',
          opacity: '0.9'
        }}>
          никнейм
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