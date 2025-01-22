import type { ReactNode } from 'react';

type INavbarProps = {
  children: ReactNode;
};

const NavbarTwoColumns = (props: INavbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <nav>
        <ul className="navbar flex items-center text-xl font-medium text-gray-800">
          {props.children}
        </ul>
      </nav>
    </div>
  );
};

export { NavbarTwoColumns };
