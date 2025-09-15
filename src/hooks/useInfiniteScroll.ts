import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '200px'
}: UseInfiniteScrollProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ref = loadMoreRef.current;
    if (!ref || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [isLoading, hasMore, onLoadMore, rootMargin]);

  return { loadMoreRef };
}
