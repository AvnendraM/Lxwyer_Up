import { useRef, useEffect } from 'react';

/**
 * useHorizontalScroll
 * Intercepts vertical wheel/trackpad events and redirects them to horizontal scroll.
 * Works seamlessly with Mac trackpad two-finger horizontal swipe and vertical scrolling.
 * @param {object} options
 * @param {number} options.speed - Multiplier for wheel delta (default 1)
 */
export function useHorizontalScroll({ speed = 1 } = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onWheel = (e) => {
            // Only redirect if the element can scroll horizontally
            if (el.scrollWidth <= el.clientWidth) return;

            // If the user is scrolling mostly horizontally (two-finger swipe on trackpad), let it pass through
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            // Prevent default only when intercepting vertical scroll
            e.preventDefault();
            el.scrollLeft += e.deltaY * speed;
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [speed]);

    return ref;
}
