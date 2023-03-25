import { type AppType } from "next/dist/shared/lib/utils";
import { Provider as JotaiProvider } from "jotai";
import "~/styles/globals.css";
import {ConfigProvider} from "antd";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
      <ConfigProvider theme={{ token: {colorPrimary: '#2574A6',},}}>
        <JotaiProvider>
          <Component {...pageProps} />
        </JotaiProvider>
    </ConfigProvider>
  );
};

export default MyApp;
