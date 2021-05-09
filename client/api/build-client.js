import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    // With create we return a pre-configured version of axios
    return axios.create({
      baseURL:
        // 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
        // Terminal, to get the servicename
        // kubectl get namespace
        // kubectl get services -n <namespace>
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
