
import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minLoadTime = 5000; // 5 seconds minimum
    const randomExtra = Math.random() * 2000; // Up to 2 seconds extra
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadTime + randomExtra);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default PageWrapper;
