import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundProviders from './components/BackgroundProviders';
import Loading from './components/Loading';
import PerformanceMonitor from './components/PerformanceMonitor';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chat = lazy(() => import('./pages/Chat'));
const About = lazy(() => import('./pages/About'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Prediction = lazy(() => import('./pages/Prediction'));
const Settings = lazy(() => import('./pages/Settings'));

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      y: 20,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.01, 0.05, 0.95] as any,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.6, 0.01, 0.05, 0.95] as any,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Dashboard />
              </motion.div>
            }
          />
          <Route
            path="/chat"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Chat />
              </motion.div>
            }
          />
          <Route
            path="/about"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <About />
              </motion.div>
            }
          />
          <Route
            path="/favorites"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Favorites />
              </motion.div>
            }
          />
          <Route
            path="/prediction"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Prediction />
              </motion.div>
            }
          />
          <Route
            path="/settings"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Settings />
              </motion.div>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <BackgroundProviders>
        <PerformanceMonitor />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 100,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#6366f1',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-20 w-full">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BackgroundProviders>
    </Router>
  );
};

export default App;