import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, type MockInstance,vi } from 'vitest';

import { SOCIAL_LINKS } from './constants';
import { Socials } from './Socials';

describe('Socials', () => {
  describe('rendering', () => {
    it(`renders exactly SOCIAL_LINKS.length (${String(SOCIAL_LINKS.length)}) buttons`, () => {
      render(<Socials />);
      expect(screen.getAllByRole('button')).toHaveLength(SOCIAL_LINKS.length);
    });

    it.each(SOCIAL_LINKS)(
      'button for "$label" has matching aria-label from SOCIAL_LINKS config',
      ({ label }) => {
        render(<Socials />);
        expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
      },
    );
  });

  describe('window.open is not called before interaction', () => {
    it('does not call window.open on render', () => {
      const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
      render(<Socials />);
      expect(openSpy).not.toHaveBeenCalled();
      openSpy.mockRestore();
    });
  });

  describe('click interactions', () => {
    let openSpy: MockInstance;

    beforeEach(() => {
      openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    });

    afterEach(() => {
      openSpy.mockRestore();
    });

    it.each(SOCIAL_LINKS)(
      'clicking "$label" calls window.open with href from SOCIAL_LINKS, _blank, noopener,noreferrer',
      async ({ label, href }) => {
        const user = userEvent.setup();
        render(<Socials />);
        await user.click(screen.getByRole('button', { name: label }));
        expect(openSpy).toHaveBeenCalledWith(
          href,
          '_blank',
          'noopener,noreferrer',
        );
      },
    );

    it('each button opens its own distinct URL — no cross-contamination', async () => {
      const user = userEvent.setup();
      render(<Socials />);
      for (const { label, href } of SOCIAL_LINKS) {
        openSpy.mockClear();
        await user.click(screen.getByRole('button', { name: label }));
        expect(openSpy).toHaveBeenCalledTimes(1);
        expect(openSpy).toHaveBeenCalledWith(
          href,
          '_blank',
          'noopener,noreferrer',
        );
      }
    });
  });
});
