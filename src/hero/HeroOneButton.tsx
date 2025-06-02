import type { ReactNode } from 'react';

type IHeroOneButtonProps = {
  title: ReactNode;
  description: string;
};

const HeroOneButton = (props: IHeroOneButtonProps) => (
  <header className="text-center">
    <h1 className="lg:text-7xl whitespace-pre-line font-heading text-5xl font-black leading-tight tracking-tight md:text-6xl">
      {props.title}
    </h1>
    <div className="mb-16 mt-6 font-body text-lg font-light tracking-wide text-gray-600 dark:text-gray-400 md:text-xl lg:text-2xl">
      {props.description}
    </div>
  </header>
);

export { HeroOneButton };
