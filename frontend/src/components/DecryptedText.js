import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const DecryptedText = ({
  text,
  className = '',
  speed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  onComplete = () => {},
  as: Component = 'h1'
}) => {
  const [displayText, setDisplayText] = useState('');
  const onCompleteRef = useRef(onComplete);

  // 保持 onCompleteRef 始终是最新的
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let iteration = 0;
    let intervalId;

    const decrypt = () => {
      if (iteration >= maxIterations) {
        setDisplayText(text);
        clearInterval(intervalId);
        onCompleteRef.current();
        return;
      }

      const newText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';

          if (iteration * (text.length / maxIterations) > index) {
            return text[index];
          }

          if (useOriginalCharsOnly) {
            const randomIndex = Math.floor(Math.random() * text.length);
            return text[randomIndex];
          }

          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          return randomChar;
        })
        .join('');

      setDisplayText(newText);
      iteration++;
    };

    // 初始随机字符
    const initialText = text
      .split('')
      .map(char => {
        if (char === ' ') return ' ';
        if (useOriginalCharsOnly) {
          const randomIndex = Math.floor(Math.random() * text.length);
          return text[randomIndex];
        }
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join('');

    setDisplayText(initialText);

    // 开始解密动画
    intervalId = setInterval(decrypt, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, maxIterations, useOriginalCharsOnly, characters]);

  const MotionComponent = motion[Component] || motion.h1;

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
    </MotionComponent>
  );
};

export default DecryptedText;
