import React, { useState, useEffect, useCallback } from 'react';
import DecryptedText from './DecryptedText';
import './StartPage.css';

const StartPage = ({ onStart, onPressChange }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const pressTimerRef = React.useRef(null);
  const progressTimerRef = React.useRef(null);
  const onPressChangeRef = React.useRef(onPressChange);
  const onStartRef = React.useRef(onStart);

  // 保持 ref 同步
  React.useEffect(() => {
    onPressChangeRef.current = onPressChange;
    onStartRef.current = onStart;
  }, [onPressChange, onStart]);


  const handleStart = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);

    // 停止加速
    if (onPressChangeRef.current) {
      onPressChangeRef.current(false);
    }

    // 清除计时器
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    // 延迟后隐藏 StartPage
    setTimeout(() => {
      onStartRef.current();
    }, 800);
  }, [isLeaving]);

  // 监听鼠标长按事件
  useEffect(() => {
    const handleMouseDown = () => {
      if (isLeaving) return;

      // 通知父组件按下状态,触发加速
      if (onPressChangeRef.current) {
        onPressChangeRef.current(true);
      }

      // 开始计时
      const startTime = Date.now();

      // 更新进度条
      progressTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / 2000) * 100, 100);
        setPressProgress(progress);
      }, 16); // 60fps

      // 2秒后自动触发进入
      pressTimerRef.current = setTimeout(() => {
        handleStart();
      }, 2000);
    };

    const handleMouseUp = () => {
      // 通知父组件松开状态,停止加速
      if (onPressChangeRef.current) {
        onPressChangeRef.current(false);
      }

      // 清除计时器
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      // 重置进度
      setPressProgress(0);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isLeaving, handleStart]);

  return (
    <div className={`start-page-container ${isLeaving ? 'leaving' : ''}`}>
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
          <div className="subtitle-container">
            {showSubtitle && (
              <DecryptedText
                text="everything for your pet"
                className="start-subtitle"
                speed={50}
                maxIterations={25}
                as="p"
              />
            )}
          </div>
        </div>

        {showSubtitle && (
          <div className="press-hint">
            <p>hold left mouse button for 2 seconds to enter</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${pressProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;
