import React from 'react';
import './ColourfulButton.css';

const ColourfulButton = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  variant = "default" // default, primary, secondary
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`colourful-button ${variant} ${className}`}
    >
      <span className="button-content">
        {children}
      </span>
    </button>
  );
};

export default ColourfulButton;
