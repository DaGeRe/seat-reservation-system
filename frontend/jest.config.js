
module.exports = {
  globals: {
    fetch: global.fetch,
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(date-fns)/)", // Include date-fns for transformation
    "/node_modules/(?!@testing-library).+",
  ],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|webp|svg|ico|bmp|tiff)$": "/usr/src/app/src/Components/__mocks__/fileMock.js",
      "\\.(css|less|scss|sass)$": "/usr/src/app/src/Components/__mocks__/styleMock.js" // Mock CSS imports
    }
  };