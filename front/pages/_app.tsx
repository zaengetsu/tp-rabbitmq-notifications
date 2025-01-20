import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component: PageComponent, pageProps }: AppProps): JSX.Element {
  return <PageComponent {...pageProps} />;
}
