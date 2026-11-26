import { useLayoutEffect, useRef } from 'react';

export default function useAnimatedHeight(isOpen) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) return;

    const updateHeight = () => {
      if (isOpen) {
        wrapper.style.height = `${content.scrollHeight}px`;
      }
    };

    if (isOpen) {
      wrapper.style.height = `${content.scrollHeight}px`;
    } else {
      wrapper.style.height = `${content.scrollHeight}px`;

      requestAnimationFrame(() => {
        wrapper.style.height = '0px';
      });
    }

    const observer = new ResizeObserver(updateHeight);

    observer.observe(content);

    return () => observer.disconnect();
  }, [isOpen]);

  return { wrapperRef, contentRef };
}