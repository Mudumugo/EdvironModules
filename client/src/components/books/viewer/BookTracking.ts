import { useEffect, useState } from 'react';
import { xapiTracker } from '@/lib/xapi/xapiTracker';

interface BookData {
  id?: number;
  title?: string;
  type?: string;
  xapiEnabled?: boolean;
}

export const useBookTracking = (bookData?: BookData) => {
  const [sessionStartTime] = useState(new Date());

  // xAPI tracking functions
  const trackPageView = (page: number, pageStartTime: Date) => {
    if (bookData?.xapiEnabled) {
      const timeOnPage = Math.floor((new Date().getTime() - pageStartTime.getTime()) / 1000);
      xapiTracker.trackReadingProgress(
        bookData?.id?.toString() || '',
        bookData?.title || '',
        page,
        0, // totalPages will be passed from parent
        timeOnPage
      );
    }
  };

  const trackBookmark = (action: 'added' | 'removed', page: number) => {
    if (bookData?.xapiEnabled) {
      xapiTracker.trackBookmark(action, bookData?.id?.toString() || '', bookData?.title || '', page);
    }
  };

  // Initialize xAPI tracking on component mount
  useEffect(() => {
    if (bookData?.xapiEnabled) {
      xapiTracker.trackAccessed(bookData?.id?.toString() || '', bookData?.title || '', bookData?.type || 'book');
    }
  }, [bookData?.id, bookData?.title, bookData?.xapiEnabled, bookData?.type]);

  // Track session completion on unmount
  useEffect(() => {
    return () => {
      if (bookData?.xapiEnabled) {
        const sessionDuration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
        xapiTracker.trackSessionComplete(bookData?.id?.toString() || '', bookData?.title || '', sessionDuration);
      }
    };
  }, [bookData?.id, bookData?.title, bookData?.xapiEnabled, sessionStartTime]);

  return {
    trackPageView,
    trackBookmark
  };
};