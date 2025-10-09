import { useEffect, useRef } from 'react';
import { Direction } from '../types/game';

interface TouchStart {
  x: number;
  y: number;
  time: number;
}

/**
 * Custom hook to handle keyboard and touch/swipe input
 * @param onMove - Callback function to execute when a valid move is detected
 */
export const useGameControls = (onMove: (direction: Direction) => void) => {
  const touchStartRef = useRef<TouchStart | null>(null);

  useEffect(() => {
    /**
     * Handle keyboard arrow key presses
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = keyToDirection[e.key];
      if (direction) {
        e.preventDefault();
        onMove(direction);
      }
    };

    /**
     * Handle touch start - record starting position and time
     */
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    /**
     * Handle touch end - calculate swipe direction
     * Swipe must be at least 30px and within 300ms to be considered valid
     */
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Minimum swipe distance and maximum time
      const minSwipeDistance = 30;
      const maxSwipeTime = 300;

      if (deltaTime > maxSwipeTime) {
        touchStartRef.current = null;
        return;
      }

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Determine if horizontal or vertical swipe
      if (Math.max(absX, absY) < minSwipeDistance) {
        touchStartRef.current = null;
        return;
      }

      let direction: Direction;
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      e.preventDefault();
      onMove(direction);
      touchStartRef.current = null;
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onMove]);
};
