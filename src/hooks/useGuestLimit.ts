import { useState, useEffect } from 'react';

const MAX_GUEST_DOWNLOADS = 10;
const STORAGE_KEY = 'yt_dl_guest_count';
const DATE_KEY = 'yt_dl_date';

export function useGuestLimit(isLoggedIn: boolean) {
  const [remaining, setRemaining] = useState<number>(MAX_GUEST_DOWNLOADS);

  useEffect(() => {
    if (isLoggedIn) {
      setRemaining(9999);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem(DATE_KEY);
    const storedCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

    if (storedDate !== today) {
      // Reset if new day
      localStorage.setItem(DATE_KEY, today);
      localStorage.setItem(STORAGE_KEY, '0');
      setRemaining(MAX_GUEST_DOWNLOADS);
    } else {
      setRemaining(Math.max(0, MAX_GUEST_DOWNLOADS - storedCount));
    }
  }, [isLoggedIn]);

  const incrementCount = () => {
    if (isLoggedIn) return true;

    const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    if (currentCount >= MAX_GUEST_DOWNLOADS) return false;

    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEY, newCount.toString());
    setRemaining(MAX_GUEST_DOWNLOADS - newCount);
    return true;
  };

  return { remaining, incrementCount };
}