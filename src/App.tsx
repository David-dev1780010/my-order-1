import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Order from './pages/Order';
import History from './pages/History';
import Support from './pages/Support';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -50,
    },
  };

  const backgroundVariants = {
    initial: {
      scale: 1.1,
      opacity: 0.2,
    },
    animate: {
      scale: 1.3,
      opacity: 0.3,
    },
  };

  const circlesVariants = {
    initial: {
      scale: 1.1,
      opacity: 0.4,
    },
    animate: {
      scale: 1.3,
      opacity: 0.6,
    },
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'profile':
        return <Profile />;
      case 'order':
        return <Order />;
      case 'history':
        return <History />;
      case 'support':
        return <Support />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#150B2C',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <motion.div
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/fon.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
          transform: 'translateY(-15%) translateX(3%)',
        }}
      />
      
      {/* Circles */}
      <motion.div
        variants={circlesVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          padding: '120px',
          zIndex: 2,
        }}
      >
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          backgroundColor: '#09FBD3',
          opacity: 0.6,
          filter: 'blur(50px)',
          transform: 'translateY(-30px)',
          mixBlendMode: 'lighten',
        }} />
        <div style={{
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          backgroundColor: '#FE53BB',
          opacity: 0.6,
          filter: 'blur(50px)',
          mixBlendMode: 'lighten',
        }} />
      </motion.div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        height: 'calc(100vh - 110px)',
        overflow: 'auto',
        paddingBottom: '20px',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            style={{
              height: '100%',
            }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default App; 