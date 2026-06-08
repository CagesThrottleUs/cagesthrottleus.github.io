import { ActionButton } from '@react-spectrum/s2';
import { Button, Text } from '@react-spectrum/s2/Button';
import ChevronDoubleLeft from '@react-spectrum/s2/icons/ChevronDoubleLeft';
import ChevronUp from '@react-spectrum/s2/icons/ChevronUp';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const headerBar = style({
  paddingTop: 24,
  paddingBottom: 16,
});

const scrollTopBtn = style({
  position: 'fixed',
  bottom: 32,
  insetEnd: 32,
  zIndex: 10,
});

export function PostWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div>
      <div className={headerBar}>
        <Button onPress={() => void navigate('/')}>
          <ChevronDoubleLeft />
          <Text>Back To Home</Text>
        </Button>
      </div>
      {children}
      {showScrollTop && (
        <div className={scrollTopBtn}>
          <ActionButton
            aria-label="Scroll to top"
            onPress={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <ChevronUp />
          </ActionButton>
        </div>
      )}
    </div>
  );
}
