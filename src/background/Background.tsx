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
  const isDark = theme === 'dark';

  const particlesOptions = {
    fullScreen: {
      enable: true,
      zIndex: 1,
    },
    particles: {
      number: {
        value: isDark ? 100 : 60,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: isDark
          ? ['#64748B', '#94A3B8', '#CBD5E1'] // Subtle grays/blues for dark theme
          : ['#475569', '#64748B', '#94A3B8'], // Darker grays for light theme
      },
      shape: {
        type: ['circle', 'triangle', 'polygon'] as string[],
        stroke: {
          width: 0,
          color: '#000000',
        },
        polygon: {
          sides: 6,
        },
      },
      opacity: {
        value: isDark ? 0.4 : 0.3,
        random: true,
        animation: {
          enable: true,
          speed: 0.2,
          minimumValue: isDark ? 0.1 : 0.05,
          sync: false,
        },
      },
      size: {
        value: isDark ? 2.5 : 2,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.5,
          sync: false,
        },
      },
      lineLinked: {
        enable: true,
        distance: isDark ? 120 : 100,
        color: isDark ? '#374151' : '#9CA3AF',
        opacity: isDark ? 0.2 : 0.15,
        width: 0.5,
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: MoveDirection.none,
        random: true,
        straight: false,
        outModes: {
          default: 'bounce' as const,
        },
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas' as const,
      events: {
        onHover: {
          enable: true,
          mode: 'bubble',
        },
        onClick: {
          enable: true,
          mode: 'repulse',
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 140,
          lineLinked: {
            opacity: 0.5,
          },
        },
        bubble: {
          distance: 200,
          size: 6,
          duration: 0.3,
          opacity: 0.8,
        },
        repulse: {
          distance: 150,
          duration: 0.4,
        },
        push: {
          quantity: 2,
        },
        remove: {
          quantity: 2,
        },
      },
    },
    retina_detect: true,
  } as const;

  return (
    <div className={`relative ${color}`}>
      <Particles options={particlesOptions} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export { Background };
