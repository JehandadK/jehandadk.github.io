import clsx from 'clsx';

type IButtonProps = {
  xl?: boolean;
  children: string;
};

const Button = (props: IButtonProps) => {
  return (
    <div
      className={clsx(
        'inline-block rounded-md bg-primary-500 text-center text-white transition-colors hover:bg-primary-600',
        props.xl
          ? 'px-6 py-4 text-xl font-extrabold'
          : 'px-4 py-2 text-lg font-semibold',
      )}
    >
      {props.children}
    </div>
  );
};

export { Button };
