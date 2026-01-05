import React, { useState } from 'react';
import { gsap } from 'gsap';
import DecryptedText from './DecryptedText';
import './StartPage.css';

const StartPage = ({ onStart }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleStart = () => {
    setIsLeaving(true);

    // 平滑过渡动画
    gsap.to('.start-content', {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power2.inOut'
    });

    gsap.to('.start-page-container', {
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        onStart();
      }
    });
  };

  return (
    <div className={`start-page-container ${isLeaving ? 'leaving' : ''}`}>
      {/* 动画背景 - 使用 CSS 渐变动画替代 Hyperspeed */}
      <div className="animated-background"></div>

      {/* 内容层 */}
      <div className="start-content">
        <div className="start-logo">
          <div className="logo-icon">🐾</div>
          <DecryptedText
            text="CY Pet Store"
            className="start-title"
            speed={50}
            maxIterations={30}
            onComplete={() => setShowSubtitle(true)}
          />
          {showSubtitle && (
            <DecryptedText
              text="everything for your pet"
              className="start-subtitle"
              speed={50}
              maxIterations={25}
              onComplete={() => setShowButton(true)}
              as="p"
            />
          )}
        </div>

        {showButton && (
          <button
            className="start-button"
            onClick={handleStart}
            disabled={isLeaving}
          >
            <span className="button-text">start to explore</span>
            <span className="button-arrow">→</span>
          </button>
        )}

        {showButton && (
          <div className="start-hint">
            <p>click the button to enter the store</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;
