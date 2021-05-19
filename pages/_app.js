import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="text-gray-900 antialiased">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
