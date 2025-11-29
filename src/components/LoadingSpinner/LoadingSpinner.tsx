import { motion } from 'framer-motion';
import './LoadingSpinner.css';

/**
 * Enhanced Loading Spinner
 * Modern, engaging loading state with animations
 */
const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <motion.div
        className="loading-spinner"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="spinner-ring"></div>
        <div className="spinner-ring-inner"></div>
      </motion.div>
      <motion.p
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;

