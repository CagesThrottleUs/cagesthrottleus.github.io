import type { IconProps } from '@react-spectrum/s2';
import type { FunctionComponent } from 'react';

import GitHubIcon from './icons/GitHubIcon';
import LinkedInIcon from './icons/LinkedInIcon';

export interface SocialLink {
  href: string;
  label: string;
  Icon: FunctionComponent<IconProps>;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/CagesThrottleUs',
    label: 'GitHub profile',
    Icon: GitHubIcon,
  },
  {
    href: 'https://www.linkedin.com/in/lakshya-bits/',
    label: 'LinkedIn profile',
    Icon: LinkedInIcon,
  },
];
