import React, { useState } from 'react';

const ImageDebugger = ({ src, alt }) => {
  const [status, setStatus] = useState('loading');
  const [actualSrc, setActualSrc] = useState('');

  const handleLoad = (e) => {
    setStatus('loaded');
    setActualSrc(e.target.currentSrc || e.target.src);
    console.log('✓ Image loaded successfully:', e.target.src);
  };

  const handleError = (e) => {
    setStatus('error');
    setActualSrc(e.target.src);
    console.error('✗ Image failed to load:', {
      src: e.target.src,
      error: e,
      naturalWidth: e.target.naturalWidth,
      naturalHeight: e.target.naturalHeight
    });
  };

  return (
    <div style={{ border: '2px solid #ccc', padding: '10px', margin: '10px' }}>
      <div>
        <strong>状态:</strong>
        <span style={{
          color: status === 'loaded' ? 'green' : status === 'error' ? 'red' : 'orange',
          marginLeft: '10px'
        }}>
          {status}
        </span>
      </div>
      <div><strong>传入的src:</strong> {src}</div>
      <div><strong>实际加载的src:</strong> {actualSrc}</div>
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          maxWidth: '200px',
          border: '1px solid #999',
          display: 'block',
          marginTop: '10px'
        }}
      />
    </div>
  );
};

export default ImageDebugger;
