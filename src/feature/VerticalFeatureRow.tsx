import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';

type IVerticalFeatureRowProps = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
};

const VerticalFeatureRow = (props: IVerticalFeatureRowProps) => {
  const router = useRouter();

  return (
    <div
      className={clsx(
        'mt-20 flex flex-wrap items-center',
        props.reverse && 'flex-row-reverse',
      )}
    >
      <div className="w-full text-center sm:w-1/2 sm:px-6">
        <h3 className="text-3xl font-semibold text-gray-900">{props.title}</h3>
        <div className="mt-6 text-xl leading-9">{props.description}</div>
      </div>

      <div className="w-full p-6 sm:w-1/2">
        <Image
          src={`${router.basePath}${props.image}`}
          alt={props.imageAlt}
          width={500}
          height={300}
          className="h-auto w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export { VerticalFeatureRow };
