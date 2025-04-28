import React from 'react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const plateVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      y: 50,
      rotate: -10,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 1.5
      }
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const textVariants = {
    initial: {
      opacity: 0,
      y: -20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      paddingTop: '0',
    }}>
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
        style={{
          textAlign: 'center',
          color: 'white',
          zIndex: 10,
          position: 'relative',
          padding: '0 20px',
          marginBottom: '-10px',
        }}
      >
        <h1 style={{
          fontSize: '42px',
          fontWeight: '600',
          marginBottom: '20px',
          lineHeight: '1.2',
          fontFamily: "'Montserrat Alternates', sans-serif",
          textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
        }}>
          Крутой дизайн без головной боли
        </h1>
        <p style={{
          fontSize: '20px',
          opacity: 0.9,
          lineHeight: '1.4',
          fontFamily: "'Montserrat Alternates', sans-serif",
          textShadow: '0 0 8px rgba(255,255,255,0.4), 0 0 16px rgba(255,255,255,0.2)',
        }}>
          Мы создаём 3D-дизайн, лендинги, UI/UX, брендинг и графику. Быстро, качественно, в срок.
        </p>
      </motion.div>

      <motion.div
        variants={plateVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        style={{
          width: '220vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: 'translateX(-8%) translateY(-5%)',
          margin: '0',
        }}
      >
        <motion.img
          src="/images/tarelka.png"
          alt="Тарелка"
          style={{
            width: '100%',
            height: 'auto',
            filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.5))',
          }}
        />
      </motion.div>
    </div>
  );
};

export default Home; 