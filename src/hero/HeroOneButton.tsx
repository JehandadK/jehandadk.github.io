import type { ReactNode } from 'react';

type IHeroOneButtonProps = {
  title: ReactNode;
  description: string;
};

const HeroOneButton = (props: IHeroOneButtonProps) => (
  <header className="text-center">
    <h1 className="leading-hero whitespace-pre-line text-3xl font-bold text-gray-900 dark:text-white">
      {props.title}
    </h1>
    <div className="text-1xl mb-16 mt-4 text-gray-700 dark:text-gray-300">
      {props.description}
    </div>
  </header>
);

export { HeroOneButton };
