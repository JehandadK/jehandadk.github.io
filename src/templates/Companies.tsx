import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Section } from '../layout/Section';

const Companies = () => {
  interface Company {
    name: string;
    role: string;
    period: string;
    logo: string;
    website: string | null;
    invertInLightMode?: boolean;
  }

  const companies: Company[] = [
    {
      name: 'xmap.ai',
      role: 'Co-Founder & CTO',
      period: '2023-Present',
      logo: '/images/companies/xmap-ai.png',
      website: 'https://xmap.ai',
    },
    {
      name: 'Mercari',
      role: 'LLM/AI Team',
      period: '2019-Present',
      logo: '/images/companies/mercari.jpg',
      website: 'https://mercari.co.jp',
    },
    {
      name: 'Rakuten',
      role: 'Mobile Architect',
      period: '2016-2018',
      logo: '/images/companies/rakuten.png',
      website: 'https://rakuten.co.jp',
    },
    {
      name: 'Royal Cyber',
      role: 'Mobile Team Lead',
      period: '2015-2016',
      logo: '/images/companies/royalcyber.jpeg',
      website: 'https://royalcyber.com',
    },
    {
      name: 'Erly Stage Studios',
      role: 'CTO',
      period: '2013-2015',
      logo: '/images/companies/erly-stage-studios.png',
      website: 'https://erlystagestudios.com',
    },
    {
      name: 'Sagedom',
      role: 'Android Developer',
      period: '2016',
      logo: '/images/companies/sagedom.png',
      website: 'https://www.linkedin.com/company/sagedom',
    },
    {
      name: '10Pearls',
      role: 'Software Engineer',
      period: '2012',
      logo: '/images/companies/10pearls.svg',
      website: 'https://10pearls.com',
      invertInLightMode: true,
    },
    {
      name: 'Wavetec',
      role: 'System Engineer',
      period: '2012-2012',
      logo: '/images/companies/wavetec.png',
      website: 'https://wavetec.com',
    },
  ];

  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(companies.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('.company-card');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getGridCols = () => {
    // Better responsive grid for centering with 8 companies
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4';
  };

  return (
    <div id="companies-section" className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Section yPadding="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Companies I&apos;ve Worked With
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A journey through my career spanning startups, enterprises, and everything in between
          </p>
        </div>

        <div className="flex justify-center px-4">
          <div className={`grid ${getGridCols()} gap-6 md:gap-8 lg:gap-10 max-w-5xl w-full justify-items-center place-items-center`}>
            {companies.map((company, index) => {
              const CompanyCard = company.website ? 'a' : 'div';
              const cardProps = company.website
                ? {
                    href: company.website,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'cursor-pointer',
                  }
                : {};

              return (
                <CompanyCard
                  key={company.name}
                  {...cardProps}
                  className={`company-card group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                    visibleItems[index] ? 'animate-fade-in-up' : 'opacity-0'
                  } ${cardProps.className || ''}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  data-index={index}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-16 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg p-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={80}
                        height={64}
                        className={`max-w-full max-h-full object-contain ${
                          company.invertInLightMode 
                            ? 'filter invert dark:invert-0 dark:brightness-90' 
                            : 'filter dark:brightness-90'
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="logo-fallback hidden w-full h-full items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-300">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {company.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {company.period}
                      </p>
                    </div>
                  </div>
                  {company.website && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  )}
                </CompanyCard>
              );
            })}
          </div>
        </div>

        {/* Floating animation elements */}
        <div className="relative mt-20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-10 animate-spin-slow">⚙️</div>
          </div>
          <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>💻</div>
          <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '2s' }}>🚀</div>
        </div>
      </Section>
    </div>
  );
};

export default Companies;
