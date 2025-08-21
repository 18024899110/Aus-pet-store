import React, { useState, useEffect } from 'react';

const ProductImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  placeholder = '/images/placeholder.svg',
  containerClass = '',
  responsive = true
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(placeholder);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setHasError(false);
    setIsLoading(false);
  };

  // 构建完整的图片URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return placeholder;
    
    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // 如果是相对路径且以/开头，直接返回
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // 否则添加/images/前缀
    return `/images/${imagePath}`;
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
    transition: 'opacity 0.3s ease',
    opacity: isLoading ? 0.7 : 1,
    ...style
  };

  const containerStyle = responsive ? {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa'
  } : {};

  if (containerClass || responsive) {
    return (
      <div className={containerClass} style={containerStyle}>
        <img
          src={getImageUrl(imageSrc)}
          alt={alt}
          className={`product-image-base ${className}`}
          style={imageStyle}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <img
      src={getImageUrl(imageSrc)}
      alt={alt}
      className={`product-image-base ${className}`}
      style={imageStyle}
      onError={handleImageError}
      onLoad={handleImageLoad}
      loading="lazy"
    />
  );
};

export default ProductImage;