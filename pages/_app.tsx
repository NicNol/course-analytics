import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "../components/ui/provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider>
        <Component {...pageProps} />
      </Provider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
