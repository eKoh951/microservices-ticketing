// Singleton implementation of nats-client
import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // ? indicates that the variable might be undefined for a period of time
  private _client?: Stan; // _client is for TODO

  get client() {
    // TypeScript getter: This functions to prevent to ever call the natsWrapper
    // before creating the client, otherwise throws this error
    // this creates the 'client' property for the natsWrapper object
    if (!this._client) {
      throw new Error('Cannot acces NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
