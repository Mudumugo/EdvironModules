import { useState, useEffect } from "react";

export function useLandingAutoPlay(navigationTabs: string[]) {
  const [activeTab, setActiveTab] = useState("Educational Modules Dashboard");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTab(currentTab => {
        const currentIndex = navigationTabs.indexOf(currentTab);
        const nextIndex = (currentIndex + 1) % navigationTabs.length;
        return navigationTabs[nextIndex];
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, navigationTabs]);

  return {
    activeTab,
    setActiveTab,
    isAutoPlaying,
    setIsAutoPlaying
  };
}