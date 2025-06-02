import '../styles/global.css';

import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import { ThemeProvider } from '../context/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  // Initialize particles engine once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Load only the slim bundle to reduce bundle size
      await loadSlim(engine);
    }).catch((error) => {
      console.error('Failed to initialize particles engine:', error);
    });
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
