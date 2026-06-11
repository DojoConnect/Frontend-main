import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Avatar({
  src,
  alt = 'avatar',
  size = 32,
  className = ''
}: { src?: string | null; alt?: string; size?: number; className?: string }) {
  const [errored, setErrored] = useState(false);
  const wrapperClass = cn('inline-flex items-center justify-center overflow-hidden rounded-full bg-white', className);

  const placeholder = (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" fill="none" className="block">
      <g clipPath="url(#a)">
        <path fill="#ffdcd0" d="M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50"/>
        <path fill="#ff948c" d="M50 58.805c9.9 0 17.924-8.025 17.924-17.925S59.9 22.956 50 22.956c-9.9 0-17.925 8.025-17.925 17.924 0 9.9 8.025 17.925 17.925 17.925M84.46 86.366C75.504 94.82 63.43 100 50.145 100s-25.622-5.294-34.605-13.912c.412-.852.898-1.665 1.385-2.467a37.5 37.5 0 0 1 8.687-9.85c.321-.255.526-.642.925-.804.706-.148 1.222-.654 1.769-1.046 1.978-1.421 4.168-2.435 6.344-3.486.187-.08.376-.15.564-.225 3.526-1.348 7.144-2.367 10.905-2.73 2.168-.21 4.361-.043 6.54-.056 2.826.112 5.601.538 8.31 1.37A41 41 0 0 1 73 72.76c4.357 3.143 7.769 7.12 10.469 11.748.35.603.641 1.249.99 1.857"/>
      </g>
      <defs>
        <clipPath id="a"><rect width="100" height="100" rx="50" fill="#fff"/></clipPath>
      </defs>
    </svg>
  );

  if (!src || errored) {
    return <div style={{ width: size, height: size }} className={wrapperClass}>{placeholder}</div>;
  }
  // Resolve non-HTTP src values (public ids or relative paths)
  let resolvedSrc = src as string;
  try {
    const cloudBase = process.env.NEXT_PUBLIC_CLOUDINARY_BASE || '';
    const backBase = process.env.NEXT_PUBLIC_BACK_OFFICE_API_URL || 'https://apis.dojoconnect.app/api';
    if (!resolvedSrc.startsWith('http')) {
      // if it looks like a path
      if (resolvedSrc.startsWith('/')) {
        resolvedSrc = `${backBase}${resolvedSrc}`;
      } else if (resolvedSrc.includes('/')) {
        // assume relative path
        resolvedSrc = `${backBase}/${resolvedSrc}`;
      } else {
        // assume a Cloudinary public id
        if (cloudBase) resolvedSrc = `${cloudBase}/${resolvedSrc}`;
        else resolvedSrc = `${backBase}/images/${resolvedSrc}`;
      }
    }
  } catch (e) {
    // fallback: use original src
    resolvedSrc = src as string;
  }

  return (
    <div style={{ width: size, height: size }} className={wrapperClass}>
      <Image
        src={resolvedSrc}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
