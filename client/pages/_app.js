import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client';
import { Header } from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  // The Component will either be any page component. Ex: test or index component
  // And pageProps are going to be the components we passed within the text or index component
  // So everything here will be included on all pages
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  // Only to execute on pages where getInitialProps is defined
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    // currentUser: data.currentUser
    ...data,
  };
};

export default AppComponent;
