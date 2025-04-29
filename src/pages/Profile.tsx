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
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1A1A1A',
      padding: '20px'
    }}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{
          backgroundColor: '#2D1E5A',
          borderRadius: '30px',
          padding: '40px 20px',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        <h1 style={{
          color: 'white',
          fontSize: '28px',
          marginBottom: '30px',
          fontWeight: '600'
        }}>
          Личный кабинет
        </h1>

        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '3px solid #FF54BD',
          backgroundColor: '#gray',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} />

        <div style={{
          color: 'white',
          marginBottom: '10px',
          fontSize: '24px'
        }}>
          никнейм
        </div>

        <div style={{
          color: '#888',
          marginBottom: '30px',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          Баланс: <span style={{ color: 'white' }}>$0</span>
        </div>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '15px',
            backgroundColor: '#B6116B',
            color: 'white',
            border: 'none',
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '15px',
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
            padding: '15px',
            borderRadius: '15px',
            backgroundColor: '#09FBD3',
            color: '#2D1E5A',
            border: 'none',
            fontSize: '18px',
            fontWeight: '500',
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