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
        // Set the state based on whether the element is intersecting or not.
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
          'transition-opacity',
          !inView && 'opacity-0', // Hide until in view
          inView && animationClasses
        ),
      })}
    </div>
  );
}
