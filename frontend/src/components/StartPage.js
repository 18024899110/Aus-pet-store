import React, { useState } from 'react';
import { gsap } from 'gsap';
import Hyperspeed from './Hyperspeed';
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
      {/* Hyperspeed 背景 */}
      <Hyperspeed effectOptions={{
        onSpeedUp: () => { },
        onSlowDown: () => { },
        distortion: 'turbulentDistortion',
        length: 400,
        roadWidth: 10,
        islandWidth: 2,
        lanesPerRoad: 4,
        fov: 90,
        fovSpeedUp: 150,
        speedUp: 2,
        carLightsFade: 0.4,
        totalSideLightSticks: 20,
        lightPairsPerRoadWay: 40,
        shoulderLinesWidthPercentage: 0.05,
        brokenLinesWidthPercentage: 0.1,
        brokenLinesLengthPercentage: 0.5,
        lightStickWidth: [0.12, 0.5],
        lightStickHeight: [1.3, 1.7],
        movingAwaySpeed: [60, 80],
        movingCloserSpeed: [-120, -160],
        carLightsLength: [400 * 0.03, 400 * 0.2],
        carLightsRadius: [0.05, 0.14],
        carWidthPercentage: [0.3, 0.5],
        carShiftX: [-0.8, 0.8],
        carFloorSeparation: [0, 5],
        colors: {
          roadColor: 0xffffff,
          islandColor: 0xffffff,
          background: 0xffffff,
          shoulderLines: 0xFFFFFF,
          brokenLines: 0xFFFFFF,
          leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
          rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
          sticks: 0x03B3C3,
        }
      }}/>

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
