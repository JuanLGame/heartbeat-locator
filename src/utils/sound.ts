
// Define available sounds for different notifications
const SOUNDS = {
  ALARM: new URL('/sounds/alarm.mp3', import.meta.url).href,
  MATCH: new URL('/sounds/match.mp3', import.meta.url).href,
  NOTIFICATION: new URL('/sounds/notification.mp3', import.meta.url).href
};

// Play a sound with the given ID
export const playSound = (soundId: keyof typeof SOUNDS) => {
  try {
    const audio = new Audio(SOUNDS[soundId]);
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
    
    // Add vibration if supported and user has enabled it
    if ('vibrate' in navigator) {
      if (soundId === 'ALARM') {
        navigator.vibrate([200, 100, 200]);
      } else {
        navigator.vibrate(100);
      }
    }
    
    return audio;
  } catch (error) {
    console.error('Failed to play sound:', error);
    return null;
  }
};

export default { playSound, SOUNDS };
