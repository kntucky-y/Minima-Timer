// Three high-pitched "ting" sounds - Web Audio API implementation
export const createBellSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const playBellSound = () => {
    // Play three high-pitched "ting" sounds
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.4; // 400ms between each ting
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // High-pitched frequency for clear "ting" sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(2200, audioContext.currentTime + delay);
      
      // Sharp envelope: quick attack, fast decay for crisp "ting"
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + delay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.25);
      
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + 0.25);
    }
  };
  
  return { playBellSound };
};