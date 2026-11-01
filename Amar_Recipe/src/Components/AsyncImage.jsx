import { useEffect, useState } from 'react';

export default function AsyncImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackSrc = 'https://placehold.co/300x200?text=No+Image',
  loading = 'lazy',
  onError,
  ...props
}) {
  const [status, setStatus] = useState('loading');
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    const resolvedSrc = src || fallbackSrc;
    setCurrentSrc(resolvedSrc);
    setStatus('loading');
  }, [src, fallbackSrc]);

  useEffect(() => {
    if (!currentSrc) return;

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => setStatus('loaded');
    img.onerror = () => {
      setCurrentSrc(fallbackSrc);
      setStatus('error');
    };
    img.src = currentSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentSrc, fallbackSrc]);

  const handleError = (event) => {
    event.target.onerror = null;

    if (event.target.currentSrc !== fallbackSrc && event.target.src !== fallbackSrc) {
      event.target.src = fallbackSrc;
    }

    setStatus('error');
    if (onError) onError(event);
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {status !== 'loaded' && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#f4f4f5] via-white to-[#f4f4f5] dark:from-[#2b2b2b] dark:via-[#1f1f1f] dark:to-[#2b2b2b] bg-[length:200%_100%] animate-image-shimmer" />
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setStatus('loaded')}
        onError={handleError}
        className={`${className} ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
}
