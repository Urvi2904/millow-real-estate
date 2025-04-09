module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777',
      gas: 8000000, // good default
      gasPrice: 20000000000, // standard safe setting
    },
  },
  compilers: {
    solc: {
      version: '0.8.16',
      settings: {
        optimizer: {
          enabled: false,
        },
      },
    },
  },
};
