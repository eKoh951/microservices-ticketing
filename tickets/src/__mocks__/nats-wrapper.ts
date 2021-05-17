export const natsWrapper = {
  client: {
    // jest.fn() returns a mock function
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        },
      ),
  },
};
