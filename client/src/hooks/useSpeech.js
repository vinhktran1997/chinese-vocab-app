import { useState, useCallback } from 'react';

export default function useSpeech() {
  const [speakingText, setSpeakingText] = useState(null);

  const speak = useCallback((text, rate = 0.8) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;

    utterance.onstart = () => setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, speakingText };
}
