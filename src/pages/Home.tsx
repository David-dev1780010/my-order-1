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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '20px',
    }}>
      <motion.div
        variants={plateVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-50px',
        }}
      >
        <motion.img
          src="/images/tarelka.png"
          alt="Тарелка"
          style={{
            width: '100%',
            height: 'auto',
            filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))',
          }}
        />
      </motion.div>
    </div>
  );
};

export default Home; 