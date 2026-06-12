import { Button } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { SOCIAL_LINKS } from './constants';

const containerStyle = style({
  display: 'flex',
  gap: 4,
  alignItems: 'center',
});

export function Socials() {
  return (
    <div className={containerStyle} aria-label="Social links">
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <Button
          key={href}
          variant="secondary"
          size="M"
          aria-label={label}
          onPress={() => {
            window.open(href, '_blank', 'noopener,noreferrer');
          }}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
}
