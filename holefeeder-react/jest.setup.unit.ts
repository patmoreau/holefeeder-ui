jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

// Mock structuredClone global function
global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
