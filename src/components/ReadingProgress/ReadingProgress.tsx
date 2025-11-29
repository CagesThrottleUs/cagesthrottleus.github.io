import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import './ReadingProgress.css';

/**
 * Reading Progress Bar
 * Shows visual progress as user scrolls through the page
 * Enhances engagement by providing visual feedback
 */
const ReadingProgress = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Show progress bar after scrolling 10%
      setIsVisible(latest > 0.1);
    });

    return () => { unsubscribe(); };
  }, [scrollYProgress]);

  return (
    <motion.div
      className="reading-progress-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="reading-progress-bar"
        style={{ scaleX }}
      />
    </motion.div>
  );
};

export default ReadingProgress;

