import { buildClient } from '../api/build-client';

// We are not allowed to fetch data during the SSR process (Server Side Rending)
const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// Instead we fetch data inside getInitialProps
// We use axios instead of useRequest hook, because hooks can only
// be used in React components

// getInitialProps will attempt to get that the page needs
// to initally fetch all the necessary data during the server-side rendering
LandingPage.getInitialProps = async (context) => {
  // This gets executed in a Node.js envinronment, NOT from the browser
  // The ONLY time it gets executed in the browser, is when a user navigated
  // from a page within our site ref lesson 218. When initialprops is called

  // Request object is loaded in the props when this function gets excecuted
  // on the server side, it would be as like the one we would receive in Node.js

  // The return object will show up as 'props' on the main component
  // const response = await axios.get('/api/users/currentusers');
  // return response.data;

  console.log('LANDING PAGE');

  // We are making use of our custom axios build
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
