import React, { useState } from 'react';

const ImageWithFallback = ({ src, alt, icon, className }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className} bg-background-900/50`}>
        <span className="text-2xl">{icon}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default ImageWithFallback;
