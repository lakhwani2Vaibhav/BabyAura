'use client';

import React, { useRef, useState, useEffect, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface ScrollAnimationWrapperProps {
  children: React.ReactElement;
  animationClasses: string;
  className?: string;
  threshold?: number;
}

export function ScrollAnimationWrapper({
  children,
  animationClasses,
  className,
  threshold = 0.1,
}: ScrollAnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set inView state based on whether the element is intersecting.
        // This allows the animation to trigger every time it enters the viewport.
        setInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  if (!isValidElement(children)) {
    return null;
  }
  
  return (
    <div ref={ref} className={className}>
      {cloneElement(children, {
        className: cn(
          children.props.className,
          'transition-all duration-500 ease-out',
          !inView && 'opacity-0',
          inView && animationClasses
        ),
      })}
    </div>
  );
}
