// Gentle notification sound - Web Audio API implementation
export const createBellSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const playBellSound = () => {
    // Create a gentle, pleasant notification sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();
    
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    gainNode1.connect(audioContext.destination);
    gainNode2.connect(audioContext.destination);
    
    // Soft, warm frequencies - like a gentle chime
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator1.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    oscillator2.frequency.setValueAtTime(1320, audioContext.currentTime); // E6 (perfect fifth)
    
    // Gentle envelope: soft attack, long sustain, gentle decay
    const now = audioContext.currentTime;
    
    gainNode1.gain.setValueAtTime(0, now);
    gainNode1.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gainNode1.gain.setValueAtTime(0.2, now + 0.5);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    
    gainNode2.gain.setValueAtTime(0, now);
    gainNode2.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gainNode2.gain.setValueAtTime(0.15, now + 0.5);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 1.5);
    oscillator2.stop(now + 1.5);
  };
  
  return { playBellSound };
};