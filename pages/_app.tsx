// pages/_app.tsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import { Global } from '@emotion/react';
import { Lora } from '@next/font/google';
import Layout from '../components/layout';
import React, { ReactElement, useEffect, useState } from 'react';

const lora = Lora({ subsets: ['latin'], display: 'swap' });

const theme = extendTheme({
  fonts: { heading: lora.style.fontFamily, body: lora.style.fontFamily },
  config: { initialColorMode: 'light', useSystemColorMode: true },
  styles: {
    global: (props) => ({
      body: {
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        color: props.colorMode === 'dark' ? 'white' : 'black',
        bg: props.colorMode === 'dark' ? 'black' : 'white',
      },
    }),
  },
});

const getDefaultLayout = (page: ReactElement) => <Layout>{page}</Layout>;

function useHydrationFix() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const getLayout = Component.getLayout || getDefaultLayout;
  const isHydrated = useHydrationFix();

  if (!isHydrated) {
    return null;
  }

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <DefaultSeo
          title='Iver Finne'
          description="I'm a constant learner and aspiring technical generalist."
          openGraph={{
            title: 'Iver Finne',
            description: "I'm a constant learner and aspiring technical generalist.",
            images: [{ url: 'https://iverfinne.no/og-image-dark.jpg', type: 'image/jpeg' }],
            siteName: 'Iver Finne',
          }}
        />
        <Global
          styles={{
            body: {
              overflowY: 'scroll',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            },
          }}
        />
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
    </SessionProvider>
  );
}