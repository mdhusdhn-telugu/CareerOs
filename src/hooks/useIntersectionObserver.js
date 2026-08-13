import { useEffect, useState, useRef } from 'react';

/**
 * A custom React hook that tracks the intersection of a component with the viewport.
 * @param {object} options - Configuration options for the IntersectionObserver.
 * @param {number} [options.threshold=0.1] - A number between 0 and 1, representing the percentage of the element that must be visible to trigger the callback.
 * @param {boolean} [options.triggerOnce=true] - If true, the observer will disconnect after the element has been intersected once.
 * @returns {[React.RefObject<HTMLElement>, boolean]} - A tuple containing the ref to attach to the element and a boolean indicating if it's intersecting.
 */
const useIntersectionObserver = (options = {}) => {
  const { threshold = 0.1, triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Create the observer with a callback function
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is intersecting (visible)
        if (entry.isIntersecting) {
          setIsIntersecting(true);

          // If we only want to trigger it once, disconnect the observer
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      {
        threshold,
      }
    );

    const currentRef = ref.current;

    // Start observing the element if the ref is attached
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup function to unobserve the element when the component unmounts
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold, triggerOnce]); // Rerun effect if these dependencies change

  return [ref, isIntersecting];
};

export default useIntersectionObserver;