import Link from 'next/link';
import React from 'react';

import { Background } from '../background/Background';
import { resumeLink, socialLinks } from '../config/social-links';
import { useTheme } from '../context/ThemeContext';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { ThemeSwitch } from '../navigation/ThemeSwitch';

const Hero = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Background color={isDark ? 'bg-dark' : 'bg-gray-100'}>
      <div className="flex min-h-screen flex-col">
        <Section yPadding="py-6">
          <NavbarTwoColumns>
            <li className="flex items-center">
              {socialLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <svg
                      className="size-6 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d={link.icon} />
                    </svg>
                  </Link>
                  {index < socialLinks.length - 1 && <div className="w-6" />}
                </React.Fragment>
              ))}
              <div className="w-6" />
              <Link
                href={resumeLink.href}
                aria-label={resumeLink.ariaLabel}
                className="text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <svg
                  className="size-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                  imageRendering="optimizeQuality"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  viewBox="0 0 441 512.02"
                  aria-hidden="true"
                >
                  <path d="M324.87 279.77c32.01 0 61.01 13.01 82.03 34.02 21.09 21 34.1 50.05 34.1 82.1 0 32.06-13.01 61.11-34.02 82.11l-1.32 1.22c-20.92 20.29-49.41 32.8-80.79 32.8-32.06 0-61.1-13.01-82.1-34.02-21.01-21-34.02-50.05-34.02-82.11s13.01-61.1 34.02-82.1c21-21.01 50.04-34.02 82.1-34.02zM243.11 38.08v54.18c.99 12.93 5.5 23.09 13.42 29.85 8.2 7.01 20.46 10.94 36.69 11.23l37.92-.04-88.03-95.22zm91.21 120.49-41.3-.04c-22.49-.35-40.21-6.4-52.9-17.24-13.23-11.31-20.68-27.35-22.19-47.23l-.11-1.74V25.29H62.87c-10.34 0-19.75 4.23-26.55 11.03-6.8 6.8-11.03 16.21-11.03 26.55v336.49c0 10.3 4.25 19.71 11.06 26.52 6.8 6.8 16.22 11.05 26.52 11.05h119.41c2.54 8.79 5.87 17.25 9.92 25.29H62.87c-17.28 0-33.02-7.08-44.41-18.46C7.08 432.37 0 416.64 0 399.36V62.87c0-17.26 7.08-32.98 18.45-44.36C29.89 7.08 45.61 0 62.87 0h173.88c4.11 0 7.76 1.96 10.07 5l109.39 118.34c2.24 2.43 3.34 5.49 3.34 8.55l.03 119.72c-8.18-1.97-16.62-3.25-25.26-3.79v-89.25zm-229.76 54.49c-6.98 0-12.64-5.66-12.64-12.64 0-6.99 5.66-12.65 12.64-12.65h150.49c6.98 0 12.65 5.66 12.65 12.65 0 6.98-5.67 12.64-12.65 12.64H104.56zm0 72.3c-6.98 0-12.64-5.66-12.64-12.65 0-6.98 5.66-12.64 12.64-12.64h142.52c3.71 0 7.05 1.6 9.37 4.15a149.03 149.03 0 0 0-30.54 21.14H104.56zm0 72.3c-6.98 0-12.64-5.66-12.64-12.65 0-6.98 5.66-12.64 12.64-12.64h86.2c-3.82 8.05-6.95 16.51-9.29 25.29h-76.91zm264.81 31.11c3.56.15 6.09 1.33 7.54 3.55 3.98 5.94-1.44 11.81-5.19 15.94l-40.04 40.71c-4.32 4.26-9.32 4.31-13.64 0l-41.01-41.82c-3.51-3.95-7.86-9.36-4.19-14.83 1.49-2.22 4-3.4 7.56-3.55h19.74v-32.45c0-5.82 4.81-10.69 10.7-10.69h28.06c5.9 0 10.71 4.8 10.71 10.69v32.45h19.76z" />
                </svg>
              </Link>
              <div className="w-6" />
              <ThemeSwitch />
            </li>
          </NavbarTwoColumns>
        </Section>

        <Section yPadding="flex-grow flex items-center justify-center">
          <HeroOneButton
            title={<span className="hero-title-animated">Jehandad Kamal</span>}
            description="Systems Engineer · CoFounder · LLM Evangelist"
          />
        </Section>

        {/* Scroll Hint */}
        <div className="flex justify-center pb-8">
          <div className="animate-bounce">
            <svg
              className="w-8 h-8 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                const companiesSection = document.getElementById('companies-section');
                companiesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </Background>
  );
};

export { Hero };
