import "../styles/globals.css";
import splitbee from "@splitbee/web";

splitbee.init();

function MyApp({ Component, pageProps }) {
  return (
    <div className="text-gray-900 antialiased">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
