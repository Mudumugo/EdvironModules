import { useRef } from 'react';

export const useBookAudioSynthesis = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playPageFlipSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Create multiple layers for realistic paper sound
      const createPaperRustle = (startTime: number, frequency: number, duration: number, volume: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        // White noise simulation for paper texture
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, startTime + duration);
        
        // High-pass filter for crisp paper sound
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, startTime);
        filter.Q.setValueAtTime(2, startTime);
        
        // Quick attack and decay for paper snap
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.1, startTime + duration * 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      
      // Layer 1: Initial paper contact (high frequency crinkle)
      createPaperRustle(now, 1200, 0.08, 0.02);
      
      // Layer 2: Main paper fold/turn (mid frequency)
      createPaperRustle(now + 0.02, 600, 0.12, 0.025);
      
      // Layer 3: Final settling (lower frequency rustle)
      createPaperRustle(now + 0.06, 300, 0.10, 0.015);
      
    } catch (error) {
      // Silently fail if audio context is not available
      console.log('Audio context not available for page flip sound');
    }
  };

  return { playPageFlipSound };
};