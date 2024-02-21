import React, { useState, useEffect } from 'react';

interface InstallPWAProps {
    children?: React.ReactNode;
}

interface BeforeInstallPromptEvent {
    userChoice: unknown;
    preventDefault(): void;
    prompt(): Promise<BeforeInstallPromptDialogResult>;
  }
  
  interface BeforeInstallPromptDialogResult {
    outcome: 'accepted' | 'dismissed';
  }

const InstallPWA: React.FC<InstallPWAProps> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = async (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as unknown as EventListener);

    return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as unknown as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice; // Wait for user's choice
        console.log('PWA installed successfully!');
      } catch (err) {
        console.error('PWA installation failed:', err);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      {children}
      {deferredPrompt && (
        <button onClick={handleInstall}>Install PWA</button>
      )}
    </>
  );
};

export default InstallPWA;