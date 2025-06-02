import { type NextPage } from 'next';
import Head from 'next/head';

import DevicePreview from '../components/DevicePreview';

const PreviewPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Device Preview - Visual Testing Tool</title>
        <meta
          name="description"
          content="Visual testing tool for responsive design and animations"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <DevicePreview url="http://localhost:4005" />
    </>
  );
};

export default PreviewPage;
