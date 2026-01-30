import React from 'react';
import './IconButton.css';

const IconButton = ({
  icon: Icon,
  text,
  variant = "gradient",
  onClick,
  type = "button",
  className = "",
  size = "md",
  ...props
}) => {
  const sizeClass = `icon-button-${size}`;
  const variantClass = `icon-button-${variant}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`icon-button ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {Icon && <Icon className={text ? "icon-with-text" : "icon-only"} />}
      {text && <span className="button-text">{text}</span>}
    </button>
  );
};

export default IconButton;
