import { type AppType } from "next/dist/shared/lib/utils";
import { Provider as JotaiProvider } from "jotai";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <JotaiProvider>
      <Component {...pageProps} />
    </JotaiProvider>
  );
};

export default MyApp;
