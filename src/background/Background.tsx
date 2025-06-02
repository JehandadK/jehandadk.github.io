import { MoveDirection } from '@tsparticles/engine';
import Particles from '@tsparticles/react';
import { type FC } from 'react';

import { useTheme } from '../context/ThemeContext';

interface IBackgroundProps {
  color?: string;
  children?: React.ReactNode;
}

const Background: FC<IBackgroundProps> = ({ color, children }) => {
  const { theme } = useTheme();

  const particlesOptions = {
    fullScreen: {
      enable: true,
      zIndex: 1,
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: theme === 'dark' ? '#4a5568' : '#e3e9f0',
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000',
        },
        polygon: {
          sides: 5,
        },
      },
      opacity: {
        value: 0.5,
        random: false,
        animation: {
          enable: false,
          speed: 1,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        animation: {
          enable: false,
          speed: 40,
          minimumValue: 0.1,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: theme === 'dark' ? '#4a5568' : '#e2e8f0',
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: MoveDirection.none,
        random: false,
        straight: false,
        outModes: 'out' as const,
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detectsOn: 'window' as const,
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
      },
      modes: {
        grab: {
          distance: 400,
          links: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          quantity: 4,
        },
        remove: {
          quantity: 2,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <div className={`min-h-screen w-full ${color}`}>
      <Particles id="tsparticles" options={particlesOptions} />
      {children}
    </div>
  );
};

export { Background };
