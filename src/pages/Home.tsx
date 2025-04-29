import React from 'react';
import { motion } from 'framer-motion';
import textHomeImage from '/images/text_home.png';
import tarelkaImage from '/images/tarelka.png';

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
      y: -50
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5
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
          position: 'absolute',
          top: '10%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <img
          src={textHomeImage}
          alt="Текст"
          style={{
            width: '95%',
            maxWidth: '1000px',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
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
          transform: 'translateX(-8%) translateY(-50px)',
          margin: '0',
        }}
      >
        <motion.img
          src={tarelkaImage}
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