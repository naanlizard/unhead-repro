
module.exports = {
    transform: {
        "^.+\\.(m?js|jsx|ts|tsx)$": "babel-jest"
    },
    transformIgnorePatterns: [
        "core-js"
    ],
    testEnvironment: "jest-environment-jsdom"
};
