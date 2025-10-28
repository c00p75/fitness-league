/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Live region announcements for screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const liveRegion = document.getElementById('live-region') || createLiveRegion();
  
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  liveRegion.appendChild(announcement);
  
  // Remove after 1 second to avoid screen reader clutter
  setTimeout(() => announcement.remove(), 1000);
}

function createLiveRegion(): HTMLElement {
  const liveRegion = document.createElement('div');
  liveRegion.id = 'live-region';
  liveRegion.className = 'sr-only';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  document.body.appendChild(liveRegion);
  return liveRegion;
}

/**
 * Skip navigation link IDs
 */
export const SKIP_LINK_IDS = {
  main: 'main-content',
  navigation: 'main-navigation',
} as const;

/**
 * Create skip link functionality
 */
export function setupSkipLinks(): void {
  if (typeof window === 'undefined') return;
  
  // Add skip links if they don't exist
  if (!document.getElementById('skip-navigation')) {
    const skipLinks = document.createElement('nav');
    skipLinks.id = 'skip-navigation';
    skipLinks.className = 'sr-only';
    skipLinks.setAttribute('aria-label', 'Skip navigation');
    
    const skipMain = document.createElement('a');
    skipMain.href = `#${SKIP_LINK_IDS.main}`;
    skipMain.className = 'skip-link';
    skipMain.textContent = 'Skip to main content';
    
    skipLinks.appendChild(skipMain);
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }
}

/**
 * Keyboard navigation handler
 */
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  handlers: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onTab?: () => void;
    onShiftTab?: () => void;
  }
): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handlers.onEnter?.();
      break;
    case 'Escape':
      handlers.onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      handlers.onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      handlers.onArrowDown?.();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      handlers.onArrowLeft?.();
      break;
    case 'ArrowRight':
      event.preventDefault();
      handlers.onArrowRight?.();
      break;
    case 'Tab':
      handlers.onTab?.();
      break;
  }
}

/**
 * Trap focus within an element (for modals, dropdowns)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => element.removeEventListener('keydown', handleTabKey);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safe animation duration based on user preference
 */
export function getAnimationDuration(duration: number = 300): string {
  return prefersReducedMotion() ? '0ms' : `${duration}ms`;
}

/**
 * Focus management for modals
 */
export function manageModalFocus(
  modal: HTMLElement | null,
  previousFocus: HTMLElement | null = null
): () => void {
  if (!modal) return () => {};
  
  // Focus the modal
  const focusableElements = modal.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  } else {
    modal.focus();
  }
  
  // Trap focus
  const cleanup = trapFocus(modal);
  
  // Return function to restore focus
  return () => {
    cleanup();
    previousFocus?.focus();
  };
}

