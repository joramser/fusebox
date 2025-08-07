import { useEffect, useRef } from "react";

export function useIntersectionObserver<T extends Element>(
  callback: (element: Element) => void,
  options: IntersectionObserverInit = {},
) {
  const { threshold = 1, root = null, rootMargin = "0px" } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          callback(element);
        }
      },
      { threshold, root, rootMargin },
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [callback, threshold, root, rootMargin]);

  return ref;
}
