import Link from 'next/link';

// We are not allowed to fetch data during the SSR process (Server Side Rending)
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// Instead we fetch data inside getInitialProps
// We use axios instead of useRequest hook, because hooks can only
// be used in React components

// getInitialProps will attempt to get that the page needs
// to initally fetch all the necessary data during the server-side rendering
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // This gets executed in a Node.js envinronment, NOT from the browser
  // The ONLY time it gets executed in the browser, is when a user navigated
  // from a page within our site ref lesson 218. When initialprops is called

  // Request object is loaded in the props when this function gets excecuted
  // on the server side, it would be as like the one we would receive in Node.js

  // The return object will show up as 'props' on the main component
  // const response = await axios.get('/api/users/currentusers');
  // return response.data;

  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
