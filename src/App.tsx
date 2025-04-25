import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Order from './components/pages/Order';
import History from './components/pages/History';
import Support from './components/pages/Support';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Home />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Profile />
          </motion.div>
        } />
        <Route path="/order" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Order />
          </motion.div>
        } />
        <Route path="/history" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <History />
          </motion.div>
        } />
        <Route path="/support" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Support />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#150B2C',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/fon.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: 1,
          transform: 'translateY(-15%) translateX(3%) scale(1.3)',
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          gap: '30px',
          transform: 'scale(1.3)',
          padding: '120px',
        }}>
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
        </div>
        
        <main style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          padding: '20px',
          paddingBottom: '80px',
          color: 'white',
        }}>
          <AnimatedRoutes />
        </main>
        
        <Navigation />
      </div>
    </BrowserRouter>
  );
};

export default App; 