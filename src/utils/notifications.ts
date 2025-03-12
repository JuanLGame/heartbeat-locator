
const ALARM_SOUND_URL = '/alarm-sound.mp3';
let alarmAudio: HTMLAudioElement | null = null;

// Initialize audio on first user interaction
export function initAudio() {
  if (!alarmAudio) {
    alarmAudio = new Audio(ALARM_SOUND_URL);
    alarmAudio.preload = 'auto';
    alarmAudio.loop = false;
  }
}

export function playAlarmSound() {
  if (!alarmAudio) initAudio();
  
  if (alarmAudio) {
    alarmAudio.currentTime = 0;
    alarmAudio.play().catch(error => {
      console.error('Error playing alarm sound:', error);
    });
  }
}

export function stopAlarmSound() {
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

export async function showNotification(title: string, options?: NotificationOptions) {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    return new Notification(title, options);
  }
  
  return null;
}

// Function to check if the device can vibrate
export function canVibrate(): boolean {
  return 'vibrate' in navigator;
}

// Function to make the device vibrate with a pattern
export function vibrate(pattern: number | number[]): void {
  if (canVibrate()) {
    navigator.vibrate(pattern);
  }
}

// Function to notify a user when their alarm is triggered
export async function notifyAlarmTriggered(userName: string, isMatch: boolean) {
  let title, body;
  
  if (isMatch) {
    title = '¡Match en Love Alarm!';
    body = `Tú y ${userName} se gustan mutuamente`;
    // Stronger vibration for matches
    vibrate([200, 100, 200, 100, 400]);
  } else {
    title = '¡Love Alarm Activada!';
    body = 'Alguien cerca ha activado tu Love Alarm';
    vibrate([200, 100, 200]);
  }
  
  playAlarmSound();
  
  await showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/badge-96.png',
    tag: isMatch ? 'love-alarm-match' : 'love-alarm-triggered',
    requireInteraction: true
  });
}
