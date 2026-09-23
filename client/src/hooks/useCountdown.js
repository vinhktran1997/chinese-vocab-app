import { useState, useEffect, useRef } from 'react';

export default function useCountdown(seconds, onComplete, isActive) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const checkCountdown = () => {
      if (!isActive) {
        setTimeLeft(seconds);
        return;
      }
    };

    if (timeLeft <= 0) {
      onCompleteRef.current();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    checkCountdown();
    return () => clearTimeout(timerId);
  }, [timeLeft, isActive, seconds]);

  const reset = () => setTimeLeft(seconds);
  return { timeLeft, reset };
}
