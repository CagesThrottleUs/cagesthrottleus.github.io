import { useEffect } from 'react';

/**
 * Keyboard Shortcuts Component
 * Adds useful keyboard navigation to the site
 * - Home: Scroll to top
 * - End: Scroll to bottom
 */
const KeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Home key - scroll to top
      if (event.key === 'Home') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // End key - scroll to bottom
      if (event.key === 'End') {
        event.preventDefault();
        window.scrollTo({ 
          top: document.documentElement.scrollHeight, 
          behavior: 'smooth' 
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;

