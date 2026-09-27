import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

export type CursorState = 'default' | 'hover' | 'button' | 'card' | 'text';

export const NovaCursor: React.FC = () => {
  const { settings } = useSettings();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>('default');

  // Mouse coordinate motion values (updated directly without React re-renders)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High responsiveness for the central dot
  const dotX = useSpring(mouseX, { damping: 45, stiffness: 800, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 45, stiffness: 800, mass: 0.1 });

  // Smooth cinematic lag & easing for the outer trailing ring
  const ringX = useSpring(mouseX, { damping: 26, stiffness: 300, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 26, stiffness: 300, mass: 0.5 });

  const activeElementRef = useRef<HTMLElement | null>(null);

  // Check hardware capability: desktop with fine pointer & reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDevice = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Only enable on non-touch devices with fine pointers and no reduced motion preference
      setIsEnabled(hasFinePointer && !isTouch && !prefersReducedMotion);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Update cursor state based on hovered target (debounced/gated so we don't spam state)
  const handleTargetCheck = useCallback((target: HTMLElement | null) => {
    if (!target) {
      setCursorState('default');
      activeElementRef.current = null;
      return;
    }

    // Check custom explicit data-cursor attributes first
    const explicitCursor = target.closest('[data-cursor]')?.getAttribute('data-cursor') as CursorState | null;
    if (explicitCursor) {
      setCursorState(explicitCursor);
      activeElementRef.current = target;
      return;
    }

    // Detect text editing or text inputs
    if (target.closest('input, textarea, [contenteditable="true"]')) {
      setCursorState('text');
      activeElementRef.current = target;
      return;
    }

    // Detect card elements
    if (target.closest('[role="button"][aria-label*="Rating"], .shadow-card, [data-card]')) {
      setCursorState('card');
      activeElementRef.current = target;
      return;
    }

    // Detect buttons
    if (target.closest('button, [role="button"]')) {
      setCursorState('button');
      activeElementRef.current = target;
      return;
    }

    // Detect links
    if (target.closest('a')) {
      setCursorState('hover');
      activeElementRef.current = target;
      return;
    }

    // Default state
    setCursorState('default');
    activeElementRef.current = null;
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const onMouseMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      // Optional subtle magnetic pull on important buttons or elements with [data-magnetic]
      const magneticTarget = (e.target as HTMLElement)?.closest?.('[data-magnetic="true"]') as HTMLElement | null;
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // 25% pull toward the center of the magnetic button
        targetX = targetX + (centerX - targetX) * 0.28;
        targetY = targetY + (centerY - targetY) * 0.28;
      }

      mouseX.set(targetX);
      mouseY.set(targetY);

      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      handleTargetCheck(e.target as HTMLElement);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isEnabled, isVisible, mouseX, mouseY, handleTargetCheck]);

  if (!isEnabled || !isVisible || settings.cursor === 'system') {
    return null;
  }

  const showOuterRing = settings.cursor === 'nova';

  // Ring dimension and style configurations per cursor state
  const ringVariants = {
    default: {
      width: 30,
      height: 30,
      borderColor: 'var(--nova-accent)',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      opacity: 0.6,
    },
    hover: {
      width: 44,
      height: 44,
      borderColor: 'var(--nova-accent)',
      backgroundColor: 'rgba(var(--nova-accent-rgb), 0.08)',
      borderWidth: 1.5,
      opacity: 1,
    },
    button: {
      width: 48,
      height: 48,
      borderColor: 'var(--nova-accent)',
      backgroundColor: 'rgba(var(--nova-accent-rgb), 0.15)',
      borderWidth: 2,
      opacity: 1,
    },
    card: {
      width: 54,
      height: 54,
      borderColor: 'rgba(255, 255, 255, 0.35)',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderWidth: 1.5,
      opacity: 1,
    },
    text: {
      width: 4,
      height: 22,
      borderColor: 'var(--nova-accent)',
      backgroundColor: 'var(--nova-accent)',
      borderWidth: 0,
      opacity: 0.85,
    },
  };

  const dotVariants = {
    default: {
      width: 5,
      height: 5,
      backgroundColor: 'var(--nova-accent)',
      opacity: 1,
    },
    hover: {
      width: 7,
      height: 7,
      backgroundColor: '#FFFFFF',
      opacity: 1,
    },
    button: {
      width: 8,
      height: 8,
      backgroundColor: 'var(--nova-accent)',
      opacity: 0.9,
    },
    card: {
      width: 5,
      height: 5,
      backgroundColor: 'var(--nova-accent)',
      opacity: 1,
    },
    text: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      opacity: 0,
    },
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden"
      aria-hidden="true"
    >
      {/* Outer Eased Circular Ring */}
      {showOuterRing && (
        <motion.div
          style={{
            x: ringX,
            y: ringY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={ringVariants[cursorState]}
          transition={{
            type: 'spring',
            damping: 24,
            stiffness: 300,
            mass: 0.4,
          }}
          className="rounded-full pointer-events-none backdrop-blur-[0.5px]"
        />
      )}

      {/* Central Snappy Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={dotVariants[cursorState]}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 500,
        }}
        className="rounded-full pointer-events-none shadow-sm"
      />
    </div>
  );
};
