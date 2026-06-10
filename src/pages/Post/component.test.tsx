import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as ReactRouter from 'react-router';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PostWrapper } from './component';

const mockNavigate = vi.fn();

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPostWrapper(children = <p>post body</p>) {
  return render(
    <MemoryRouter>
      <PostWrapper>{children}</PostWrapper>
    </MemoryRouter>,
  );
}

describe('PostWrapper', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
  });

  describe('children', () => {
    it('renders children inside the wrapper', () => {
      renderPostWrapper(<p>unique content</p>);
      expect(screen.getByText('unique content')).toBeInTheDocument();
    });
  });

  describe('back navigation', () => {
    it('renders a "Back To Home" button', () => {
      renderPostWrapper();
      expect(
        screen.getByRole('button', { name: /back to home/i }),
      ).toBeInTheDocument();
    });

    it('pressing back navigates to "/"', async () => {
      const user = userEvent.setup();
      renderPostWrapper();
      await user.click(screen.getByRole('button', { name: /back to home/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('back button is rendered before post content in DOM order', () => {
      const { container } = renderPostWrapper(<p>content</p>);
      const allDivs = container.querySelectorAll('div');
      const headerDiv = allDivs[1]; // first inner div is the header bar
      expect(headerDiv).toContainElement(
        screen.getByRole('button', { name: /back to home/i }),
      );
    });
  });

  describe('scroll-to-top button', () => {
    it('is absent when scrollY is 0', () => {
      renderPostWrapper();
      expect(
        screen.queryByRole('button', { name: /scroll to top/i }),
      ).not.toBeInTheDocument();
    });

    it('appears after scrollY exceeds 300', () => {
      renderPostWrapper();
      Object.defineProperty(window, 'scrollY', { writable: true, value: 301 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(
        screen.getByRole('button', { name: /scroll to top/i }),
      ).toBeInTheDocument();
    });

    it('disappears when scrollY drops back to 0', () => {
      renderPostWrapper();
      Object.defineProperty(window, 'scrollY', { writable: true, value: 301 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(
        screen.queryByRole('button', { name: /scroll to top/i }),
      ).not.toBeInTheDocument();
    });

    it('exactly at scrollY=300 the button is still absent', () => {
      renderPostWrapper();
      Object.defineProperty(window, 'scrollY', { writable: true, value: 300 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(
        screen.queryByRole('button', { name: /scroll to top/i }),
      ).not.toBeInTheDocument();
    });

    it('clicking scroll-to-top calls window.scrollTo with top:0 smooth', async () => {
      const scrollToSpy = vi
        .spyOn(window, 'scrollTo')
        .mockReturnValue(undefined);
      const user = userEvent.setup();
      renderPostWrapper();
      Object.defineProperty(window, 'scrollY', { writable: true, value: 301 });
      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });
      await user.click(screen.getByRole('button', { name: /scroll to top/i }));
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      scrollToSpy.mockRestore();
    });
  });
});
