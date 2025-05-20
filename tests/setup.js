
jest.mock('stripe', () => {
  return () => ({
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_test123' })
    },
    charges: {
      create: jest.fn().mockResolvedValue({ id: 'ch_test123' })
    },
    balance: {
      retrieve: jest.fn().mockResolvedValue({ available: [{ amount: 1000 }] })
    },
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ client_secret: 'secret_test' })
    }
  });
});
